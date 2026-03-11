import { useState, useEffect } from 'react'
import axios from 'axios'
import { AlertTriangle, Plus, Filter, Search } from 'lucide-react'

const FaultRequests = () => {
  const [faultRequests, setFaultRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')

  useEffect(() => {
    fetchFaultRequests()
  }, [])

  const fetchFaultRequests = async () => {
    try {
      const response = await axios.get('/api/fault-requests')
      setFaultRequests(response.data.fault_requests || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching fault requests:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Bekliyor', className: 'badge-warning' },
      assigned: { text: 'Atandı', className: 'badge-info' },
      in_progress: { text: 'Devam Ediyor', className: 'badge-info' },
      completed: { text: 'Tamamlandı', className: 'badge-success' },
      cancelled: { text: 'İptal', className: 'badge-danger' }
    }
    return statusMap[status] || { text: status, className: 'badge-info' }
  }

  const getSeverityBadge = (severity) => {
    const severityMap = {
      low: { text: 'Düşük', className: 'badge-success' },
      medium: { text: 'Orta', className: 'badge-warning' },
      high: { text: 'Yüksek', className: 'badge-danger' },
      critical: { text: 'Kritik', className: 'badge-danger' }
    }
    return severityMap[severity] || { text: severity, className: 'badge-info' }
  }

  const filteredRequests = faultRequests.filter(request => {
    const matchesSearch = request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.asset_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || request.status === filterStatus
    const matchesSeverity = !filterSeverity || request.severity === filterSeverity
    return matchesSearch && matchesStatus && matchesSeverity
  })

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Arıza Talepleri</h1>
          <p className="text-sm text-gray-500 mt-1">Arıza bildirimleri ve takibi</p>
        </div>
        <button className="btn btn-primary rounded-xl">
          <Plus className="h-5 w-5 mr-2" />
          Yeni Talep
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
            >
              <option value="">Tüm Durumlar</option>
              <option value="pending">Bekliyor</option>
              <option value="assigned">Atandı</option>
              <option value="in_progress">Devam Ediyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="critical">Kritik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fault Requests */}
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
                    Talep No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Varlık
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Oluşturulma Tarihi
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Talep bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {request.request_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-red-50 mr-3">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{request.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.asset_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusBadge(request.status).className}`}>
                          {getStatusBadge(request.status).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getSeverityBadge(request.severity).className}`}>
                          {getSeverityBadge(request.severity).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.created_at).toLocaleDateString('tr-TR')}
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

export default FaultRequests
