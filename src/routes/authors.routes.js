const express = require('express');
const pool = require('../db');
const validateId = require('../middlewares/validateId');

const router = express.Router();



// GET /authors
// Obtiene todos los autores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM authors ORDER BY id'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// GET /authors/:id
// Obtiene un autor por su ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// POST /authors
// Crea un nuevo autor
router.post('/', async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO authors (name, email, bio)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        name.trim(),
        email.trim(),
        bio || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    // PostgreSQL: unique violation
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// PUT /authors/:id
// Actualiza un autor existente
router.put('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    const result = await pool.query(
      `UPDATE authors
       SET name = $1,
           email = $2,
           bio = $3
       WHERE id = $4
       RETURNING *`,
      [
        name.trim(),
        email.trim(),
        bio || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    // PostgreSQL: unique violation
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// DELETE /authors/:id
// Elimina un autor existente
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM authors
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.status(204).send();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


module.exports = router;