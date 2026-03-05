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

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tesisler</h1>
        <p className="text-gray-600 mt-1">Tesis yönetimi ve listeleme</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Actions Bar */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tesis ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input min-w-[150px]"
            >
              <option value="">Tüm Tipler</option>
              {facilityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* View Toggle and Actions */}
          <div className="flex gap-2 items-center">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 ${viewMode === 'card' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Kart Görünümü"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}
                title="Liste Görünümü"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={downloadTemplate}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Şablon
            </button>
            <label className="btn btn-secondary flex items-center gap-2 cursor-pointer">
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
              {exporting ? 'Dışa Aktarılıyor...' : 'Dışa Aktar'}
            </button>
            <button
              onClick={() => navigate('/settings/facilities/new')}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Tesis
            </button>
          </div>
        </div>
      </div>

      {/* Facilities Display */}
      {filteredFacilities.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>Henüz tesis eklenmemiş</p>
        </div>
      ) : (
        <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredFacilities.map(facility => (
            <div
              key={facility.id}
              onClick={() => navigate(`/settings/facilities/${facility.id}`)}
              className="card cursor-pointer hover:shadow-lg transition-shadow"
            >
              {viewMode === 'card' ? (
                // Card View
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                          {facility.facility_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {facility.short_name && `${facility.short_name} • `}
                    {facility.city && `${facility.city}`}
                    {facility.district && ` / ${facility.district}`}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
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
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}`)
                      }}
                      className="flex-1 btn btn-secondary text-sm"
                    >
                      Detaylar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}/edit`)
                      }}
                      className="flex-1 btn btn-primary text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFacility(facility.id)
                      }}
                      className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex items-center justify-between">
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
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}`)
                      }}
                      className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      title="Detaylar"
                    >
                      <Building2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/settings/facilities/${facility.id}/edit`)
                      }}
                      className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      title="Düzenle"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFacility(facility.id)
                      }}
                      className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
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
