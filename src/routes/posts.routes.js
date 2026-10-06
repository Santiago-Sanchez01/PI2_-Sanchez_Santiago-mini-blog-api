const express = require('express');
const pool = require('../db');
const validateId = require('../middlewares/validateId');

const router = express.Router();



// GET /posts
// Obtiene todos los posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY id'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// GET /posts/author/:authorId
// Obtiene todos los posts de un autor
router.get('/author/:authorId', async (req, res) => {
  try {
    const { authorId } = req.params;

    const parsedAuthorId = Number(authorId);

    if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
      return res.status(400).json({
        error: 'Invalid author ID'
      });
    }

    const result = await pool.query(
      `SELECT * FROM posts
       WHERE author_id = $1
       ORDER BY id`,
      [authorId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// GET /posts/:id
// Obtiene un post por su ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Post not found'
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


// POST /posts
// Crea un nuevo post
router.post('/', async (req, res) => {
  try {
    const { title, content, author_id, published } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: 'Content is required'
      });
    }

    if (!author_id) {
      return res.status(400).json({
        error: 'Author ID is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO posts (title, content, author_id, published)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        title.trim(),
        content.trim(),
        author_id,
        published ?? false
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    // PostgreSQL: foreign key violation
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Author does not exist'
      });
    }

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// PUT /posts/:id
// Actualiza un post existente
router.put('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author_id, published } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: 'Content is required'
      });
    }

    if (!author_id) {
      return res.status(400).json({
        error: 'Author ID is required'
      });
    }

    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           content = $2,
           author_id = $3,
           published = $4
       WHERE id = $5
       RETURNING *`,
      [
        title.trim(),
        content.trim(),
        author_id,
        published ?? false,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    // PostgreSQL: foreign key violation
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Author does not exist'
      });
    }

    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// DELETE /posts/:id
// Elimina un post existente
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM posts
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Post not found'
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