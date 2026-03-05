import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Wrench,
  AlertTriangle,
  Package,
  Map,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Users,
  Building2,
  FileText
} from 'lucide-react'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const hasRole = (roles) => {
    if (!user?.roles) return false
    if (typeof roles === 'string') return user.roles.includes(roles)
    return roles.some(role => user.roles.includes(role))
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['User', 'Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Bakım & Periyodik Kontrol', href: '/maintenance', icon: Wrench, roles: ['Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Arıza Talep', href: '/fault-requests', icon: AlertTriangle, roles: ['User', 'Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Varlık Envanteri', href: '/assets', icon: Package, roles: ['Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Alan-Mahal', href: '/areas', icon: Map, roles: ['Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Takvim', href: '/calendar', icon: Calendar, roles: ['Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Bildirimler', href: '/notifications', icon: Bell, roles: ['User', 'Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
  ]

  const settingsItems = [
    { name: 'Genel Ayarlar', href: '/settings/general', icon: Settings, roles: ['Admin', 'Central Manager'] },
    { name: 'Bildirim Ayarları', href: '/settings/notifications', icon: Bell, roles: ['User', 'Technical Responsible', 'Administrative Responsible', 'Biomedical Responsible', 'Information Systems Responsible', 'Manager', 'Hospital Manager', 'Central Manager', 'Admin'] },
    { name: 'Kullanıcılar', href: '/settings/users', icon: Users, roles: ['Admin', 'Manager', 'Hospital Manager', 'Central Manager'] },
    { name: 'Rol Yönetimi', href: '/settings/roles', icon: Users, roles: ['Admin', 'Hospital Manager', 'Central Manager'] },
    { name: 'Tesisler', href: '/settings/facilities', icon: Building2, roles: ['Admin', 'Central Manager'] },
    { name: 'Taşeronler', href: '/settings/contractors', icon: FileText, roles: ['Admin', 'Central Manager', 'Hospital Manager'] },
  ]

  const filteredNavigation = navigationItems.filter(item => hasRole(item.roles))
  const filteredSettings = settingsItems.filter(item => hasRole(item.roles))

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Varlık Yönetimi</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">{user?.position}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {filteredNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Settings Section */}
            {filteredSettings.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Ayarlar
                  <ChevronDown
                    className={`ml-auto h-4 w-4 transition-transform ${
                      settingsOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {settingsOpen && (
                  <ul className="mt-2 space-y-1 pl-3">
                    {filteredSettings.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <Link
                to="/notifications"
                className="relative p-2 text-gray-500 hover:text-gray-700"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
