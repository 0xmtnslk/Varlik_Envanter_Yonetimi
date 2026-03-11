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
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alan-Mahal Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Tesis alanları ve mahaller</p>
        </div>
        <button className="btn btn-primary rounded-xl">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Alan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
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
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
          <p className="text-sm text-gray-500 animate-pulse">Veriler yükleniyor...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Alan Kodu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Alan Adı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tesis
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Alan Boyutu (m²)
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Alan bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredAreas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {area.area_code || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-purple-50 mr-3">
                            <Map className="h-4 w-4 text-purple-600" />
                          </div>
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
                        <button className="text-primary-600 hover:text-primary-900 font-medium transition-colors">
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
