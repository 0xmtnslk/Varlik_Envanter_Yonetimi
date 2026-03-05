import { useState, useEffect } from 'react'
import { Building2, Plus, Edit, Trash2, Download, Upload, X, ChevronDown, ChevronUp } from 'lucide-react'

const facilityTypes = [
  'Hastane',
  'Depo',
  'İdari Ofis',
  'Çağrı Merkezi',
  'Tıp Merkezi',
  'Diyaliz Merkezi',
  'Konuk Evi'
]

const hazardClasses = [
  'Çok Tehlikeli',
  'Tehlikeli',
  'Az Tehlikeli'
]

const FacilitiesManagement = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFacility, setEditingFacility] = useState(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [expandedFacility, setExpandedFacility] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Form state
  const [formData, setFormData] = useState({
    // Temel Bilgiler
    facility_code: '',
    name: '',
    short_name: '',
    facility_type: '',
    // İletişim Bilgileri
    address: '',
    city: '',
    district: '',
    website: '',
    phone: '',
    email: '',
    // Yasal Bilgiler
    trade_name: '',
    sgk_registration_number: '',
    nace_code: '',
    workplace_hazard_class: '',
    // Tesis Bilgileri
    block_count: 1,
    building_construction_year: '',
    building_height: '',
    structure_height: '',
    floor_count: '',
    closed_area: '',
    closed_parking_area: '',
    // Diğer Bilgiler
    bed_count: '',
    employee_count: '',
    contractor_employee_count: '',
    facility_manager_id: ''
  })

  // Block form state
  const [blockFormData, setBlockFormData] = useState({
    block_name: '',
    block_number: '',
    building_construction_year: '',
    building_height: '',
    structure_height: '',
    floor_count: '',
    closed_area: '',
    closed_parking_area: ''
  })

  const [editingBlock, setEditingBlock] = useState(null)

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/facilities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setFacilities(data.facilities || [])
    } catch (error) {
      console.error('Error fetching facilities:', error)
      showMessage('error', 'Tesisler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const fetchBlocks = async (facilityId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/facilities/${facilityId}/blocks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setBlocks(data || [])
    } catch (error) {
      console.error('Error fetching blocks:', error)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBlockInputChange = (e) => {
    const { name, value } = e.target
    setBlockFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingFacility
        ? `http://localhost:5001/api/facilities/${editingFacility.id}`
        : 'http://localhost:5001/api/facilities'
      
      const method = editingFacility ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        showMessage('success', editingFacility ? 'Tesis güncellendi' : 'Tesis oluşturuldu')
        setShowModal(false)
        setEditingFacility(null)
        resetForm()
        fetchFacilities()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'İşlem başarısız')
      }
    } catch (error) {
      console.error('Error saving facility:', error)
      showMessage('error', 'İşlem sırasında hata oluştu')
    }
  }

  const handleBlockSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingBlock
        ? `http://localhost:5001/api/facilities/${selectedFacility.id}/blocks/${editingBlock.id}`
        : `http://localhost:5001/api/facilities/${selectedFacility.id}/blocks`
      
      const method = editingBlock ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blockFormData)
      })
      
      if (response.ok) {
        showMessage('success', editingBlock ? 'Blok güncellendi' : 'Blok eklendi')
        setShowBlockModal(false)
        setEditingBlock(null)
        resetBlockForm()
        fetchBlocks(selectedFacility.id)
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'İşlem başarısız')
      }
    } catch (error) {
      console.error('Error saving block:', error)
      showMessage('error', 'İşlem sırasında hata oluştu')
    }
  }

  const handleDeleteFacility = async (id) => {
    if (!window.confirm('Bu tesisi silmek istediğinize emin misiniz?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/facilities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        showMessage('success', 'Tesis silindi')
        fetchFacilities()
      } else {
        showMessage('error', 'Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Error deleting facility:', error)
      showMessage('error', 'Silme sırasında hata oluştu')
    }
  }

  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm('Bu bloğu silmek istediğinize emin misiniz?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/facilities/${selectedFacility.id}/blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        showMessage('success', 'Blok silindi')
        fetchBlocks(selectedFacility.id)
      } else {
        showMessage('error', 'Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      showMessage('error', 'Silme sırasında hata oluştu')
    }
  }

  const handleEditFacility = (facility) => {
    setEditingFacility(facility)
    setFormData({
      facility_code: facility.facility_code || '',
      name: facility.name || '',
      short_name: facility.short_name || '',
      facility_type: facility.facility_type || '',
      address: facility.address || '',
      city: facility.city || '',
      district: facility.district || '',
      website: facility.website || '',
      phone: facility.phone || '',
      email: facility.email || '',
      trade_name: facility.trade_name || '',
      sgk_registration_number: facility.sgk_registration_number || '',
      nace_code: facility.nace_code || '',
      workplace_hazard_class: facility.workplace_hazard_class || '',
      block_count: facility.block_count || 1,
      building_construction_year: facility.building_construction_year || '',
      building_height: facility.building_height || '',
      structure_height: facility.structure_height || '',
      floor_count: facility.floor_count || '',
      closed_area: facility.closed_area || '',
      closed_parking_area: facility.closed_parking_area || '',
      bed_count: facility.bed_count || '',
      employee_count: facility.employee_count || '',
      contractor_employee_count: facility.contractor_employee_count || '',
      facility_manager_id: facility.facility_manager_id || ''
    })
    setShowModal(true)
  }

  const handleEditBlock = (block) => {
    setEditingBlock(block)
    setBlockFormData({
      block_name: block.block_name || '',
      block_number: block.block_number || '',
      building_construction_year: block.building_construction_year || '',
      building_height: block.building_height || '',
      structure_height: block.structure_height || '',
      floor_count: block.floor_count || '',
      closed_area: block.closed_area || '',
      closed_parking_area: block.closed_parking_area || ''
    })
    setShowBlockModal(true)
  }

  const resetForm = () => {
    setFormData({
      facility_code: '',
      name: '',
      short_name: '',
      facility_type: '',
      address: '',
      city: '',
      district: '',
      website: '',
      phone: '',
      email: '',
      trade_name: '',
      sgk_registration_number: '',
      nace_code: '',
      workplace_hazard_class: '',
      block_count: 1,
      building_construction_year: '',
      building_height: '',
      structure_height: '',
      floor_count: '',
      closed_area: '',
      closed_parking_area: '',
      bed_count: '',
      employee_count: '',
      contractor_employee_count: '',
      facility_manager_id: ''
    })
  }

  const resetBlockForm = () => {
    setBlockFormData({
      block_name: '',
      block_number: '',
      building_construction_year: '',
      building_height: '',
      structure_height: '',
      floor_count: '',
      closed_area: '',
      closed_parking_area: ''
    })
  }

  const handleOpenBlockModal = (facility) => {
    setSelectedFacility(facility)
    fetchBlocks(facility.id)
    setShowBlockModal(true)
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5001/api/facilities/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'tesisler_export.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        showMessage('success', 'CSV dosyası indirildi')
      } else {
        showMessage('error', 'Dışa aktarma başarısız')
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
      showMessage('error', 'Dışa aktarma sırasında hata oluştu')
    } finally {
      setExporting(false)
    }
  }

  const handleImportCSV = async () => {
    if (!importFile) {
      showMessage('error', 'Lütfen bir CSV dosyası seçin')
      return
    }
    
    setImporting(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', importFile)
      
      const response = await fetch('http://localhost:5001/api/facilities/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        showMessage('success', `${data.imported} tesis başarıyla içe aktarıldı`)
        setImportFile(null)
        fetchFacilities()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'İçe aktarma başarısız')
      }
    } catch (error) {
      console.error('Error importing CSV:', error)
      showMessage('error', 'İçe aktarma sırasında hata oluştu')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'Tesis ID',
      'Tesis Adı',
      'Tesis Kısa Adı',
      'Tesis Tipi',
      'Adres',
      'İl',
      'İlçe',
      'Web Sitesi',
      'Telefon',
      'E-posta',
      'Ticari Unvan',
      'SGK Sicil Numarası',
      'Nace Kodu',
      'İşyeri Tehlike Sınıfı',
      'Blok Sayısı',
      'Bina Yapım Yılı',
      'Bina Yüksekliği',
      'Yapı Yüksekliği',
      'Kat Sayısı',
      'Kapalı Alan',
      'Kapalı Otopark Alanı',
      'Yatak Sayısı',
      'Çalışan Sayısı',
      'Taşeron Çalışan Sayısı',
      'Tesis Yöneticisi',
      'Blok Adı',
      'Blok Numarası'
    ]
    
    const csvContent = '\uFEFF' + headers.join(',') + '\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tesisler_sablon.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.short_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || facility.facility_type === filterType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Tesis ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input"
          >
            <option value="">Tüm Tipler</option>
            {facilityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Şablon İndir
          </button>
          <label className="btn btn-secondary flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            {importing ? 'İçe Aktarılıyor...' : 'CSV İçe Aktar'}
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files[0])}
              className="hidden"
              disabled={importing}
            />
          </label>
          {importFile && (
            <button
              onClick={handleImportCSV}
              disabled={importing}
              className="btn btn-primary"
            >
              {importing ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
            </button>
          )}
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Dışa Aktarılıyor...' : 'CSV Dışa Aktar'}
          </button>
          <button
            onClick={() => {
              resetForm()
              setEditingFacility(null)
              setShowModal(true)
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Tesis
          </button>
        </div>
      </div>

      {/* Facilities List */}
      <div className="space-y-4">
        {filteredFacilities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p>Henüz tesis eklenmemiş</p>
          </div>
        ) : (
          filteredFacilities.map(facility => (
            <div key={facility.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                      {facility.facility_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {facility.short_name && `${facility.short_name} • `}
                    {facility.city && `${facility.city}`}
                    {facility.district && ` / ${facility.district}`}
                  </p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {facility.facility_code && (
                      <div>
                        <span className="text-gray-500">Tesis ID:</span>
                        <span className="ml-1 font-medium">{facility.facility_code}</span>
                      </div>
                    )}
                    {facility.bed_count && (
                      <div>
                        <span className="text-gray-500">Yatak Sayısı:</span>
                        <span className="ml-1 font-medium">{facility.bed_count}</span>
                      </div>
                    )}
                    {facility.employee_count && (
                      <div>
                        <span className="text-gray-500">Çalışan Sayısı:</span>
                        <span className="ml-1 font-medium">{facility.employee_count}</span>
                      </div>
                    )}
                    {facility.block_count && (
                      <div>
                        <span className="text-gray-500">Blok Sayısı:</span>
                        <span className="ml-1 font-medium">{facility.block_count}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedFacility(expandedFacility === facility.id ? null : facility.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedFacility === facility.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenBlockModal(facility)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="Blok Yönetimi"
                  >
                    <Building2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditFacility(facility)}
                    className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                    title="Düzenle"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFacility(facility.id)}
                    className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="Sil"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedFacility === facility.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {/* İletişim Bilgileri */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">İletişim Bilgileri</h4>
                      {facility.address && <p className="text-gray-600">{facility.address}</p>}
                      {facility.phone && <p className="text-gray-600">Telefon: {facility.phone}</p>}
                      {facility.email && <p className="text-gray-600">E-posta: {facility.email}</p>}
                      {facility.website && <p className="text-gray-600">Web: {facility.website}</p>}
                    </div>

                    {/* Yasal Bilgiler */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Yasal Bilgiler</h4>
                      {facility.trade_name && <p className="text-gray-600">Ticari Unvan: {facility.trade_name}</p>}
                      {facility.sgk_registration_number && (
                        <p className="text-gray-600">SGK Sicil: {facility.sgk_registration_number}</p>
                      )}
                      {facility.nace_code && <p className="text-gray-600">Nace Kodu: {facility.nace_code}</p>}
                      {facility.workplace_hazard_class && (
                        <p className="text-gray-600">Tehlike Sınıfı: {facility.workplace_hazard_class}</p>
                      )}
                    </div>

                    {/* Tesis Bilgileri */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tesis Bilgileri</h4>
                      {facility.building_construction_year && (
                        <p className="text-gray-600">Yapım Yılı: {facility.building_construction_year}</p>
                      )}
                      {facility.building_height && (
                        <p className="text-gray-600">Bina Yüksekliği: {facility.building_height}m</p>
                      )}
                      {facility.structure_height && (
                        <p className="text-gray-600">Yapı Yüksekliği: {facility.structure_height}m</p>
                      )}
                      {facility.floor_count && (
                        <p className="text-gray-600">Kat Sayısı: {facility.floor_count}</p>
                      )}
                      {facility.closed_area && (
                        <p className="text-gray-600">Kapalı Alan: {facility.closed_area}m²</p>
                      )}
                      {facility.closed_parking_area && (
                        <p className="text-gray-600">Otopark: {facility.closed_parking_area}m²</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Facility Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingFacility ? 'Tesis Düzenle' : 'Yeni Tesis Ekle'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingFacility(null)
                    resetForm()
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Temel Bilgiler */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tesis Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tesis Kısa Adı
                    </label>
                    <input
                      type="text"
                      name="short_name"
                      value={formData.short_name}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tesis Tipi <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="facility_type"
                      value={formData.facility_type}
                      onChange={handleInputChange}
                      required
                      className="input"
                    >
                      <option value="">Seçin</option>
                      {facilityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tesis ID
                    </label>
                    <input
                      type="text"
                      name="facility_code"
                      value={formData.facility_code}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Otomatik oluşturulacak"
                    />
                  </div>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İl
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Web Sitesi
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Yasal Bilgiler */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Yasal Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticari Unvan
                    </label>
                    <input
                      type="text"
                      name="trade_name"
                      value={formData.trade_name}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SGK Sicil Numarası
                    </label>
                    <input
                      type="text"
                      name="sgk_registration_number"
                      value={formData.sgk_registration_number}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nace Kodu
                    </label>
                    <input
                      type="text"
                      name="nace_code"
                      value={formData.nace_code}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İşyeri Tehlike Sınıfı
                    </label>
                    <select
                      name="workplace_hazard_class"
                      value={formData.workplace_hazard_class}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Seçin</option>
                      {hazardClasses.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tesis Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tesis Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blok Sayısı
                    </label>
                    <input
                      type="number"
                      name="block_count"
                      value={formData.block_count}
                      onChange={handleInputChange}
                      min="1"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bina Yapım Yılı
                    </label>
                    <input
                      type="number"
                      name="building_construction_year"
                      value={formData.building_construction_year}
                      onChange={handleInputChange}
                      min="1900"
                      max="2100"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bina Yüksekliği (m)
                    </label>
                    <input
                      type="number"
                      name="building_height"
                      value={formData.building_height}
                      onChange={handleInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yapı Yüksekliği (m)
                    </label>
                    <input
                      type="number"
                      name="structure_height"
                      value={formData.structure_height}
                      onChange={handleInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kat Sayısı
                    </label>
                    <input
                      type="number"
                      name="floor_count"
                      value={formData.floor_count}
                      onChange={handleInputChange}
                      min="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapalı Alan (m²)
                    </label>
                    <input
                      type="number"
                      name="closed_area"
                      value={formData.closed_area}
                      onChange={handleInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapalı Otopark Alanı (m²)
                    </label>
                    <input
                      type="number"
                      name="closed_parking_area"
                      value={formData.closed_parking_area}
                      onChange={handleInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Diğer Bilgiler */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Diğer Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yatak Sayısı
                    </label>
                    <input
                      type="number"
                      name="bed_count"
                      value={formData.bed_count}
                      onChange={handleInputChange}
                      min="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Çalışan Sayısı
                    </label>
                    <input
                      type="number"
                      name="employee_count"
                      value={formData.employee_count}
                      onChange={handleInputChange}
                      min="0"
                      className="input"
                      placeholder="Oracle'dan otomatik"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taşeron Çalışan Sayısı
                    </label>
                    <input
                      type="number"
                      name="contractor_employee_count"
                      value={formData.contractor_employee_count}
                      onChange={handleInputChange}
                      min="0"
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingFacility(null)
                    resetForm()
                  }}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFacility ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedFacility.name} - Blok Yönetimi
                </h2>
                <button
                  onClick={() => {
                    setShowBlockModal(false)
                    setSelectedFacility(null)
                    setEditingBlock(null)
                    resetBlockForm()
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Add Block Form */}
              <form onSubmit={handleBlockSubmit} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingBlock ? 'Blok Düzenle' : 'Yeni Blok Ekle'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blok Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="block_name"
                      value={blockFormData.block_name}
                      onChange={handleBlockInputChange}
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blok Numarası
                    </label>
                    <input
                      type="number"
                      name="block_number"
                      value={blockFormData.block_number}
                      onChange={handleBlockInputChange}
                      min="1"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yapım Yılı
                    </label>
                    <input
                      type="number"
                      name="building_construction_year"
                      value={blockFormData.building_construction_year}
                      onChange={handleBlockInputChange}
                      min="1900"
                      max="2100"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bina Yüksekliği (m)
                    </label>
                    <input
                      type="number"
                      name="building_height"
                      value={blockFormData.building_height}
                      onChange={handleBlockInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yapı Yüksekliği (m)
                    </label>
                    <input
                      type="number"
                      name="structure_height"
                      value={blockFormData.structure_height}
                      onChange={handleBlockInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kat Sayısı
                    </label>
                    <input
                      type="number"
                      name="floor_count"
                      value={blockFormData.floor_count}
                      onChange={handleBlockInputChange}
                      min="0"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapalı Alan (m²)
                    </label>
                    <input
                      type="number"
                      name="closed_area"
                      value={blockFormData.closed_area}
                      onChange={handleBlockInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Otopark Alanı (m²)
                    </label>
                    <input
                      type="number"
                      name="closed_parking_area"
                      value={blockFormData.closed_parking_area}
                      onChange={handleBlockInputChange}
                      step="0.01"
                      className="input"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  {editingBlock && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBlock(null)
                        resetBlockForm()
                      }}
                      className="btn btn-secondary"
                    >
                      İptal
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {editingBlock ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>

              {/* Blocks List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Bloklar</h3>
                {blocks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz blok eklenmemiş</p>
                ) : (
                  <div className="space-y-3">
                    {blocks.map(block => (
                      <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{block.block_name}</h4>
                              {block.block_number && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                  #{block.block_number}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              {block.building_construction_year && (
                                <div>
                                  <span className="text-gray-500">Yapım Yılı:</span>
                                  <span className="ml-1">{block.building_construction_year}</span>
                                </div>
                              )}
                              {block.building_height && (
                                <div>
                                  <span className="text-gray-500">Bina Yüksekliği:</span>
                                  <span className="ml-1">{block.building_height}m</span>
                                </div>
                              )}
                              {block.floor_count && (
                                <div>
                                  <span className="text-gray-500">Kat Sayısı:</span>
                                  <span className="ml-1">{block.floor_count}</span>
                                </div>
                              )}
                              {block.closed_area && (
                                <div>
                                  <span className="text-gray-500">Kapalı Alan:</span>
                                  <span className="ml-1">{block.closed_area}m²</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBlock(block)}
                              className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                              title="Düzenle"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlock(block.id)}
                              className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              title="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilitiesManagement
