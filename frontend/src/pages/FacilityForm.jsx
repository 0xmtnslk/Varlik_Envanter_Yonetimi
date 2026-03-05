import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, ChevronRight, ChevronLeft, Search, Plus, Trash2 } from 'lucide-react'
import { IL_ILCE_DATA } from '../data/il-ilce'

const facilityTypes = [
  'Hastane',
  'Depo',
  'İdari Ofis',
  'Çağrı Merkezi',
  'Tıp Merkezi',
  'Diyaliz Merkezi',
  'Konuk Evi'
]

const hazardClasses = [
  'Çok Tehlikeli',
  'Tehlikeli',
  'Az Tehlikeli'
]

const steps = [
  { id: 1, title: 'Temel Bilgiler', icon: '📋' },
  { id: 2, title: 'İletişim Bilgileri', icon: '📞' },
  { id: 3, title: 'Yasal Bilgiler', icon: '⚖️' },
  { id: 4, title: 'Tesis Bilgileri', icon: '🏢' },
  { id: 5, title: 'Diğer Bilgiler', icon: '📊' }
]

const FacilityForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [generatedFacilityCode, setGeneratedFacilityCode] = useState('')
  
  const [citySearch, setCitySearch] = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  
  const [formData, setFormData] = useState({
    // Step 1: Temel Bilgiler
    facility_code: '',
    name: '',
    short_name: '',
    facility_type: '',
    // Step 2: İletişim Bilgileri
    address: '',
    city: '',
    district: '',
    website: '',
    phone: '',
    email: '',
    // Step 3: Yasal Bilgiler
    trade_name: '',
    sgk_registration_number: '',
    nace_code: '',
    workplace_hazard_class: '',
    // Step 4: Tesis Bilgileri
    block_count: 1,
    // Step 5: Diğer Bilgiler
    bed_count: '',
    employee_count: '',
    contractor_employee_count: '',
    facility_manager_id: ''
  })

  const [blocks, setBlocks] = useState([
    {
      block_name: '',
      block_number: '',
      building_construction_year: '',
      building_height: '',
      structure_height: '',
      floor_count: '',
      closed_area: '',
      closed_parking_area: ''
    }
  ])

  const [districts, setDistricts] = useState([])
  const [showCitySearch, setShowCitySearch] = useState(false)
  const [showDistrictSearch, setShowDistrictSearch] = useState(false)

  useEffect(() => {
    if (isEditing) {
      fetchFacility()
    }
  }, [id])

  useEffect(() => {
    if (formData.city && IL_ILCE_DATA[formData.city]) {
      setDistricts(IL_ILCE_DATA[formData.city])
    } else {
      setDistricts([])
    }
  }, [formData.city])

  useEffect(() => {
    // Update blocks array based on block_count
    if (formData.block_count > blocks.length) {
      const newBlocks = [...blocks]
      for (let i = blocks.length; i < formData.block_count; i++) {
        newBlocks.push({
          block_name: '',
          block_number: i + 1,
          building_construction_year: '',
          building_height: '',
          structure_height: '',
          floor_count: '',
          closed_area: '',
          closed_parking_area: ''
        })
      }
      setBlocks(newBlocks)
    } else if (formData.block_count < blocks.length) {
      setBlocks(blocks.slice(0, formData.block_count))
    }
  }, [formData.block_count])

  const fetchFacility = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5001/api/facilities/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setFormData({
        facility_code: data.facility_code || '',
        name: data.name || '',
        short_name: data.short_name || '',
        facility_type: data.facility_type || '',
        address: data.address || '',
        city: data.city || '',
        district: data.district || '',
        website: data.website || '',
        phone: data.phone || '',
        email: data.email || '',
        trade_name: data.trade_name || '',
        sgk_registration_number: data.sgk_registration_number || '',
        nace_code: data.nace_code || '',
        workplace_hazard_class: data.workplace_hazard_class || '',
        block_count: data.block_count || 1,
        bed_count: data.bed_count || '',
        employee_count: data.employee_count || '',
        contractor_employee_count: data.contractor_employee_count || '',
        facility_manager_id: data.facility_manager_id || ''
      })

      // Fetch blocks if they exist
      try {
        const blocksResponse = await fetch(`http://localhost:5001/api/facilities/${id}/blocks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (blocksResponse.ok) {
          const blocksData = await blocksResponse.json()
          if (blocksData.length > 0) {
            setBlocks(blocksData)
          }
        }
      } catch (blockError) {
        console.error('Error fetching blocks:', blockError)
        // Blocks endpoint might not exist yet, continue with default blocks
      }
    } catch (error) {
      console.error('Error fetching facility:', error)
      showMessage('error', 'Tesis bilgileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCityChange = (e) => {
    const city = e.target.value
    setFormData(prev => ({ ...prev, city, district: '' }))
    if (city && IL_ILCE_DATA[city]) {
      setDistricts(IL_ILCE_DATA[city])
    } else {
      setDistricts([])
    }
  }

  const generateFacilityCode = () => {
    const prefix = formData.facility_type?.substring(0, 3).toUpperCase() || 'TES'
    const timestamp = Date.now().toString(36).toUpperCase().substring(-4)
    const code = `${prefix}-${timestamp}`
    setGeneratedFacilityCode(code)
    return code
  }

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.name && formData.facility_type
      case 2:
        return true // Contact info is optional
      case 3:
        return true // Legal info is optional
      case 4:
        return true // Facility info is optional
      case 5:
        return true // Other info is optional
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      showMessage('error', 'Lütfen zorunlu alanları doldurun')
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      showMessage('error', 'Lütfen zorunlu alanları doldurun')
      return
    }
    
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      
      // Auto-generate facility code if not provided
      const finalFormData = {
        facility_code: formData.facility_code || generateFacilityCode(),
        name: formData.name,
        short_name: formData.short_name,
        facility_type: formData.facility_type,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        website: formData.website,
        phone: formData.phone,
        email: formData.email,
        trade_name: formData.trade_name,
        sgk_registration_number: formData.sgk_registration_number,
        nace_code: formData.nace_code,
        workplace_hazard_class: formData.workplace_hazard_class,
        block_count: formData.block_count,
        bed_count: formData.bed_count,
        employee_count: formData.employee_count,
        contractor_employee_count: formData.contractor_employee_count,
        facility_manager_id: formData.facility_manager_id,
        blocks: blocks
      }
      
      const url = isEditing
        ? `http://localhost:5001/api/facilities/${id}`
        : 'http://localhost:5001/api/facilities'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalFormData)
      })
      
      if (response.ok) {
        showMessage('success', isEditing ? 'Tesis güncellendi' : 'Tesis oluşturuldu')
        setTimeout(() => navigate('/settings/facilities'), 1500)
      } else {
        try {
          const error = await response.json()
          showMessage('error', error.error || `Hata: ${response.status}`)
        } catch (parseError) {
          showMessage('error', `Hata: ${response.status} ${response.statusText}`)
        }
      }
    } catch (error) {
      console.error('Error saving facility:', error)
      showMessage('error', `Bağlantı hatası: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Tesis Düzenle' : 'Yeni Tesis Ekle'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? formData.name : 'Adım adım tesis bilgilerini girin'}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center flex-1 ${
                index < steps.length - 1 ? 'justify-between' : 'justify-end'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.icon}
                </div>
                <span className="ml-2 text-sm font-medium hidden md:inline">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Temel Bilgiler */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tesis Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Tesis adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tesis Kısa Adı
                  </label>
                  <input
                    type="text"
                    name="short_name"
                    value={formData.short_name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Kısa ad girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tesis Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="facility_type"
                    value={formData.facility_type}
                    onChange={handleInputChange}
                    required
                    className="input"
                  >
                    <option value="">Seçin</option>
                    {facilityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tesis ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="facility_code"
                      value={formData.facility_code}
                      onChange={handleInputChange}
                      className="input flex-1"
                      placeholder="Otomatik oluşturulacak"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, facility_code: generateFacilityCode() }))}
                      className="btn btn-secondary"
                      title="Otomatik Oluştur"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: İletişim Bilgileri */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="input"
                    placeholder="Adres girin"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İl
                    </label>
                    <div className="relative">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleCityChange}
                        className="input pr-10"
                      >
                        <option value="">Seçin</option>
                        {Object.keys(IL_ILCE_DATA).sort().map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe
                    </label>
                    <div className="relative">
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        disabled={!formData.city}
                        className="input pr-10"
                      >
                        <option value="">Seçin</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Web Sitesi
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="+90 555 555 55 55"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="tesis@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Yasal Bilgiler */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yasal Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticari Unvan
                  </label>
                  <input
                    type="text"
                    name="trade_name"
                    value={formData.trade_name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Şirket ticari unvanı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SGK Sicil Numarası
                  </label>
                  <input
                    type="text"
                    name="sgk_registration_number"
                    value={formData.sgk_registration_number}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="SGK sicil numarası"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nace Kodu
                  </label>
                  <input
                    type="text"
                    name="nace_code"
                    value={formData.nace_code}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Nace kodu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İşyeri Tehlike Sınıfı
                  </label>
                  <select
                    name="workplace_hazard_class"
                    value={formData.workplace_hazard_class}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">Seçin</option>
                    {hazardClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Tesis Bilgileri */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tesis Bilgileri</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blok Sayısı
                  </label>
                  <input
                    type="number"
                    name="block_count"
                    value={formData.block_count}
                    onChange={handleInputChange}
                    min="1"
                    className="input"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Blok sayısı değiştiğinde aşağıdaki blok bilgilerini güncelleyin
                  </p>
                </div>

                {/* Blocks Management */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900">Blok Bilgileri</h3>
                  {blocks.map((block, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Blok {index + 1}</h4>
                        {blocks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newBlocks = blocks.filter((_, i) => i !== index)
                              setBlocks(newBlocks)
                              setFormData(prev => ({ ...prev, block_count: newBlocks.length }))
                            }}
                            className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blok Adı
                          </label>
                          <input
                            type="text"
                            value={block.block_name}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, block_name: e.target.value }
                              setBlocks(newBlocks)
                            }}
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blok Numarası
                          </label>
                          <input
                            type="number"
                            value={block.block_number}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, block_number: e.target.value }
                              setBlocks(newBlocks)
                            }}
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
                            value={block.building_construction_year}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, building_construction_year: e.target.value }
                              setBlocks(newBlocks)
                            }}
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
                            value={block.building_height}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, building_height: e.target.value }
                              setBlocks(newBlocks)
                            }}
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
                            value={block.structure_height}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, structure_height: e.target.value }
                              setBlocks(newBlocks)
                            }}
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
                            value={block.floor_count}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, floor_count: e.target.value }
                              setBlocks(newBlocks)
                            }}
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
                            value={block.closed_area}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, closed_area: e.target.value }
                              setBlocks(newBlocks)
                            }}
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
                            value={block.closed_parking_area}
                            onChange={(e) => {
                              const newBlocks = [...blocks]
                              newBlocks[index] = { ...block, closed_parking_area: e.target.value }
                              setBlocks(newBlocks)
                            }}
                            step="0.01"
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newBlocks = [...blocks, {
                        block_name: '',
                        block_number: blocks.length + 1,
                        building_construction_year: '',
                        building_height: '',
                        structure_height: '',
                        floor_count: '',
                        closed_area: '',
                        closed_parking_area: ''
                      }]
                      setBlocks(newBlocks)
                      setFormData(prev => ({ ...prev, block_count: newBlocks.length }))
                    }}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Blok Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Diğer Bilgiler */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Diğer Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yatak Sayısı
                  </label>
                  <input
                    type="number"
                    name="bed_count"
                    value={formData.bed_count}
                    onChange={handleInputChange}
                    min="0"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Çalışan Sayısı
                  </label>
                  <input
                    type="number"
                    name="employee_count"
                    value={formData.employee_count}
                    onChange={handleInputChange}
                    min="0"
                    className="input"
                    placeholder="Oracle'dan otomatik"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taşeron Çalışan Sayısı
                  </label>
                  <input
                    type="number"
                    name="contractor_employee_count"
                    value={formData.contractor_employee_count}
                    onChange={handleInputChange}
                    min="0"
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/settings/facilities')}
              className="btn btn-secondary"
            >
              İptal
            </button>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </button>
              )}
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary flex items-center gap-2"
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : `Kaydet (${generatedFacilityCode || 'Otomatik'})`)}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FacilityForm
