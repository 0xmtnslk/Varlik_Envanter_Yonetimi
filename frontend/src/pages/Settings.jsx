import { useParams } from 'react-router-dom'
import { Users, Bell, FileText, Settings as SettingsIcon } from 'lucide-react'

const SettingsPage = () => {
  const { tab } = useParams()
  const activeTab = tab || 'general'

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
