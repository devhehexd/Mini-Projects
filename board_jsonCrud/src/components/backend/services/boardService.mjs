import { readJsonFile, writeJsonFile } from "../../db/jsonDb.mjs";

const db = await readJsonFile();

export class BoardService {

  async getAllPosts() {
    try {
      return db.posts;
    } catch (error) {
      throw new Error('게시글을 불러오는데 실패했습니다: ' + error.message);
    }
  }

  async getPostById(postId) {
    try {
      const post = db.posts.find(post => post.id === postId);

      if (!post) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      return post;
    } catch (error) {
      throw new Error('게시글을 불러오는데 실패했습니다: ' + error.message);
    }
  }

  async createPost(postData) {
    try {
      const newPost = {
        id: Date.now().toString(),
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.posts.push(newPost);
      await writeJsonFile(db);
      return newPost;
    } catch (error) {
      throw new Error('게시글 작성에 실패했습니다: ' + error.message);
    }
  }

  async editPost(postId, postData) {
    try {
      const postIndex = db.posts.findIndex(post => post.id === postId);

      if (postIndex === -1) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      // 작성자 확인
      if (db.posts[postIndex].author.id !== postData.userId) {
        throw new Error('수정 권한이 없습니다.');
      }

      db.posts[postIndex] = {
        ...db.posts[postIndex],
        title: postData.title,
        subtitle: postData.subtitle,
        content: postData.content,
        updatedAt: new Date().toISOString()
      }

      await writeJsonFile(db);
      return true;
    } catch (error) {
      throw new Error('게시글 수정에 실패했습니다: ' + error.message);
    }
  }

  async deletePost(postId, userId) {
    try {
      const postIndex = db.posts.findIndex(post => post.id === postId);

      if (postIndex === -1) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      // 작성자 확인
      if (db.posts[postIndex].author.id !== userId) {
        throw new Error('삭제 권한이 없습니다.');
      }

      // 배열에서 해당 인덱스의 게시글 삭제
      db.posts.splice(postIndex, 1);

      await writeJsonFile(db);
      return true;
    } catch (error) {
      throw new Error('게시글 삭제에 실패했습니다: ' + error.message);
    }
  }
}