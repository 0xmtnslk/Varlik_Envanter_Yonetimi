import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, Edit, Trash2, Download, Upload, Grid, List, Search } from 'lucide-react'
import { IL_ILCE_DATA } from '../data/il-ilce'

const facilityTypes = [
  'Hastane',
  'Depo',
  'İdari Ofis',
  'Çağrı Merkezi',
  'Tıp Merkezi',
  'Diyaliz Merkezi',
  'Konuk Evi'
]

const FacilitiesList = () => {
  const navigate = useNavigate()
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/facilities', {
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

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleDeleteFacility = async (id) => {
    if (!window.confirm('Bu tesisi silmek istediğinize emin misiniz?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/facilities/${id}`, {
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

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/facilities/export', {
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
      
      const response = await fetch('http://localhost:3001/api/facilities/import', {
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
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
        <p className="text-sm text-gray-500 animate-pulse">Tesisler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tesisler</h1>
          <p className="text-sm text-gray-500 mt-1">Tesis yönetimi ve listeleme</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            {filteredFacilities.length} tesis
          </span>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tesis ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
            >
              <option value="">Tüm Tipler</option>
              {facilityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* View Toggle and Actions */}
          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2.5 transition-all duration-200 ${viewMode === 'card' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Kart Görünümü"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-all duration-200 ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Liste Görünümü"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Download className="h-4 w-4" />
              Şablon
            </button>
            <label className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer shadow-sm">
              <Upload className="h-4 w-4" />
              {importing ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
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
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'İçe Aktarılıyor...' : 'İçe Aktar'}
              </button>
            )}
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Dışa Aktarılıyor...' : 'Dışa Aktar'}
            </button>
            <button
              onClick={() => navigate('/settings/facilities/new')}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              Yeni Tesis
            </button>
          </div>
        </div>
      </div>

      {/* Facilities Display */}
      {filteredFacilities.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="p-4 bg-gray-50 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Henüz tesis eklenmemiş</h3>
          <p className="text-sm text-gray-500">İlk tesisinizi eklemek için "Yeni Tesis" butonunu kullanın</p>
        </div>
      ) : (
        <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
          {filteredFacilities.map(facility => (
            <div
              key={facility.id}
              onClick={() => navigate(`/settings/facilities/${facility.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
            >
              {viewMode === 'card' ? (
                // Card View
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <Building2 className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{facility.name}</h3>
                        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 mt-1">
                          {facility.facility_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {facility.short_name && `${facility.short_name} • `}
                    {facility.city && `${facility.city}`}
                    {facility.district && ` / ${facility.district}`}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    {facility.facility_code && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500 block">Tesis ID</span>
                        <span className="font-medium text-gray-900">{facility.facility_code}</span>
                      </div>
                    )}
                    {facility.bed_count && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500 block">Yatak Sayısı</span>
                        <span className="font-medium text-gray-900">{facility.bed_count}</span>
                      </div>
                    )}
                    {facility.employee_count && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500 block">Çalışan Sayısı</span>
                        <span className="font-medium text-gray-900">{facility.employee_count}</span>
                      </div>
                    )}
                    {facility.block_count && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-500 block">Blok Sayısı</span>
                        <span className="font-medium text-gray-900">{facility.block_count}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}`)
                      }}
                      className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium"
                    >
                      Detaylar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}/edit`)
                      }}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFacility(facility.id)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2.5 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{facility.name}</h3>
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 flex-shrink-0">
                          {facility.facility_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {facility.short_name && `${facility.short_name} • `}
                        {facility.city && `${facility.city}`}
                        {facility.district && ` / ${facility.district}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}`)
                      }}
                      className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                      title="Detaylar"
                    >
                      <Building2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}/edit`)
                      }}
                      className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                      title="Düzenle"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFacility(facility.id)
                      }}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Sil"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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

export default FacilitiesList
