import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Users,
  Building2
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    assets: 0,
    maintenance: 0,
    faultRequests: 0,
    completed: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch statistics
      const [assetsRes, maintenanceRes, faultRes] = await Promise.all([
        axios.get('/api/assets'),
        axios.get('/api/maintenance/statistics'),
        axios.get('/api/fault-requests/statistics/dashboard')
      ])

      setStats({
        assets: assetsRes.data.assets?.length || 0,
        maintenance: maintenanceRes.data.pending || 0,
        faultRequests: faultRes.data.pending || 0,
        completed: faultRes.data.completed || 0
      })

      // Fetch recent activities (mock data for now)
      setRecentActivities([
        {
          id: 1,
          type: 'maintenance',
          title: 'Periyodik Bakım Tamamlandı',
          description: 'Jeneratör bakımı başarıyla tamamlandı',
          time: '2 saat önce',
          status: 'completed'
        },
        {
          id: 2,
          type: 'fault',
          title: 'Yeni Arıza Talebi',
          description: 'Havalandırma sistemi arızası bildirildi',
          time: '4 saat önce',
          status: 'pending'
        },
        {
          id: 3,
          type: 'asset',
          title: 'Yeni Varlık Eklendi',
          description: 'Yeni klima santrali envantere eklendi',
          time: '1 gün önce',
          status: 'completed'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Toplam Varlık',
      value: stats.assets,
      icon: Package,
      color: 'primary',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Bekleyen Bakım',
      value: stats.maintenance,
      icon: Wrench,
      color: 'warning',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Açık Arıza Talepleri',
      value: stats.faultRequests,
      icon: AlertTriangle,
      color: 'danger',
      change: '-8%',
      changeType: 'decrease'
    },
    {
      title: 'Tamamlanan İşler',
      value: stats.completed,
      icon: CheckCircle,
      color: 'success',
      change: '+15%',
      changeType: 'increase'
    }
  ]

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Sistem genel bakış ve istatistikler</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-6 w-6 text-danger-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Arıza Bildir</p>
              <p className="text-sm text-gray-600">Yeni arıza talebi oluştur</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-6 w-6 text-primary-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Bakım Planla</p>
              <p className="text-sm text-gray-600">Periyodik bakım ekle</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="h-6 w-6 text-success-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Varlık Ekle</p>
              <p className="text-sm text-gray-600">Yeni varlık kaydı</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
              <div className={`p-2 rounded-full mr-4 ${
                activity.type === 'maintenance' ? 'bg-primary-100' :
                activity.type === 'fault' ? 'bg-danger-100' :
                'bg-success-100'
              }`}>
                {activity.type === 'maintenance' && <Wrench className="h-5 w-5 text-primary-600" />}
                {activity.type === 'fault' && <AlertTriangle className="h-5 w-5 text-danger-600" />}
                {activity.type === 'asset' && <Package className="h-5 w-5 text-success-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <span className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'completed' ? 'bg-success-100 text-success-800' :
                  'bg-warning-100 text-warning-800'
                }`}>
                  {activity.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
