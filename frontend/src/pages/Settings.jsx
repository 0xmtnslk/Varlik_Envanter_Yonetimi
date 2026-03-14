import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Users, Bell, FileText, Settings as SettingsIcon } from 'lucide-react'
import EquipmentHierarchy from '../components/EquipmentHierarchy'
import EquipmentCategories from '../components/EquipmentCategories'

const SettingsPage = () => {
  const { tab } = useParams()
  const activeTab = tab || 'general'

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
    if (activeTab === 'area-types') {
      fetchAreaTypes()
      setSelectedCategory('')
    }
  }, [activeTab])

  // area type API
  const fetchAreaTypes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/areas/types`, {
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
        ? `/api/areas/types/${editingAreaType.id}`
        : `/api/areas/types`
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
      const res = await fetch(`/api/areas/types/${id}`, {
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
      case 'categories':
        return 'Ekipman Kategorileri'
      case 'area-types':
        return 'Alan Türleri'
      case 'equipment-hierarchy':
        return 'Ekipman Cinsi Ayarları'
      default:
        return 'Ayarlar'
    }
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getTabTitle()}</h1>
          <p className="text-sm text-gray-500 mt-1">Sistem ayarları ve yapılandırma</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                  defaultValue="Varlık Yönetim Sistemi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                  placeholder="Şirket adını girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Varsayılan Dil
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm">
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat Dilimi
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm">
                  <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                  <option value="UTC">UTC (UTC+0)</option>
                </select>
              </div>
              <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
                Kaydet
              </button>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <EquipmentCategories />
        )}

        {activeTab === 'area-types' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Alan Türleri</h2>

            {/* category list view */}
            {!selectedCategory && (
              <>
                {areaTypeError && (
                  <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
                    {areaTypeError}
                  </div>
                )}
                {areaTypeSuccess && (
                  <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                    {areaTypeSuccess}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...new Set(areaTypes.map(t => t.category))].map(cat => (
                    <div
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setAreaTypeError(''); setAreaTypeSuccess(''); setConfirmDeleteId(null); }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                          <FileText className="h-5 w-5 text-primary-600" />
                        </div>
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {areaTypes.filter(t => t.category === cat).length} adet
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{cat || '(kategori yok)'}</h3>
                      <p className="text-sm text-gray-500 mt-1">Türü görüntüle</p>
                    </div>
                  ))}
                </div>

                {/* form for adding a new type when no category is selected */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Yeni Alan Türü Ekle</h3>
                  <form onSubmit={handleAreaTypeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                        placeholder="Kategori adı girin"
                        value={areaTypeCategory}
                        onChange={(e) => setAreaTypeCategory(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tür Adı</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                        placeholder="Tür adı girin"
                        value={areaTypeName}
                        onChange={(e) => setAreaTypeName(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!areaTypeName.trim() || !areaTypeCategory.trim()}
                    >
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
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
                    {areaTypeError}
                  </div>
                )}
                {areaTypeSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                    {areaTypeSuccess}
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
                  >
                    ← Geri
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">{selectedCategory}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {areaTypes
                    .filter(t => t.category === selectedCategory)
                    .map(t => (
                      <div
                        key={t.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-xl">
                              <FileText className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="text-base font-medium text-gray-900">{t.name}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => handleEditAreaType(t)}
                              className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                            >Düzenle</button>
                            {confirmDeleteId === t.id ? (
                              <>
                                <span className="text-sm text-gray-700 px-2">Silinsin mi?</span>
                                <button
                                  onClick={() => { handleDeleteAreaType(t.id); setConfirmDeleteId(null); }}
                                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                                >Evet</button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                                >Hayır</button>
                              </>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(t.id)}
                                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                              >Sil</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Yeni Tür Ekle</h3>
                  <form onSubmit={handleAreaTypeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tür Adı</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
                        placeholder="Tür adı girin"
                        value={areaTypeName}
                        onChange={(e) => setAreaTypeName(e.target.value)}
                      />
                      {/* category fixed to selectedCategory */}
                      <input
                        type="hidden"
                        value={selectedCategory}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!areaTypeName.trim()}
                    >
                      {editingAreaType ? 'Güncelle' : 'Ekle'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'equipment-hierarchy' && (
          <EquipmentHierarchy />
        )}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bildirim Ayarları</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                      <Bell className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">E-posta Bildirimleri</h3>
                      <p className="text-sm text-gray-500 mt-0.5">E-posta üzerinden bildirim al</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:border-primary-600"></div>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                      <Bell className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">SMS Bildirimleri</h3>
                      <p className="text-sm text-gray-500 mt-0.5">SMS üzerinden bildirim al</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:border-primary-600"></div>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                      <Bell className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Push Bildirimleri</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Tarayıcı bildirimlerini al</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:border-primary-600"></div>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Bildirim Tercihleri</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" defaultChecked />
                    <span className="text-sm font-medium text-gray-700">Bakım hatırlatıcıları</span>
                  </label>
                  <label className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" defaultChecked />
                    <span className="text-sm font-medium text-gray-700">Arıza talep bildirimleri</span>
                  </label>
                  <label className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" defaultChecked />
                    <span className="text-sm font-medium text-gray-700">Sistem bildirimleri</span>
                  </label>
                  <label className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" defaultChecked />
                    <span className="text-sm font-medium text-gray-700">Taşeron bildirimleri</span>
                  </label>
                </div>
              </div>
              <button className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md">
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
