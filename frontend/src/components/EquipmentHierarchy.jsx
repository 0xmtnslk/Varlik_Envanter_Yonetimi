import { useState, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Package, Layers, Folder, Tag, Search, Grid, List, Sparkles } from 'lucide-react'

// Card View Component for Equipment Hierarchy Node
const HierarchyCard = ({
  node,
  level,
  expandedNodes,
  toggleNode,
  onAdd,
  onEdit,
  onDelete,
  isEditing,
  editingName,
  setEditingName,
  onSaveEdit,
  onCancelEdit
}) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)
  const canAddChild = level < 3

  const levelConfig = [
    { gradient: 'from-purple-500 to-purple-600', icon: Package, label: 'Ekipman Cinsi', bg: 'bg-purple-50', text: 'text-purple-600' },
    { gradient: 'from-blue-500 to-blue-600', icon: Layers, label: 'Kategori', bg: 'bg-blue-50', text: 'text-blue-600' },
    { gradient: 'from-emerald-500 to-emerald-600', icon: Folder, label: 'Alt Kategori', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { gradient: 'from-orange-500 to-orange-600', icon: Tag, label: 'Tür', bg: 'bg-orange-50', text: 'text-orange-600' }
  ]

  const config = levelConfig[level % 4]
  const LevelIcon = config.icon

  return (
    <div className={`hierarchy-card ${level > 0 ? 'ml-4 sm:ml-8' : ''}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
        {/* Card Header with Gradient */}
        <div className={`bg-gradient-to-r ${config.gradient} px-4 py-3`}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3 flex-1">
              {(hasChildren || level > 0) && (
                <button
                  onClick={() => toggleNode(node.id)}
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
                  <Folder className="h-5 w-5" />
                ) : (
                  <LevelIcon className="h-5 w-5" />
                )}
                <span className="font-semibold text-base truncate">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="bg-white/20 text-white placeholder-white/70 px-2 py-1 rounded-lg border-0 focus:ring-2 focus:ring-white/50 w-full"
                      placeholder="İsim girin..."
                      autoFocus
                    />
                  ) : (
                    node.name
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {node.child_count > 0 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm">
                  {node.child_count}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-500">
                Sıra: {node.sort_order}
              </span>
              <span className="text-xs text-gray-500">
                {hasChildren ? `${node.children.length} alt öğe` : 'Alt öğe yok'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={() => onSaveEdit(node)}
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
                  {canAddChild && (
                    <button
                      onClick={() => onAdd(node)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      title="Ekle"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(node)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(node.id)}
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
            {node.children.map(child => (
              <HierarchyCard
                key={child.id}
                node={child}
                level={level + 1}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
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

// List View Component for Equipment Hierarchy Node
const HierarchyListItem = ({
  node,
  level,
  expandedNodes,
  toggleNode,
  onAdd,
  onEdit,
  onDelete,
  isEditing,
  editingName,
  setEditingName,
  onSaveEdit,
  onCancelEdit
}) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)
  const canAddChild = level < 3

  const levelConfig = [
    { border: 'border-l-purple-500', icon: Package, label: 'Ekipman Cinsi', bg: 'bg-purple-50', text: 'text-purple-600' },
    { border: 'border-l-blue-500', icon: Layers, label: 'Kategori', bg: 'bg-blue-50', text: 'text-blue-600' },
    { border: 'border-l-emerald-500', icon: Folder, label: 'Alt Kategori', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { border: 'border-l-orange-500', icon: Tag, label: 'Tür', bg: 'bg-orange-50', text: 'text-orange-600' }
  ]

  const config = levelConfig[level % 4]
  const LevelIcon = config.icon

  return (
    <div className={`hierarchy-list-item ${level > 0 ? 'ml-4 sm:ml-8' : ''}`}>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${config.border} p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {(hasChildren || level > 0) && (
              <button
                onClick={() => toggleNode(node.id)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            <div className={`p-2 rounded-xl ${isExpanded ? 'bg-primary-50' : config.bg}`}>
              {isExpanded ? (
                <Folder className="h-4 w-4 text-primary-600" />
              ) : (
                <LevelIcon className={`h-4 w-4 ${config.text}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="İsim girin..."
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {node.name}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                    {config.label}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-500">
                Sıra: {node.sort_order}
              </span>
              {node.child_count > 0 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  {node.child_count}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => onSaveEdit(node)}
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
                {canAddChild && (
                  <button
                    onClick={() => onAdd(node)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="Ekle"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onEdit(node)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Düzenle"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(node.id)}
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
          {node.children.map(child => (
            <HierarchyListItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
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

// Main Equipment Hierarchy Component
const EquipmentHierarchy = () => {
  const [hierarchy, setHierarchy] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [editingNode, setEditingNode] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [addingNode, setAddingNode] = useState(null)
  const [newNodeName, setNewNodeName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRootName, setNewRootName] = useState('')
  const [nodeToDelete, setNodeToDelete] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Fetch hierarchy data
  const fetchHierarchy = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/settings/equipment-hierarchy', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch equipment hierarchy')
      }
      
      const data = await response.json()
      setHierarchy(data)
      
      // Expand root nodes by default
      const rootIds = data.map(node => node.id)
      setExpandedNodes(new Set(rootIds))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHierarchy()
  }, [])

  // Filter hierarchy based on search
  const filteredHierarchy = useMemo(() => {
    if (!searchQuery.trim()) return hierarchy
    
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
    
    return filterRecursive(hierarchy)
  }, [hierarchy, searchQuery])

  // Toggle node expansion
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // Add new node
  const handleAdd = (parentNode) => {
    setAddingNode(parentNode.id)
    setNewNodeName('')
    setEditingNode(null)
  }

  // Edit node
  const handleEdit = (node) => {
    setEditingNode({ ...node })
    setEditingName(node.name)
    setAddingNode(null)
  }

  // Save edit
  const handleSaveEdit = async (node) => {
    if (!editingName.trim()) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/settings/equipment-hierarchy/${node.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingName,
          parent_id: node.parent_id,
          level: node.level,
          sort_order: node.sort_order
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update node')
      }
      
      await fetchHierarchy()
      setEditingNode(null)
      setEditingName('')
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingNode(null)
    setEditingName('')
  }

  // Delete node
  const handleDelete = (nodeId) => {
    setNodeToDelete(nodeId)
    setShowDeleteModal(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/settings/equipment-hierarchy/${nodeToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete node')
      }
      
      await fetchHierarchy()
      setShowDeleteModal(false)
      setNodeToDelete(null)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // Submit node (add)
  const handleNodeSubmit = async (nodeData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/settings/equipment-hierarchy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nodeData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save node')
      }
      
      await fetchHierarchy()
      setAddingNode(null)
      setNewNodeName('')
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // Add root node
  const handleAddRootNode = async (e) => {
    e.preventDefault()
    if (!newRootName.trim()) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/settings/equipment-hierarchy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newRootName,
          parent_id: null,
          level: 0,
          sort_order: hierarchy.length
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add root node')
      }
      
      await fetchHierarchy()
      setNewRootName('')
      setShowAddForm(false)
      setError(null)
    } catch (err) {
      setError(err.message)
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
          <h2 className="text-2xl font-bold text-gray-900">Ekipman Cinsi Hiyerarşisi</h2>
          <p className="text-gray-600 mt-1">
            4 seviyeli ekipman sınıflandırma sistemi (Ekipman Cinsi → Kategori → Alt Kategori → Tür)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Yeni Ekipman Cinsi</span>
          </button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ekipman cinsi ara..."
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

      {/* Add Root Node Form */}
      {showAddForm && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-lg">
          <form onSubmit={handleAddRootNode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Yeni Ekipman Cinsi Adı</label>
              <input
                type="text"
                value={newRootName}
                onChange={(e) => setNewRootName(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Ekipman cinsi adı girin..."
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setNewRootName('')
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

      {/* Hierarchy Display */}
      <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
        {filteredHierarchy.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-100">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ekipman cinsi eklenmedi</h3>
            <p className="text-gray-600 mb-4">
              İlk ekipman cinsini eklemek için yukarıdaki butonu kullanın.
            </p>
          </div>
        ) : (
          filteredHierarchy.map(node =>
            viewMode === 'card' ? (
              <HierarchyCard
                key={node.id}
                node={node}
                level={0}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isEditing={editingNode?.id === node.id}
                editingName={editingName}
                setEditingName={setEditingName}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
              />
            ) : (
              <HierarchyListItem
                key={node.id}
                node={node}
                level={0}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isEditing={editingNode?.id === node.id}
                editingName={editingName}
                setEditingName={setEditingName}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
              />
            )
          )
        )}
      </div>

      {/* Add Child Modal */}
      {addingNode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Alt Öğe Ekle</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const parentNode = hierarchy.find(n => n.id === addingNode) || 
                                 hierarchy.flatMap(n => n.children || []).find(n => n.id === addingNode) ||
                                 hierarchy.flatMap(n => (n.children || []).flatMap(c => c.children || [])).find(n => n.id === addingNode)
              const level = parentNode ? parentNode.level : 0
              handleNodeSubmit({ name: newNodeName, parent_id: addingNode, level: level + 1, sort_order: 0 })
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Öğe Adı</label>
                <input
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Öğe adı"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddingNode(null)
                    setNewNodeName('')
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newNodeName.trim()}
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Düğümü Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu düğümü silmek istediğinizden emin misiniz? Alt düğümleri varsa önce onları silmeniz gerekir.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipmentHierarchy
