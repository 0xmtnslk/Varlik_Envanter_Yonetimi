import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Users, Bell, FileText, Settings as SettingsIcon } from 'lucide-react'

const SettingsPage = () => {
  const { tab } = useParams()
  const activeTab = tab || 'general'

  // asset category state
  const [categories, setCategories] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

  // area type state
  const [areaTypes, setAreaTypes] = useState([])
  const [areaTypeName, setAreaTypeName] = useState('')
  const [areaTypeCategory, setAreaTypeCategory] = useState('')
  const [editingAreaType, setEditingAreaType] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [areaTypeError, setAreaTypeError] = useState('')
  const [areaTypeSuccess, setAreaTypeSuccess] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    if (activeTab === 'general') {
      fetchCategories()
    }
    if (activeTab === 'area-types') {
      fetchAreaTypes()
      setSelectedCategory('')
    }
  }, [activeTab])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories', err)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    try {
      const token = localStorage.getItem('token')
      const url = editingCategory
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings/categories/${editingCategory.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings/categories`
      const method = editingCategory ? 'PUT' : 'POST'
      const body = JSON.stringify({ name: categoryName })
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      })
      if (res.ok) {
        setCategoryName('')
        setEditingCategory(null)
        fetchCategories()
      }
    } catch (err) {
      console.error('Error saving category', err)
    }
  }

  const handleEditCategory = (cat) => {
    setEditingCategory(cat)
    setCategoryName(cat.name)
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/settings/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchCategories()
    } catch (err) {
      console.error('Error deleting category', err)
    }
  }

  // area type API
  const fetchAreaTypes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/areas/types`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAreaTypes(data || [])
    } catch (err) {
      console.error('Error fetching area types', err)
      setAreaTypeError('Alan türleri yüklenirken hata oluştu.')
    }
  }

  const handleAreaTypeSubmit = async (e) => {
    e.preventDefault()
    setAreaTypeError('')
    setAreaTypeSuccess('')

    const category = selectedCategory || areaTypeCategory
    if (!areaTypeName.trim() || !category.trim()) {
      setAreaTypeError('Kategori ve tür adı gereklidir.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const url = editingAreaType
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/areas/types/${editingAreaType.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/areas/types`
      const method = editingAreaType ? 'PUT' : 'POST'
      const body = JSON.stringify({ name: areaTypeName, category })
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      })
      const data = await res.json()
      if (res.ok) {
        setAreaTypeSuccess(editingAreaType ? 'Alan türü güncellendi.' : 'Alan türü eklendi.')
        setAreaTypeName('')
        if (!selectedCategory) setAreaTypeCategory('')
        setEditingAreaType(null)
        fetchAreaTypes()
      } else {
        setAreaTypeError(data.error || 'Alan türü kaydedilemedi. Lütfen kontrol ediniz.')
      }
    } catch (err) {
      console.error('Error saving area type', err)
      setAreaTypeError('Sunucuya bağlanılamadı.')
    }
  }

  const handleEditAreaType = (type) => {
    setAreaTypeError('')
    setAreaTypeSuccess('')
    setEditingAreaType(type)
    setAreaTypeName(type.name)
    setAreaTypeCategory(type.category)
    // if we're editing from a category view, make sure it's selected
    if (type.category) setSelectedCategory(type.category)
  }

  const handleDeleteAreaType = async (id) => {
    setAreaTypeError('')
    setAreaTypeSuccess('')
    if (!window.confirm('Bu alan türünü silmek istediğinize emin misiniz?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/areas/types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setAreaTypeSuccess('Alan türü silindi.')
        fetchAreaTypes()
      } else {
        setAreaTypeError(data.error || 'Alan türü silinirken hata oluştu.')
      }
    } catch (err) {
      console.error('Error deleting area type', err)
      setAreaTypeError('Sunucuya bağlanılamadı.')
    }
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case 'general':
        return 'Genel Ayarlar'
      case 'notifications':
        return 'Bildirim Ayarları'
      case 'users':
        return 'Kullanıcılar'
      case 'roles':
        return 'Rol Yönetimi'
      case 'area-types':
        return 'Alan Türleri'
      default:
        return 'Ayarlar'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getTabTitle()}</h1>
        <p className="text-gray-600 mt-1">Sistem ayarları ve yapılandırma</p>
      </div>

      {/* Content */}
      <div className="card">
        {activeTab === 'general' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Genel Ayarlar</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistem Adı
                </label>
                <input
                  type="text"
                  className="input"
                  defaultValue="Varlık Yönetim Sistemi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Şirket adını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Dil
                </label>
                <select className="input">
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat Dilimi
                </label>
                <select className="input">
                  <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                  <option value="UTC">UTC (UTC+0)</option>
                </select>
              </div>
              <button className="btn btn-primary">
                Kaydet
              </button>
            </div>

            {/* Asset categories manager */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Varlık Kategorileri</h2>
              <div className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="text-blue-600 hover:underline text-sm"
                      >Düzenle</button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-red-600 hover:underline text-sm"
                      >Sil</button>
                    </div>
                  </div>
                ))}
                <form onSubmit={handleCategorySubmit} className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Yeni kategori adı"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <button className="btn btn-primary text-sm" disabled={!categoryName.trim()}>
                    {editingCategory ? 'Güncelle' : 'Ekle'}
                  </button>
                </form>
              </div>
            </div>


          </div>
        )}

        {activeTab === 'area-types' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alan Türleri</h2>

            {/* category list view */}
            {!selectedCategory && (
              <>
                {areaTypeError && (
                  <div className="mb-4 text-sm text-red-600">{areaTypeError}</div>
                )}
                {areaTypeSuccess && (
                  <div className="mb-4 text-sm text-green-600">{areaTypeSuccess}</div>
                )}
                <div className="space-y-4">
                  {[...new Set(areaTypes.map(t => t.category))].map(cat => (
                    <div key={cat} className="flex items-center justify-between">
                      <button
                        onClick={() => { setSelectedCategory(cat); setAreaTypeError(''); setAreaTypeSuccess(''); setConfirmDeleteId(null); }}
                        className="text-left text-sm text-primary-600 hover:underline"
                      >{cat || '(kategori yok)'}</button>
                      <span className="text-gray-500">
                        {areaTypes.filter(t => t.category === cat).length} adet
                      </span>
                    </div>
                  ))}
                </div>

                {/* form for adding a new type when no category is selected */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-2">Yeni Alan Türü</h3>
                  <form onSubmit={handleAreaTypeSubmit} className="flex gap-2 flex-wrap">
                    <input
                      type="text"
                      className="input flex-1 min-w-[150px]"
                      placeholder="Kategori"
                      value={areaTypeCategory}
                      onChange={(e) => setAreaTypeCategory(e.target.value)}
                    />
                    <input
                      type="text"
                      className="input flex-1 min-w-[150px]"
                      placeholder="Tür adı"
                      value={areaTypeName}
                      onChange={(e) => setAreaTypeName(e.target.value)}
                    />
                    <button className="btn btn-primary text-sm" disabled={!areaTypeName.trim() || !areaTypeCategory.trim()}>
                      {editingAreaType ? 'Güncelle' : 'Ekle'}
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* types under selected category */}
            {selectedCategory && (
              <div className="space-y-6">
                {areaTypeError && (
                  <div className="text-sm text-red-600">{areaTypeError}</div>
                )}
                {areaTypeSuccess && (
                  <div className="text-sm text-green-600">{areaTypeSuccess}</div>
                )}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-sm text-gray-600 hover:underline"
                  >← Geri</button>
                  <h3 className="font-medium text-gray-800">{selectedCategory}</h3>
                </div>
                {areaTypes
                  .filter(t => t.category === selectedCategory)
                  .map(t => (
                    <div key={t.id} className="flex items-center justify-between">
                      <span>{t.name}</span>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleEditAreaType(t)}
                          className="text-blue-600 hover:underline text-sm"
                        >Düzenle</button>
                        {confirmDeleteId === t.id ? (
                          <>
                            <span className="text-sm text-gray-700">Silinsin mi?</span>
                            <button
                              onClick={() => { handleDeleteAreaType(t.id); setConfirmDeleteId(null); }}
                              className="text-red-600 hover:underline text-sm"
                            >Evet</button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-gray-600 hover:underline text-sm"
                            >Hayır</button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(t.id)}
                            className="text-red-600 hover:underline text-sm"
                          >Sil</button>
                        )}
                      </div>
                    </div>
                  ))}
                <form onSubmit={handleAreaTypeSubmit} className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    className="input flex-1 min-w-[150px]"
                    placeholder="Tür adı"
                    value={areaTypeName}
                    onChange={(e) => setAreaTypeName(e.target.value)}
                  />
                  {/* category fixed to selectedCategory */}
                  <input
                    type="hidden"
                    value={selectedCategory}
                  />
                  <button className="btn btn-primary text-sm" disabled={!areaTypeName.trim()}>
                    {editingAreaType ? 'Güncelle' : 'Ekle'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bildirim Ayarları</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h3>
                  <p className="text-sm text-gray-500">E-posta üzerinden bildirim al</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border peer-checked:bg-primary-600 peer-checked:after:border-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h3>
                  <p className="text-sm text-gray-500">SMS üzerinden bildirim al</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border peer-checked:bg-primary-600 peer-checked:after:border-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Bildirimleri</h3>
                  <p className="text-sm text-gray-500">Tarayıcı bildirimlerini al</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border peer-checked:bg-primary-600 peer-checked:after:border-primary-600"></div>
                </label>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Bildirim Tercihleri</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-700">Bakım hatırlatıcıları</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-700">Arıza talep bildirimleri</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-700">Sistem bildirimleri</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-700">Taşeron bildirimleri</span>
                  </label>
                </div>
              </div>
              <button className="btn btn-primary">
                Kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Kullanıcılar</h2>
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p>Kullanıcı yönetimi modülü yakında eklenecek</p>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Rol Yönetimi</h2>
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p>Rol yönetimi modülü yakında eklenecek</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
