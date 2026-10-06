const pool = require('../db');


// Obtiene todos los posts
async function getAllPosts() {
  const result = await pool.query(
    'SELECT * FROM posts ORDER BY id'
  );

  return result.rows;
}


// Obtiene los posts de un autor
async function getPostsByAuthor(authorId) {
  const result = await pool.query(
    `SELECT * FROM posts
     WHERE author_id = $1
     ORDER BY id`,
    [authorId]
  );

  return result.rows;
}


// Obtiene un post por ID
async function getPostById(id) {
  const result = await pool.query(
    'SELECT * FROM posts WHERE id = $1',
    [id]
  );

  return result.rows[0];
}


// Crea un nuevo post
async function createPost(title, content, authorId, published) {
  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, authorId, published]
  );

  return result.rows[0];
}


// Actualiza un post
async function updatePost(id, title, content, authorId, published) {
  const result = await pool.query(
    `UPDATE posts
     SET title = $1,
         content = $2,
         author_id = $3,
         published = $4
     WHERE id = $5
     RETURNING *`,
    [title, content, authorId, published, id]
  );

  return result.rows[0];
}


// Elimina un post
async function deletePost(id) {
  const result = await pool.query(
    `DELETE FROM posts
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}


module.exports = {
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  createPost,
  updatePost,
  deletePost
};