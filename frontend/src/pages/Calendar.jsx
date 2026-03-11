import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Wrench, AlertTriangle, CalendarDays, ClipboardCheck } from 'lucide-react'  // ClipboardCheck for periyodik kontrol icon

const Calendar = () => {
  const [events, setEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('year') // 'year' or 'month'
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(true)  

  // list of month names for year view and other helpers
  const monthsList = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  useEffect(() => {
    if (viewMode === 'year') {
      setSelectedDay(null)
    }
  }, [viewMode])

  const fetchEvents = async () => {
    try {
      // always load the whole year so that we can switch between month/year without refetching
      const startDate = new Date(currentDate.getFullYear(), 0, 1)
      const endDate = new Date(currentDate.getFullYear(), 11, 31)

      const response = await axios.get('/api/calendar/range', {
        params: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      })

      setEvents(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      setLoading(false)
    }
  }




  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1 // Pazartesi başlangıç için düzeltme
  }

  const getMonthName = (date) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ]
    return months[date.getMonth()]
  }

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const previousYear = () =>
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1))

  const nextYear = () =>
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1))

  const selectMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1))
    setViewMode('month')
  }

  const getDateStr = (day) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // return events depending on the currently rendered view (month/year)
  const getEventsForDay = (day) =>
    filteredEvents.filter(event => event.start_date === getDateStr(day))

  const today = new Date()
  const isToday = (day) =>
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth() &&
    today.getDate() === day

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : []

  const eventTypeConfig = {
    maintenance: {
      label: 'Bakım',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
      icon: Wrench,
      cardBg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    fault_request: {
      label: 'Arıza Talebi',
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500',
      icon: AlertTriangle,
      cardBg: 'bg-red-50',
      border: 'border-red-200'
    },
    periodic_check: {
      label: 'Periyodik Kontrol',
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
      icon: ClipboardCheck,
      cardBg: 'bg-green-50',
      border: 'border-green-200'
    }
  }

  const getEventConfig = (type) =>
    eventTypeConfig[type] || {
      label: 'Diğer',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      dot: 'bg-gray-500',
      icon: CalendarDays,
      cardBg: 'bg-gray-50',
      border: 'border-gray-200'
    }

  // compute counts based on filtered events (year or month)
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.start_date)
      if (viewMode === 'year') {
        return d.getFullYear() === currentDate.getFullYear()
      }
      return (
        d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth()
      )
    })
  }, [events, currentDate, viewMode])

  const totalEvents = filteredEvents.length
  const maintenanceCount = filteredEvents.filter(e => e.type === 'maintenance').length
  const faultCount = filteredEvents.filter(e => e.type === 'fault_request').length
  const periodicCount = filteredEvents.filter(e => e.type === 'periodic_check').length

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Boş hücreler
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50/50 rounded-xl"></div>
      )
    }

    // Günler
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day)
      const hasEvents = dayEvents.length > 0
      const isSelected = selectedDay === day
      const isTodayDay = isToday(day)

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDay(isSelected ? null : day)}
          className={`h-24 rounded-xl p-2 cursor-pointer transition-all duration-200 border
            ${isSelected
              ? 'border-blue-400 bg-blue-50 shadow-md'
              : isTodayDay
              ? 'border-blue-200 bg-blue-50/60'
              : hasEvents
              ? 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
              : 'border-transparent bg-white hover:bg-gray-50'
            }`}
        >
          {/* Gün numarası */}
          <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1
            ${isTodayDay
              ? 'bg-blue-600 text-white'
              : isSelected
              ? 'bg-blue-500 text-white'
              : 'text-gray-700'
            }`}>
            {day}
          </div>

          {/* Etkinlik noktaları / etiketleri */}
          <div className="space-y-0.5">
            {dayEvents.slice(0, 2).map((event, index) => {
              const config = getEventConfig(event.type)
              return (
                <div
                  key={index}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium truncate ${config.bg} ${config.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`}></span>
                  <span className="truncate">{event.title}</span>
                </div>
              )
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-400 pl-1 font-medium">
                +{dayEvents.length - 2} daha
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const renderYearView = () => {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
        {monthsList.map((m, idx) => {
          const monthEvents = events.filter(e => {
            const d = new Date(e.start_date)
            return (
              d.getFullYear() === currentDate.getFullYear() &&
              d.getMonth() === idx
            )
          })
          return (
            <div
              key={idx}
              onClick={() => selectMonth(idx)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md p-4 transition"
            >
              <h4 className="text-sm font-semibold text-gray-700">{m}</h4>
              <p className="text-xs text-gray-500 mt-1">{monthEvents.length} etkinlik</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-5 p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Takvim</h1>
          <p className="text-sm text-gray-500 mt-1">Bakım, periyodik kontrol ve arıza planları</p>
        </div>

        {/* Özet Sayaçlar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-sm font-medium text-gray-700">{maintenanceCount} Bakım</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium text-gray-700">{periodicCount} Periyodik</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium text-gray-700">{faultCount} Arıza</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{totalEvents} Toplam</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
          <p className="text-sm text-gray-500 animate-pulse">Veriler yükleniyor...</p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Takvim Ana Alan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Ay / Yıl Navigasyonu */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
              <button
                onClick={viewMode === 'year' ? previousYear : previousMonth}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {viewMode === 'year'
                  ? currentDate.getFullYear()
                  : `${getMonthName(currentDate)} ${currentDate.getFullYear()}`}
              </h2>
              <button
                onClick={viewMode === 'year' ? nextYear : nextMonth}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setViewMode(viewMode === 'year' ? 'month' : 'year')
                  setSelectedDay(null)
                }}
                className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs"
              >
                {viewMode === 'year' ? 'Aylık Görünüm' : 'Yıllık Görünüm'}
              </button>
            </div>

            {viewMode === 'year' ? (
              renderYearView()
            ) : (
              <>
                {/* Haftanın Günleri */}
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                    <div
                      key={day}
                      className={`py-3 text-xs font-bold text-center uppercase tracking-wider
                        ${i >= 5 ? 'text-red-400' : 'text-gray-500'}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Takvim Grid */}
                <div className="grid grid-cols-7 gap-1 p-3">
                  {renderCalendar()}
                </div>
              </>
            )}
          </div>

          {/* Alt Panel: Seçili Gün Detayı + Legend */}
          {viewMode === 'month' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Seçili Gün Detayı */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                {selectedDay ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedDay} {getMonthName(currentDate)} {currentDate.getFullYear()}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                        {selectedDayEvents.length} etkinlik
                      </span>
                    </div>

                    {selectedDayEvents.length === 0 ? (
                      <div className="text-center py-12">
                        <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Bu gün için etkinlik yok</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDayEvents.map((event, index) => {
                          const config = getEventConfig(event.type)
                          const Icon = config.icon
                          return (
                            <div
                              key={index}
                              className={`p-4 rounded-xl border ${config.cardBg} ${config.border} hover:shadow-md transition-shadow duration-200`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                                  <Icon className={`h-5 w-5 ${config.text}`} />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-base font-semibold ${config.text}`}>{event.title}</p>
                                  <p className="text-sm text-gray-500 mt-1">{config.label}</p>
                                  {event.description && (
                                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Planning actions */}
                    <div className="mt-6 flex gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl">
                        Yeni İş Emri Planla
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-xl">
                        Çalışan Ata
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-base font-semibold text-gray-700">Gün Seçin</p>
                    <p className="text-sm text-gray-400 mt-1">Etkinlik detaylarını görmek için takvimden bir gün seçin</p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Etkinlik Türleri</h3>
                <div className="space-y-2">
                  {Object.entries(eventTypeConfig).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={key} className={`flex items-center gap-3 p-2.5 rounded-xl ${config.cardBg} border ${config.border}`}>
                        <div className={`p-1.5 rounded-lg ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.text}`} />
                        </div>
                        <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Yıllık bakışta detay görmek için bir ay seçin</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Calendar