import { useState, useEffect } from 'react'
import axios from 'axios'
import { Map, Plus, Filter, Search } from 'lucide-react'

const Areas = () => {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await axios.get('/api/areas')
      setAreas(response.data.areas || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching areas:', error)
      setLoading(false)
    }
  }

  const getCategoryBadge = (category) => {
    const categoryMap = {
      'Klinik Alan': { text: 'Klinik Alan', className: 'badge-primary' },
      'İdari Alan': { text: 'İdari Alan', className: 'badge-secondary' },
      'Teknik Alan': { text: 'Teknik Alan', className: 'badge-warning' },
      'Destek Alan': { text: 'Destek Alan', className: 'badge-info' },
      'Ortak Alan': { text: 'Ortak Alan', className: 'badge-success' }
    }
    return categoryMap[category] || { text: category, className: 'badge-info' }
  }

  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.area_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.area_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.facility_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || area.area_type_category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alan-Mahal Yönetimi</h1>
          <p className="text-gray-600 mt-1">Tesis alanları ve mahaller</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Alan
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="Klinik Alan">Klinik Alan</option>
              <option value="İdari Alan">İdari Alan</option>
              <option value="Teknik Alan">Teknik Alan</option>
              <option value="Destek Alan">Destek Alan</option>
              <option value="Ortak Alan">Ortak Alan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Areas */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alan Kodu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alan Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tesis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alan Boyutu (m²)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Alan bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredAreas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {area.area_code || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Map className="h-5 w-5 text-gray-400 mr-3" />
                          <div className="text-sm text-gray-900">{area.area_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getCategoryBadge(area.area_type_category).className}`}>
                          {getCategoryBadge(area.area_type_category).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {area.facility_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {area.floor_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {area.area_size || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          Detay
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Areas
