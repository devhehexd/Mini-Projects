import express from 'express';
import { BoardService } from '../services/boardService.mjs';

const router = express.Router();
const boardService = new BoardService();

// 전체 게시글 조회
router.get('/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const lastEvaluatedKey = req.query.lastEvaluatedKey ? JSON.parse(req.query.lastEvaluatedKey) : null;
    const posts = await boardService.getAllPosts(limit, lastEvaluatedKey);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 개별 게시글 조회
router.get('/posts/:id/:createdAt', async (req, res) => {
  try {
    const postId = req.params.id;
    const createdAt = req.params.createdAt;
    const post = await boardService.getPostById(postId, createdAt);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 작성
router.post('/write', async (req, res) => {
  try {
    const postData = req.body;
    const newPost = await boardService.createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 수정
router.put('/posts/:id/:createdAt', async (req, res) => {
  try {
    const postId = req.params.id;
    const createdAt = req.params.createdAt;
    const postData = req.body;
    const editedPost = await boardService.editPost(postId, createdAt, postData)
    res.status(200).json(editedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// 게시글 삭제
router.delete('/posts/:id/:createdAt', async (req, res) => {
  try {
    const postId = req.params.id;
    const createdAt = req.params.createdAt;
    const { userId } = req.body;
    const deletedPost = await boardService.deletePost(postId, createdAt, userId);
    res.status(204).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;

