const { query } = require('../config/database');

const getCalendarEvents = async (req, res) => {
  try {
    const { start_date, end_date, facility_id } = req.query;
    
    let queryText = `
      SELECT 
        mr.id,
        mr.scheduled_date as start_date,
        mr.scheduled_date as end_date,
        'maintenance' as type,
        mr.status,
        mr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        mt.name as maintenance_type_name,
        'Bakım: ' || a.name as title
      FROM maintenance_records mr
      LEFT JOIN assets a ON mr.asset_id = a.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN maintenance_types mt ON mr.maintenance_type_id = mt.id
      
      UNION ALL
      
      SELECT 
        fr.id,
        fr.created_at as start_date,
        COALESCE(fr.resolution_date, fr.created_at + INTERVAL '7 days') as end_date,
        'fault_request' as type,
        fr.status,
        fr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        NULL as maintenance_type_name,
        'Arıza: ' || fr.title as title
      FROM fault_requests fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      LEFT JOIN facilities f ON fr.facility_id = f.id
      WHERE fr.status NOT IN ('completed', 'cancelled')
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (start_date) {
      queryText += ` WHERE start_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      queryText += paramIndex > 1 ? ` AND end_date <= $${paramIndex}` : ` WHERE end_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    if (facility_id) {
      queryText += paramIndex > 1 ? ` AND facility_name = (SELECT name FROM facilities WHERE id = $${paramIndex})` : ` WHERE facility_name = (SELECT name FROM facilities WHERE id = $${paramIndex})`;
      params.push(facility_id);
      paramIndex++;
    }
    
    queryText += ` ORDER BY start_date ASC`;
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get calendar events error:', error);
    res.status(500).json({ error: 'Failed to get calendar events' });
  }
};

const getEventsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, facility_id } = req.query;
    
    let queryText = `
      SELECT 
        mr.id,
        mr.scheduled_date as start_date,
        mr.scheduled_date as end_date,
        'maintenance' as type,
        mr.status,
        mr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        mt.name as maintenance_type_name,
        'Bakım: ' || a.name as title
      FROM maintenance_records mr
      LEFT JOIN assets a ON mr.asset_id = a.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN maintenance_types mt ON mr.maintenance_type_id = mt.id
      
      UNION ALL
      
      SELECT 
        fr.id,
        fr.created_at as start_date,
        COALESCE(fr.resolution_date, fr.created_at + INTERVAL '7 days') as end_date,
        'fault_request' as type,
        fr.status,
        fr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        NULL as maintenance_type_name,
        'Arıza: ' || fr.title as title
      FROM fault_requests fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      LEFT JOIN facilities f ON fr.facility_id = f.id
      WHERE fr.status NOT IN ('completed', 'cancelled')
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (start_date) {
      queryText += ` WHERE start_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      queryText += ` AND end_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    if (facility_id) {
      queryText += ` AND facility_name = (SELECT name FROM facilities WHERE id = $${paramIndex})`;
      params.push(facility_id);
      paramIndex++;
    }
    
    queryText += ` ORDER BY start_date ASC`;
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get events by date range error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

const getEventsByType = async (req, res) => {
  try {
    const { type, start_date, end_date, facility_id } = req.query;
    
    let queryText = '';
    const params = [];
    let paramIndex = 1;
    
    if (type === 'maintenance') {
      queryText = `
        SELECT 
          mr.id,
          mr.scheduled_date as start_date,
          mr.scheduled_date as end_date,
          'maintenance' as type,
          mr.status,
          mr.priority,
          a.name as asset_name,
          a.asset_code,
          f.name as facility_name,
          mt.name as maintenance_type_name,
          'Bakım: ' || a.name as title
        FROM maintenance_records mr
        LEFT JOIN assets a ON mr.asset_id = a.id
        LEFT JOIN facilities f ON a.facility_id = f.id
        LEFT JOIN maintenance_types mt ON mr.maintenance_type_id = mt.id
        WHERE 1=1
      `;
      
      if (start_date) {
        queryText += ` AND mr.scheduled_date >= $${paramIndex}`;
        params.push(start_date);
        paramIndex++;
      }
      
      if (end_date) {
        queryText += ` AND mr.scheduled_date <= $${paramIndex}`;
        params.push(end_date);
        paramIndex++;
      }
      
      if (facility_id) {
        queryText += ` AND f.id = $${paramIndex}`;
        params.push(facility_id);
        paramIndex++;
      }
    } else if (type === 'fault_request') {
      queryText = `
        SELECT 
          fr.id,
          fr.created_at as start_date,
          COALESCE(fr.resolution_date, fr.created_at + INTERVAL '7 days') as end_date,
          'fault_request' as type,
          fr.status,
          fr.priority,
          a.name as asset_name,
          a.asset_code,
          f.name as facility_name,
          NULL as maintenance_type_name,
          'Arıza: ' || fr.title as title
        FROM fault_requests fr
        LEFT JOIN assets a ON fr.asset_id = a.id
        LEFT JOIN facilities f ON fr.facility_id = f.id
        WHERE fr.status NOT IN ('completed', 'cancelled')
      `;
      
      if (start_date) {
        queryText += ` AND fr.created_at >= $${paramIndex}`;
        params.push(start_date);
        paramIndex++;
      }
      
      if (end_date) {
        queryText += ` AND COALESCE(fr.resolution_date, fr.created_at + INTERVAL '7 days') <= $${paramIndex}`;
        params.push(end_date);
        paramIndex++;
      }
      
      if (facility_id) {
        queryText += ` AND f.id = $${paramIndex}`;
        params.push(facility_id);
        paramIndex++;
      }
    }
    
    queryText += ` ORDER BY start_date ASC`;
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get events by type error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

const getEventsByFacility = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let queryText = `
      SELECT 
        mr.id,
        mr.scheduled_date as start_date,
        mr.scheduled_date as end_date,
        'maintenance' as type,
        mr.status,
        mr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        mt.name as maintenance_type_name,
        'Bakım: ' || a.name as title
      FROM maintenance_records mr
      LEFT JOIN assets a ON mr.asset_id = a.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN maintenance_types mt ON mr.maintenance_type_id = mt.id
      WHERE f.id = $1
      
      UNION ALL
      
      SELECT 
        fr.id,
        fr.created_at as start_date,
        COALESCE(fr.resolution_date, fr.created_at + INTERVAL '7 days') as end_date,
        'fault_request' as type,
        fr.status,
        fr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        NULL as maintenance_type_name,
        'Arıza: ' || fr.title as title
      FROM fault_requests fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      LEFT JOIN facilities f ON fr.facility_id = f.id
      WHERE f.id = $1 AND fr.status NOT IN ('completed', 'cancelled')
    `;
    
    const params = [req.params.facilityId];
    let paramIndex = 2;
    
    if (start_date) {
      queryText += ` AND start_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    
    if (end_date) {
      queryText += ` AND end_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }
    
    queryText += ` ORDER BY start_date ASC`;
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get events by facility error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const { days = 30, facility_id } = req.query;
    
    let queryText = `
      SELECT 
        mr.id,
        mr.scheduled_date as start_date,
        mr.scheduled_date as end_date,
        'maintenance' as type,
        mr.status,
        mr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        mt.name as maintenance_type_name,
        'Bakım: ' || a.name as title
      FROM maintenance_records mr
      LEFT JOIN assets a ON mr.asset_id = a.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN maintenance_types mt ON mr.maintenance_type_id = mt.id
      WHERE mr.scheduled_date >= CURRENT_DATE AND mr.scheduled_date <= CURRENT_DATE + INTERVAL '1 day' * $1
        AND mr.status = 'pending'
    `;
    
    const params = [days];
    let paramIndex = 2;
    
    if (facility_id) {
      queryText += ` AND f.id = $${paramIndex}`;
      params.push(facility_id);
      paramIndex++;
    }
    
    queryText += `
      UNION ALL
      
      SELECT 
        fr.id,
        fr.created_at as start_date,
        COALESCE(fr.resolution_date, fr.created_at + INTERVAL '7 days') as end_date,
        'fault_request' as type,
        fr.status,
        fr.priority,
        a.name as asset_name,
        a.asset_code,
        f.name as facility_name,
        NULL as maintenance_type_name,
        'Arıza: ' || fr.title as title
      FROM fault_requests fr
      LEFT JOIN assets a ON fr.asset_id = a.id
      LEFT JOIN facilities f ON fr.facility_id = f.id
      WHERE fr.created_at >= CURRENT_DATE AND fr.created_at <= CURRENT_DATE + INTERVAL '1 day' * $1
        AND fr.status NOT IN ('completed', 'cancelled')
    `;
    
    if (facility_id) {
      queryText += ` AND f.id = $${paramIndex}`;
      params.push(facility_id);
      paramIndex++;
    }
    
    queryText += ` ORDER BY start_date ASC`;
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ error: 'Failed to get upcoming events' });
  }
};

module.exports = {
  getCalendarEvents,
  getEventsByDateRange,
  getEventsByType,
  getEventsByFacility,
  getUpcomingEvents
};
