import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Settings as SettingsIcon, Users, Building2, Bell, FileText } from 'lucide-react'

const SettingsPage = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Settings, roles: ['Admin', 'Central Manager'] },
    { id: 'notifications', name: 'Bildirim Ayarları', icon: Bell, roles: ['User', 'Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { id: 'users', name: 'Kullanıcılar', icon: Users, roles: ['Admin', 'Manager', 'Hospital Manager', 'Central Manager'] },
    { id: 'roles', name: 'Rol Yönetimi', icon: Users, roles: ['Admin', 'Hospital Manager', 'Central Manager'] },
    { id: 'facilities', name: 'Tesisler', icon: Building2, roles: ['Admin', 'Central Manager'] },
    { id: 'contractors', name: 'Taşeronler', icon: FileText, roles: ['Admin', 'Central Manager', 'Hospital Manager'] },
  ]

  // Check URL for active tab
  useState(() => {
    const pathParts = location.pathname.split('/')
    if (pathParts.length > 2) {
      setActiveTab(pathParts[2])
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600 mt-1">Sistem ayarları ve yapılandırma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Ayarlar</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS Bildirimleri</h3>
                      <p className="text-sm text-gray-500">SMS üzerinden bildirim al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Push Bildirimleri</h3>
                      <p className="text-sm text-gray-500">Tarayıcı bildirimlerini al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
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

            {activeTab === 'facilities' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Tesisler</h2>
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p>Tesis yönetimi modülü yakında eklenecek</p>
                </div>
              </div>
            )}

            {activeTab === 'contractors' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Taşeronler</h2>
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p>Taşeron yönetimi modülü yakında eklenecek</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
