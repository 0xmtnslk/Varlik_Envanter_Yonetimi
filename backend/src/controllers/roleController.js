const { query } = require('../config/database');

const getAllRoles = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM roles ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get all roles error:', error);
    res.status(500).json({ error: 'Failed to get roles' });
  }
};

const getRoleById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM roles WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get role by ID error:', error);
    res.status(500).json({ error: 'Failed to get role' });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await query(
      'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    
    res.status(201).json({ message: 'Role created successfully', role: result.rows[0] });
  } catch (error) {
    console.error('Create role error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Role already exists' });
    }
    res.status(500).json({ error: 'Failed to create role' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await query(
      `UPDATE roles 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, description, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json({ message: 'Role updated successfully', role: result.rows[0] });
  } catch (error) {
    console.error('Update role error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Role already exists' });
    }
    res.status(500).json({ error: 'Failed to update role' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM roles WHERE id = $1 AND is_system = false RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found or cannot be deleted' });
    }
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
