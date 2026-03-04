const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple hardcoded admin for now (should be stored in DB in production)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@try.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      req.session.adminId = 1;
      req.session.adminEmail = email;
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

// Check if admin is logged in
router.get('/check-session', (req, res) => {
  if (req.session.adminId) {
    res.json({ loggedIn: true, email: req.session.adminEmail });
  } else {
    res.json({ loggedIn: false });
  }
});

// Test database connection
router.get('/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('SELECT 1 as test');
    connection.release();
    res.json({ success: true, message: 'Database connected', data: result });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Get all reports (admin only)
router.get('/reports', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = `
      SELECT * FROM reports 
      ORDER BY created_at DESC
    `;

    const connection = await pool.getConnection();
    const [reports] = await connection.execute(query);
    connection.release();

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
});

// Get single report details
router.get('/reports/:id', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = `
      SELECT * FROM reports WHERE id = ?
    `;

    const connection = await pool.getConnection();
    const [reports] = await connection.execute(query, [req.params.id]);
    connection.release();

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(reports[0]);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Update report status
router.put('/reports/:id/status', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'reviewing', 'resolved', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const query = `
      UPDATE reports SET status = ? WHERE id = ?
    `;

    const connection = await pool.getConnection();
    await connection.execute(query, [status, req.params.id]);
    connection.release();

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Add response/answer to report
router.post('/reports/:id/response', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { response_text } = req.body;

    if (!response_text) {
      return res.status(400).json({ error: 'Response text is required' });
    }

    const query = `
      UPDATE reports SET admin_response = ?, updated_at = NOW() WHERE id = ?
    `;

    const connection = await pool.getConnection();
    await connection.execute(query, [response_text, req.params.id]);
    connection.release();

    res.json({ success: true, message: 'Response added' });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ error: 'Failed to add response' });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = `
      SELECT 
        COUNT(*) as total_reports,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
      FROM reports
    `;

    const connection = await pool.getConnection();
    const [stats] = await connection.execute(query);
    connection.release();

    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
