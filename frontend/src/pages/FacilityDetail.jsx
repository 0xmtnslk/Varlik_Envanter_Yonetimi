import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2, Edit, Trash2, ArrowLeft, Plus } from 'lucide-react'

const FacilityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [facility, setFacility] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [editingBlock, setEditingBlock] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

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

  useEffect(() => {
    fetchFacility()
    fetchBlocks()
  }, [id])

  const fetchFacility = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/facilities/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setFacility(data)
    } catch (error) {
      console.error('Error fetching facility:', error)
      showMessage('error', 'Tesis bilgileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const fetchBlocks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/facilities/${id}/blocks`, {
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

  const handleDeleteFacility = async () => {
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
        navigate('/settings/facilities')
      } else {
        showMessage('error', 'Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Error deleting facility:', error)
      showMessage('error', 'Silme sırasında hata oluştu')
    }
  }

  const handleBlockSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingBlock
        ? `http://localhost:3001/api/facilities/${id}/blocks/${editingBlock.id}`
        : `http://localhost:3001/api/facilities/${id}/blocks`
      
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
        fetchBlocks()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'İşlem başarısız')
      }
    } catch (error) {
      console.error('Error saving block:', error)
      showMessage('error', 'İşlem sırasında hata oluştu')
    }
  }

  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm('Bu bloğu silmek istediğinize emin misiniz?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/facilities/${id}/blocks/${blockId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        showMessage('success', 'Blok silindi')
        fetchBlocks()
      } else {
        showMessage('error', 'Silme işlemi başarısız')
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      showMessage('error', 'Silme sırasında hata oluştu')
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!facility) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p>Tesis bulunamadı</p>
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/settings/facilities')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Tesislere Dön
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{facility.name}</h1>
          <p className="text-gray-600 mt-1">{facility.facility_type}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/settings/facilities/${id}/edit`)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Düzenle
          </button>
          <button
            onClick={handleDeleteFacility}
            className="btn btn-secondary flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facility.facility_code && (
            <div>
              <span className="text-sm text-gray-500">Tesis ID:</span>
              <span className="ml-2 font-medium">{facility.facility_code}</span>
            </div>
          )}
          {facility.short_name && (
            <div>
              <span className="text-sm text-gray-500">Tesis Kısa Adı:</span>
              <span className="ml-2 font-medium">{facility.short_name}</span>
            </div>
          )}
          {facility.facility_type && (
            <div>
              <span className="text-sm text-gray-500">Tesis Tipi:</span>
              <span className="ml-2 font-medium">{facility.facility_type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
        <div className="space-y-3">
          {facility.address && (
            <div>
              <span className="text-sm text-gray-500">Adres:</span>
              <span className="ml-2">{facility.address}</span>
            </div>
          )}
          {(facility.city || facility.district) && (
            <div>
              <span className="text-sm text-gray-500">İl/İlçe:</span>
              <span className="ml-2">{facility.city} {facility.district && `/ ${facility.district}`}</span>
            </div>
          )}
          {facility.website && (
            <div>
              <span className="text-sm text-gray-500">Web Sitesi:</span>
              <a href={facility.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary-600 hover:underline">
                {facility.website}
              </a>
            </div>
          )}
          {facility.phone && (
            <div>
              <span className="text-sm text-gray-500">Telefon:</span>
              <a href={`tel:${facility.phone}`} className="ml-2 text-primary-600 hover:underline">
                {facility.phone}
              </a>
            </div>
          )}
          {facility.email && (
            <div>
              <span className="text-sm text-gray-500">E-posta:</span>
              <a href={`mailto:${facility.email}`} className="ml-2 text-primary-600 hover:underline">
                {facility.email}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Legal Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yasal Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facility.trade_name && (
            <div>
              <span className="text-sm text-gray-500">Ticari Unvan:</span>
              <span className="ml-2">{facility.trade_name}</span>
            </div>
          )}
          {facility.sgk_registration_number && (
            <div>
              <span className="text-sm text-gray-500">SGK Sicil Numarası:</span>
              <span className="ml-2">{facility.sgk_registration_number}</span>
            </div>
          )}
          {facility.nace_code && (
            <div>
              <span className="text-sm text-gray-500">Nace Kodu:</span>
              <span className="ml-2">{facility.nace_code}</span>
            </div>
          )}
          {facility.workplace_hazard_class && (
            <div>
              <span className="text-sm text-gray-500">İşyeri Tehlike Sınıfı:</span>
              <span className="ml-2">{facility.workplace_hazard_class}</span>
            </div>
          )}
        </div>
      </div>

      {/* Facility Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tesis Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facility.block_count && (
            <div>
              <span className="text-sm text-gray-500">Blok Sayısı:</span>
              <span className="ml-2 font-medium">{facility.block_count}</span>
            </div>
          )}
          {facility.building_construction_year && (
            <div>
              <span className="text-sm text-gray-500">Bina Yapım Yılı:</span>
              <span className="ml-2 font-medium">{facility.building_construction_year}</span>
            </div>
          )}
          {facility.building_height && (
            <div>
              <span className="text-sm text-gray-500">Bina Yüksekliği:</span>
              <span className="ml-2 font-medium">{facility.building_height}m</span>
            </div>
          )}
          {facility.structure_height && (
            <div>
              <span className="text-sm text-gray-500">Yapı Yüksekliği:</span>
              <span className="ml-2 font-medium">{facility.structure_height}m</span>
            </div>
          )}
          {facility.floor_count && (
            <div>
              <span className="text-sm text-gray-500">Kat Sayısı:</span>
              <span className="ml-2 font-medium">{facility.floor_count}</span>
            </div>
          )}
          {facility.closed_area && (
            <div>
              <span className="text-sm text-gray-500">Kapalı Alan:</span>
              <span className="ml-2 font-medium">{facility.closed_area}m²</span>
            </div>
          )}
          {facility.closed_parking_area && (
            <div>
              <span className="text-sm text-gray-500">Kapalı Otopark Alanı:</span>
              <span className="ml-2 font-medium">{facility.closed_parking_area}m²</span>
            </div>
          )}
        </div>
      </div>

      {/* Other Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Diğer Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facility.bed_count && (
            <div>
              <span className="text-sm text-gray-500">Yatak Sayısı:</span>
              <span className="ml-2 font-medium">{facility.bed_count}</span>
            </div>
          )}
          {facility.employee_count && (
            <div>
              <span className="text-sm text-gray-500">Çalışan Sayısı:</span>
              <span className="ml-2 font-medium">{facility.employee_count}</span>
            </div>
          )}
          {facility.contractor_employee_count && (
            <div>
              <span className="text-sm text-gray-500">Taşeron Çalışan Sayısı:</span>
              <span className="ml-2 font-medium">{facility.contractor_employee_count}</span>
            </div>
          )}
        </div>
      </div>

      {/* Blocks Section */}
      <div className="card">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-gray-900">Bloklar ({blocks.length})</h3>
          <button
            onClick={() => {
              resetBlockForm()
              setEditingBlock(null)
              setShowBlockModal(true)
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Yeni Blok
          </button>
        </div>
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>Henüz blok eklenmemiş</p>
          </div>
        ) : (
          <div className="space-y-3 p-4 pt-2">
            {blocks.map(block => (
              <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{block.block_name}</h4>
                      {block.block_number && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          #{block.block_number}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
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

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBlock ? 'Blok Düzenle' : 'Yeni Blok Ekle'}
                </h2>
                <button
                  onClick={() => {
                    setShowBlockModal(false)
                    setEditingBlock(null)
                    resetBlockForm()
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBlockSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blok Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="block_name"
                    value={blockFormData.block_name}
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, block_name: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, block_number: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, building_construction_year: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, building_height: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, structure_height: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, floor_count: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, closed_area: e.target.value }))}
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
                    onChange={(e) => setBlockFormData(prev => ({ ...prev, closed_parking_area: e.target.value }))}
                    step="0.01"
                    className="input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBlockModal(false)
                    setEditingBlock(null)
                    resetBlockForm()
                  }}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBlock ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilityDetail
