import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Folder, FolderOpen, Search, Grid, List, Sparkles } from 'lucide-react'

// Card View Component for Category
const CategoryCard = ({
  category,
  level,
  expandedCategories,
  toggleCategory,
  onEdit,
  onDelete,
  onAddSubcategory,
  isEditing,
  editingName,
  setEditingName,
  onSaveEdit,
  onCancelEdit
}) => {
  const hasChildren = category.children && category.children.length > 0
  const isExpanded = expandedCategories.has(category.id)
  const levelColors = [
    'from-purple-500 to-purple-600',
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-orange-500 to-orange-600'
  ]
  const levelLabels = ['Ana Kategori', 'Alt Kategori', 'Alt Kategori 2', 'Alt Kategori 3']

  return (
    <div className={`category-card ${level > 0 ? 'ml-4 sm:ml-8' : ''}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
        {/* Card Header with Gradient */}
        <div className={`bg-gradient-to-r ${levelColors[level % 4]} px-4 py-3`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3 flex-1">
              {(hasChildren || level > 0) && (
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              <div className="flex items-center gap-2 flex-1">
                {isExpanded ? (
                  <FolderOpen className="h-5 w-5" />
                ) : (
                  <Folder className="h-5 w-5" />
                )}
                <span className="font-semibold text-base truncate">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="bg-white/20 text-white placeholder-white/70 px-2 py-1 rounded-lg border-0 focus:ring-2 focus:ring-white/50 w-full"
                      placeholder="Kategori adı"
                      autoFocus
                    />
                  ) : (
                    category.name
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {category.asset_count !== undefined && category.asset_count > 0 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm">
                  {category.asset_count}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {levelLabels[level % 4]}
              </span>
              <span className="text-xs text-gray-500">
                {hasChildren ? `${category.children.length} alt kategori` : 'Alt kategori yok'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={() => onSaveEdit(category)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                    title="Kaydet"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    title="İptal"
                  >
                    <ChevronRight className="h-4 w-4 rotate-90" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onAddSubcategory(category)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="Alt Kategori Ekle"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="px-4 pb-4 space-y-3">
            {category.children.map(child => (
              <CategoryCard
                key={child.id}
                category={child}
                level={level + 1}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubcategory={onAddSubcategory}
                isEditing={isEditing}
                editingName={editingName}
                setEditingName={setEditingName}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// List View Component for Category
const CategoryListItem = ({
  category,
  level,
  expandedCategories,
  toggleCategory,
  onEdit,
  onDelete,
  onAddSubcategory,
  isEditing,
  editingName,
  setEditingName,
  onSaveEdit,
  onCancelEdit
}) => {
  const hasChildren = category.children && category.children.length > 0
  const isExpanded = expandedCategories.has(category.id)
  const levelColors = [
    'border-l-purple-500',
    'border-l-blue-500',
    'border-l-emerald-500',
    'border-l-orange-500'
  ]
  const levelLabels = ['Ana Kategori', 'Alt Kategori', 'Alt Kategori 2', 'Alt Kategori 3']

  return (
    <div className={`category-list-item ${level > 0 ? 'ml-4 sm:ml-8' : ''}`}>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${levelColors[level % 4]} p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {(hasChildren || level > 0) && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            <div className={`p-2 rounded-xl ${isExpanded ? 'bg-primary-50' : 'bg-gray-50'}`}>
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-primary-600" />
              ) : (
                <Folder className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Kategori adı"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {category.name}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {levelLabels[level % 4]}
                  </span>
                </div>
              )}
            </div>
            {category.asset_count !== undefined && category.asset_count > 0 && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {category.asset_count}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => onSaveEdit(category)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                  title="Kaydet"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="İptal"
                >
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onAddSubcategory(category)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  title="Alt Kategori Ekle"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Düzenle"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-2 space-y-2">
          {category.children.map(child => (
            <CategoryListItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubcategory={onAddSubcategory}
              isEditing={isEditing}
              editingName={editingName}
              setEditingName={setEditingName}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Main Equipment Categories Component
const EquipmentCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [addingSubcategory, setAddingSubcategory] = useState(null)
  const [newSubcategoryName, setNewSubcategoryName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings/equipment-categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCategories(data || [])
      // Expand root categories by default
      if (data && data.length > 0) {
        setExpandedCategories(new Set(data.map(c => c.id)))
      }
    } catch (err) {
      console.error('Error fetching equipment categories', err)
      setError('Kategoriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    
    const filterRecursive = (items) => {
      return items.reduce((acc, item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const filteredChildren = item.children ? filterRecursive(item.children) : []
        
        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children
          })
        }
        return acc
      }, [])
    }
    
    return filterRecursive(categories)
  }, [categories, searchQuery])

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Edit category
  const handleEdit = (category) => {
    setEditingCategory(category)
    setEditingName(category.name)
    setAddingSubcategory(null)
  }

  // Save edit
  const handleSaveEdit = async (category) => {
    if (!editingName.trim()) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/settings/equipment-categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingName,
          parent_id: category.parent_id,
          description: category.description
        })
      })
      if (res.ok) {
        setEditingCategory(null)
        setEditingName('')
        fetchCategories()
      }
    } catch (err) {
      console.error('Error updating category', err)
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditingName('')
  }

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/settings/equipment-categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setExpandedCategories(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        fetchCategories()
      }
    } catch (err) {
      console.error('Error deleting category', err)
    }
  }

  // Add subcategory
  const handleAddSubcategory = (parentCategory) => {
    setAddingSubcategory(parentCategory.id)
    setNewSubcategoryName('')
    setEditingCategory(null)
  }

  // Submit subcategory
  const handleSubcategorySubmit = async (e, parentId) => {
    e.preventDefault()
    if (!newSubcategoryName.trim()) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings/equipment-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newSubcategoryName,
          parent_id: parentId
        })
      })
      if (res.ok) {
        setNewSubcategoryName('')
        setAddingSubcategory(null)
        setExpandedCategories(prev => new Set([...prev, parentId]))
        fetchCategories()
      }
    } catch (err) {
      console.error('Error adding subcategory', err)
    }
  }

  // Add root category
  const handleAddRootCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings/equipment-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCategoryName,
          parent_id: null
        })
      })
      if (res.ok) {
        setNewCategoryName('')
        setShowAddForm(false)
        fetchCategories()
      }
    } catch (err) {
      console.error('Error adding category', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ekipman Kategorileri</h2>
          <p className="text-gray-600 mt-1">
            Ekipmanlarınızı kategorilere ayırarak düzenli bir yapı oluşturun
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Yeni Kategori</span>
          </button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'card' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Kart Görünümü"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Liste Görünümü"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add Root Category Form */}
      {showAddForm && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <form onSubmit={handleAddRootCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Yeni Kategori Adı</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Kategori adı girin..."
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setNewCategoryName('')
                }}
                className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium"
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                Ekle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Display */}
      <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
        {filteredCategories.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-100">
            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kategori eklenmedi</h3>
            <p className="text-gray-600 mb-4">
              İlk kategoriyi eklemek için yukarıdaki butonu kullanın.
            </p>
          </div>
        ) : (
          filteredCategories.map(category =>
            viewMode === 'card' ? (
              <CategoryCard
                key={category.id}
                category={category}
                level={0}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubcategory={handleAddSubcategory}
                isEditing={editingCategory?.id === category.id}
                editingName={editingName}
                setEditingName={setEditingName}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
              />
            ) : (
              <CategoryListItem
                key={category.id}
                category={category}
                level={0}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubcategory={handleAddSubcategory}
                isEditing={editingCategory?.id === category.id}
                editingName={editingName}
                setEditingName={setEditingName}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
              />
            )
          )
        )}
      </div>

      {/* Add Subcategory Modal */}
      {addingSubcategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Alt Kategori Ekle</h3>
            <form onSubmit={(e) => handleSubcategorySubmit(e, addingSubcategory)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori Adı</label>
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Alt kategori adı"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddingSubcategory(null)
                    setNewSubcategoryName('')
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newSubcategoryName.trim()}
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipmentCategories
