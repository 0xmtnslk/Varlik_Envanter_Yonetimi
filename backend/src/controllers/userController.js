const { query } = require('../config/database');
const axios = require('axios');

const getAllUsers = async (req, res) => {
  try {
    const { facility_id, role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT DISTINCT u.*, 
             ARRAY_AGG(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL) as roles,
             ARRAY_AGG(DISTINCT ur.facility_id) FILTER (WHERE ur.facility_id IS NOT NULL) as facilities
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.is_active = true
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (facility_id) {
      queryText += ` AND ur.facility_id = $${paramIndex}`;
      params.push(facility_id);
      paramIndex++;
    }
    
    if (role) {
      queryText += ` AND r.name = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    if (search) {
      queryText += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    queryText += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.is_active = true
    `;
    
    const countParams = [];
    let countParamIndex = 1;
    
    if (facility_id) {
      countQuery += ` AND ur.facility_id = $${countParamIndex}`;
      countParams.push(facility_id);
      countParamIndex++;
    }
    
    if (role) {
      countQuery += ` AND r.name = $${countParamIndex}`;
      countParams.push(role);
      countParamIndex++;
    }
    
    if (search) {
      countQuery += ` AND (u.first_name ILIKE $${countParamIndex} OR u.last_name ILIKE $${countParamIndex} OR u.email ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    const countResult = await query(countQuery, countParams);
    
    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.*, 
              ARRAY_AGG(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL) as roles,
              ARRAY_AGG(DISTINCT ur.facility_id) FILTER (WHERE ur.facility_id IS NOT NULL) as facilities
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, phone, unit, position, employee_id, is_active } = req.body;
    
    const result = await query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           unit = COALESCE($4, unit),
           position = COALESCE($5, position),
           employee_id = COALESCE($6, employee_id),
           is_active = COALESCE($7, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, oracle_id, first_name, last_name, email, phone, unit, position, employee_id, is_active`,
      [first_name, last_name, phone, unit, position, employee_id, is_active, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const assignRole = async (req, res) => {
  try {
    const { role_id, facility_id } = req.body;
    
    // Check if role exists
    const roleResult = await query('SELECT id FROM roles WHERE id = $1', [role_id]);
    if (roleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Assign role
    await query(
      `INSERT INTO user_roles (user_id, role_id, facility_id, assigned_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, role_id, facility_id) DO NOTHING`,
      [req.params.id, role_id, facility_id, req.user.id]
    );
    
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
};

const removeRole = async (req, res) => {
  try {
    await query(
      'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
      [req.params.id, req.params.roleId]
    );
    
    res.json({ message: 'Role removed successfully' });
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({ error: 'Failed to remove role' });
  }
};

const syncFromOracle = async (req, res) => {
  try {
    const oracleApiUrl = process.env.ORACLE_API_URL;
    
    if (!oracleApiUrl) {
      return res.status(400).json({ error: 'Oracle API URL not configured' });
    }
    
    // Fetch users from Oracle API
    const response = await axios.get(`${oracleApiUrl}/users`);
    const oracleUsers = response.data;
    
    let syncedCount = 0;
    
    for (const oracleUser of oracleUsers) {
      // Check if user exists
      const existingUser = await query(
        'SELECT id FROM users WHERE oracle_id = $1',
        [oracleUser.oracle_id]
      );
      
      if (existingUser.rows.length === 0) {
        // Create new user
        await query(
          `INSERT INTO users (oracle_id, first_name, last_name, email, phone, unit, position, employee_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            oracleUser.oracle_id,
            oracleUser.first_name,
            oracleUser.last_name,
            oracleUser.email,
            oracleUser.phone,
            oracleUser.unit,
            oracleUser.position,
            oracleUser.employee_id
          ]
        );
        
        // Assign default 'User' role
        const roleResult = await query('SELECT id FROM roles WHERE name = $1', ['User']);
        if (roleResult.rows.length > 0) {
          await query(
            'INSERT INTO user_roles (user_id, role_id, assigned_by) SELECT id, $1, id FROM users WHERE oracle_id = $2',
            [roleResult.rows[0].id, oracleUser.oracle_id]
          );
        }
        
        syncedCount++;
      }
    }
    
    res.json({ message: 'Users synced successfully', synced_count: syncedCount });
  } catch (error) {
    console.error('Sync from Oracle error:', error);
    res.status(500).json({ error: 'Failed to sync users from Oracle' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
  syncFromOracle
};
