import { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Settings,
  AlertCircle
} from 'lucide-react'

const ChecklistSettings = () => {
  const [activeTab, setActiveTab] = useState('isg') // 'isg' or 'general'
  const [templates, setTemplates] = useState([])
  const [assignmentRules, setAssignmentRules] = useState([])
  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])
  const [maintenanceTypes, setMaintenanceTypes] = useState([])
  
  // Form states
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [selectedTemplateForAssignment, setSelectedTemplateForAssignment] = useState(null)
  
  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    checklist_type: 'ISG',
    is_active: true,
    items: []
  })
  
  // Item form state
  const [itemForm, setItemForm] = useState({
    question: '',
    item_type: 'boolean',
    is_required: true,
    options: '',
    validation_rules: ''
  })
  
  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    template_id: '',
    priority: 1,
    scope_type: 'GLOBAL',
    asset_id: '',
    category_id: '',
    maintenance_type: 'ALL',
    is_active: true
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedTemplate, setExpandedTemplate] = useState(null)

  useEffect(() => {
    fetchTemplates()
    fetchAssets()
    fetchCategories()
    fetchMaintenanceTypes()
  }, [activeTab])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const checklistType = activeTab === 'isg' ? 'ISG' : 'BAKIM'
      const res = await fetch(`/api/checklists/templates?checklist_type=${checklistType}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (err) {
      console.error('Error fetching templates:', err)
      setError('Şablonlar yüklenirken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/assets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAssets(data.assets || data || [])
    } catch (err) {
      console.error('Error fetching assets:', err)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings/categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCategories(data.categories || data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchMaintenanceTypes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings/maintenance-types', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setMaintenanceTypes(data.maintenance_types || data || [])
    } catch (err) {
      console.error('Error fetching maintenance types:', err)
    }
  }

  const fetchAssignmentRules = async (templateId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/checklists/assignment-rules?template_id=${templateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAssignmentRules(data.rules || [])
    } catch (err) {
      console.error('Error fetching assignment rules:', err)
    }
  }

  const handleTemplateSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      const url = editingTemplate 
        ? `/api/checklists/templates/${editingTemplate.id}`
        : '/api/checklists/templates'
      const method = editingTemplate ? 'PUT' : 'POST'
      
      const body = {
        ...templateForm,
        checklist_type: activeTab === 'isg' ? 'ISG' : 'BAKIM'
      }
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      if (res.ok) {
        setSuccess(editingTemplate ? 'Şablon güncellendi.' : 'Şablon oluşturuldu.')
        resetTemplateForm()
        fetchTemplates()
      } else {
        setError(data.error || 'Şablon kaydedilemedi.')
      }
    } catch (err) {
      console.error('Error saving template:', err)
      setError('Sunucuya bağlanılamadı.')
    }
  }

  const handleAddItem = () => {
    if (!itemForm.question) {
      setError('Soru metni gereklidir.')
      return
    }
    
    const newItem = {
      ...itemForm,
      order_index: templateForm.items.length
    }
    
    setTemplateForm({
      ...templateForm,
      items: [...templateForm.items, newItem]
    })
    
    setItemForm({
      question: '',
      item_type: 'boolean',
      is_required: true,
      options: '',
      validation_rules: ''
    })
  }

  const handleRemoveItem = (index) => {
    setTemplateForm({
      ...templateForm,
      items: templateForm.items.filter((_, i) => i !== index)
    })
  }

  const handleEditTemplate = async (template) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/checklists/templates/${template.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setEditingTemplate(data)
        setTemplateForm({
          name: data.name,
          description: data.description || '',
          checklist_type: data.checklist_type,
          is_active: data.is_active,
          items: data.items || []
        })
        setShowTemplateForm(true)
      }
    } catch (err) {
      console.error('Error fetching template details:', err)
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Bu şablonu silmek istediğinize emin misiniz?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/checklists/templates/${templateId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        setSuccess('Şablon silindi.')
        fetchTemplates()
      } else {
        setError('Şablon silinirken hata oluştu.')
      }
    } catch (err) {
      console.error('Error deleting template:', err)
      setError('Sunucuya bağlanılamadı.')
    }
  }

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/checklists/assignment-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(assignmentForm)
      })
      
      const data = await res.json()
      if (res.ok) {
        setSuccess('Atama kuralı oluşturuldu.')
        setShowAssignmentForm(false)
        if (selectedTemplateForAssignment) {
          fetchAssignmentRules(selectedTemplateForAssignment.id)
        }
      } else {
        setError(data.error || 'Atama kuralı oluşturulamadı.')
      }
    } catch (err) {
      console.error('Error creating assignment rule:', err)
      setError('Sunucuya bağlanılamadı.')
    }
  }

  const handleDeleteAssignmentRule = async (ruleId) => {
    if (!window.confirm('Bu atama kuralını silmek istediğinize emin misiniz?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/checklists/assignment-rules/${ruleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        setSuccess('Atama kuralı silindi.')
        if (selectedTemplateForAssignment) {
          fetchAssignmentRules(selectedTemplateForAssignment.id)
        }
      } else {
        setError('Atama kuralı silinirken hata oluştu.')
      }
    } catch (err) {
      console.error('Error deleting assignment rule:', err)
      setError('Sunucuya bağlanılamadı.')
    }
  }

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      checklist_type: activeTab === 'isg' ? 'ISG' : 'BAKIM',
      is_active: true,
      items: []
    })
    setEditingTemplate(null)
    setShowTemplateForm(false)
  }

  const toggleTemplateExpansion = async (templateId) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null)
      setAssignmentRules([])
    } else {
      setExpandedTemplate(templateId)
      await fetchAssignmentRules(templateId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === 'isg' ? 'İSG Kontrol Listeleri' : 'Kontrol Listeleri'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'isg' 
              ? 'İş sağlığı ve güvenliği kontrol listelerini yönetin'
              : 'Bakım ve genel kontrol listelerini yönetin'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('isg')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'isg'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            İSG Listeleri
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Bakım Listeleri
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* Add Template Button */}
      {!showTemplateForm && (
        <button
          onClick={() => setShowTemplateForm(true)}
          className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all text-sm font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Yeni {activeTab === 'isg' ? 'İSG' : 'Bakım'} Kontrol Listesi Ekle
        </button>
      )}

      {/* Template Form */}
      {showTemplateForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-gray-900">
              {editingTemplate ? 'Şablon Düzenle' : 'Yeni Şablon Oluştur'}
            </h3>
            <button
              onClick={resetTemplateForm}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleTemplateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şablon Adı *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                placeholder="Şablon adını girin"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                placeholder="Şablon açıklamasını girin"
                rows={3}
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  checked={templateForm.is_active}
                  onChange={(e) => setTemplateForm({ ...templateForm, is_active: e.target.checked })}
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
            </div>

            {/* Items Section */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Sorular / Kalemler</h4>
              
              {/* Add Item Form */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Soru *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Soru metnini girin"
                      value={itemForm.question}
                      onChange={(e) => setItemForm({ ...itemForm, question: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tip
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={itemForm.item_type}
                      onChange={(e) => setItemForm({ ...itemForm, item_type: e.target.value })}
                    >
                      <option value="boolean">Evet/Hayır</option>
                      <option value="numeric">Sayısal</option>
                      <option value="text">Metin</option>
                      <option value="select">Seçim</option>
                      <option value="photo">Fotoğraf</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zorunlu
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        checked={itemForm.is_required}
                        onChange={(e) => setItemForm({ ...itemForm, is_required: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">Evet</span>
                    </label>
                  </div>

                  {(itemForm.item_type === 'select') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seçenekler (virgülle ayırın)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Örn: Uygun, Uygun Değil, N/A"
                        value={itemForm.options}
                        onChange={(e) => setItemForm({ ...itemForm, options: e.target.value })}
                      />
                    </div>
                  )}

                  {(itemForm.item_type === 'numeric') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doğrulama Kuralları (JSON formatında)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder='Örn: {"min": 0, "max": 10, "unit": "bar"}'
                        value={itemForm.validation_rules}
                        onChange={(e) => setItemForm({ ...itemForm, validation_rules: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all text-sm font-medium"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Soru Ekle
                </button>
              </div>

              {/* Items List */}
              {templateForm.items.length > 0 && (
                <div className="space-y-2">
                  {templateForm.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">
                          {index + 1}.
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.question}</p>
                          <p className="text-xs text-gray-500">
                            {item.item_type} {item.is_required ? '• Zorunlu' : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
              >
                {editingTemplate ? 'Güncelle' : 'Oluştur'}
              </button>
              <button
                type="button"
                onClick={resetTemplateForm}
                className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>Henüz {activeTab === 'isg' ? 'İSG' : 'bakım'} kontrol listesi yok</p>
          <p className="text-sm mt-1">Yeni bir şablon oluşturarak başlayın</p>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Template Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2.5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{template.name}</h3>
                        {template.is_active ? (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Pasif
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {template.item_count || 0} soru • {template.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTemplateExpansion(template.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedTemplate === template.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedTemplate === template.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4">
                  {/* Assignment Rules Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Atama Kuralları</h4>
                      {!showAssignmentForm && (
                        <button
                          onClick={() => {
                            setSelectedTemplateForAssignment(template)
                            setAssignmentForm({
                              ...assignmentForm,
                              template_id: template.id
                            })
                            setShowAssignmentForm(true)
                          }}
                          className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          <Plus className="h-3 w-3 inline mr-1" />
                          Kural Ekle
                        </button>
                      )}
                    </div>

                    {showAssignmentForm && selectedTemplateForAssignment?.id === template.id && (
                      <div className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-900">Yeni Atama Kuralı</h5>
                          <button
                            onClick={() => setShowAssignmentForm(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                        <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kapsam
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                value={assignmentForm.scope_type}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, scope_type: e.target.value })}
                              >
                                <option value="GLOBAL">Genel (Tümü)</option>
                                <option value="CATEGORY">Kategori</option>
                                <option value="ASSET">Ekipman</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bakım Tipi
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                value={assignmentForm.maintenance_type}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, maintenance_type: e.target.value })}
                              >
                                <option value="ALL">Tümü</option>
                                {maintenanceTypes.map((mt) => (
                                  <option key={mt.id} value={mt.name}>
                                    {mt.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {assignmentForm.scope_type === 'ASSET' && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Ekipman
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                  value={assignmentForm.asset_id}
                                  onChange={(e) => setAssignmentForm({ ...assignmentForm, asset_id: e.target.value })}
                                  required
                                >
                                  <option value="">Seçin</option>
                                  {assets.map((asset) => (
                                    <option key={asset.id} value={asset.id}>
                                      {asset.name} ({asset.asset_code})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {assignmentForm.scope_type === 'CATEGORY' && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Kategori
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                  value={assignmentForm.category_id}
                                  onChange={(e) => setAssignmentForm({ ...assignmentForm, category_id: e.target.value })}
                                  required
                                >
                                  <option value="">Seçin</option>
                                  {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Öncelik
                              </label>
                              <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
                                value={assignmentForm.priority}
                                onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all text-sm font-medium"
                            >
                              Kaydet
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAssignmentForm(false)}
                              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                            >
                              İptal
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Assignment Rules List */}
                    {assignmentRules.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        Henüz atama kuralı yok
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {assignmentRules.map((rule) => (
                          <div
                            key={rule.id}
                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <Settings className="h-4 w-4 text-gray-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {rule.scope_type === 'GLOBAL' && 'Genel'}
                                  {rule.scope_type === 'CATEGORY' && `Kategori: ${rule.category_name}`}
                                  {rule.scope_type === 'ASSET' && `Ekipman: ${rule.asset_name}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Bakım: {rule.maintenance_type} • Öncelik: {rule.priority}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteAssignmentRule(rule.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChecklistSettings
