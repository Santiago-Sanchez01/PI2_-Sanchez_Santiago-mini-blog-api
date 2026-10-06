const express = require('express');
const postsService = require('../services/posts.service');
const validateId = require('../middlewares/validateId');

const router = express.Router();


// GET /posts
router.get('/', async (req, res) => {
  try {
    const posts = await postsService.getAllPosts();

    res.status(200).json(posts);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// GET /posts/author/:authorId
router.get('/author/:authorId', async (req, res) => {
  try {
    const { authorId } = req.params;

    const parsedAuthorId = Number(authorId);

    if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
      return res.status(400).json({
        error: 'Invalid author ID'
      });
    }

    const posts = await postsService.getPostsByAuthor(authorId);

    res.status(200).json(posts);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// GET /posts/:id
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    res.status(200).json(post);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


// POST /posts
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

    const post = await postsService.createPost(
      title.trim(),
      content.trim(),
      author_id,
      published ?? false
    );

    res.status(201).json(post);

  } catch (error) {
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

    const post = await postsService.updatePost(
      id,
      title.trim(),
      content.trim(),
      author_id,
      published ?? false
    );

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    res.status(200).json(post);

  } catch (error) {
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
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postsService.deletePost(id);

    if (!post) {
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