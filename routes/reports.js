const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Submit a new report
router.post('/submit', async (req, res) => {
  try {
    const { customer_name, email, phone, title, description, category } = req.body;

    if (!customer_name || !email || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO reports (customer_name, email, phone, title, description, category, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const connection = await pool.getConnection();
    const result = await connection.execute(query, [customer_name, email, phone, title, description, category || 'general']);
    connection.release();

    console.log('Report inserted successfully:', result);
    res.json({ 
      success: true, 
      message: 'Report submitted successfully! Admin will review it shortly.' 
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit report', details: error.message });
  }
});

// Get all reports (public - limited data)
router.get('/public', async (req, res) => {
  try {
    const query = `
      SELECT id, customer_name, title, category, status, created_at 
      FROM reports 
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    const connection = await pool.getConnection();
    const [reports] = await connection.execute(query);
    connection.release();

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
