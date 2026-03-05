import { useState, useEffect } from 'react'
import axios from 'axios'
import { Bell, Check, Trash2, Filter } from 'lucide-react'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications')
      setNotifications(response.data.notifications || [])
      setUnreadCount(response.data.unread_count || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`)
      setNotifications(notifications.filter(n => n.id !== id))
      if (notifications.find(n => n.id === id)?.is_read === false) {
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type) => {
    const iconMap = {
      maintenance: 'bg-primary-100 text-primary-600',
      fault_request: 'bg-danger-100 text-danger-600',
      system: 'bg-secondary-100 text-secondary-600',
      contractor: 'bg-success-100 text-success-600'
    }
    return iconMap[type] || 'bg-gray-100 text-gray-600'
  }

  const getNotificationTypeText = (type) => {
    const typeMap = {
      maintenance: 'Bakım',
      fault_request: 'Arıza Talebi',
      system: 'Sistem',
      contractor: 'Taşeron'
    }
    return typeMap[type] || type
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.is_read
    if (filter === 'read') return n.is_read
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 && `${unreadCount} okunmamış bildirim`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn btn-secondary"
          >
            <Check className="h-5 w-5 mr-2" />
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Okunmamış
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'read' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Okunmuş
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="card text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Bildirim bulunamadı</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card relative ${!notification.is_read ? 'bg-blue-50 border-l-4 border-l-primary-500' : ''}`}
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${getNotificationIcon(notification.notification_type)}`}>
                    <Bell className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleString('tr-TR')}
                          </span>
                          <span className={`badge ${getNotificationIcon(notification.notification_type)}`}>
                            {getNotificationTypeText(notification.notification_type)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            title="Okundu işaretle"
                          >
                            <Check className="h-5 w-5 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
