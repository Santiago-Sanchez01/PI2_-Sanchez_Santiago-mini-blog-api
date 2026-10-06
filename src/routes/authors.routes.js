const express = require('express');
const authorsService = require('../services/authors.service');
const validateId = require('../middlewares/validateId');

const router = express.Router();


// GET /authors
router.get('/', async (req, res) => {
  try {
    const authors = await authorsService.getAllAuthors();

    res.status(200).json(authors);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// GET /authors/:id
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.status(200).json(author);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// POST /authors
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

    const author = await authorsService.createAuthor(
      name.trim(),
      email.trim(),
      bio || null
    );

    res.status(201).json(author);

  } catch (error) {
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

    const author = await authorsService.updateAuthor(
      id,
      name.trim(),
      email.trim(),
      bio || null
    );

    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.status(200).json(author);

  } catch (error) {
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
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const author = await authorsService.deleteAuthor(id);

    if (!author) {
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