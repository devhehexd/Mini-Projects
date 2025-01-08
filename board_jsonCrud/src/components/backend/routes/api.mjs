import express from 'express';
import { BoardService } from '../services/boardService.mjs';

const router = express.Router();
const boardService = new BoardService();

// 전체 게시글 조회
router.get('/posts', async (req, res) => {
  try {
    const posts = await boardService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 개별 게시글 조회
router.get('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await boardService.getPostById(postId);

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
router.put('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const postData = req.body;
    const editedPost = await boardService.editPost(postId, postData)
    res.status(200).json(editedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// 게시글 삭제
router.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    const deletedPost = await boardService.deletePost(postId, userId);
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;

