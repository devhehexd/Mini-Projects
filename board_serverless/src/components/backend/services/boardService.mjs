import { readJsonFile, writeJsonFile } from "../../db/jsonDb.mjs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

// 환경 변수에서 AWS 설정 가져오기
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  REGION
} = process.env;

// AWS DynamoDB 클라이언트 초기화
const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

// DynamoDB 테이블 이름 설정
const TABLE_NAME = "board-skb";

export class BoardService {

  async getAllPosts(limit = 10, lastEvaluatedKey = null) {

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: limit,
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
    });

    try {
      const response = await docClient.send(command);
      return {
        items: response.Items,
        lastEvaluatedKey: response.LastEvaluatedKey
      }
    } catch (error) {
      throw new Error('게시글을 불러오는데 실패했습니다: ' + error.message);
    }
  }

  async getPostById(postId, createdAt) {

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id: postId,
        createdAt: createdAt
      }
    })

    try {
      const response = await docClient.send(command);

      if (!response) {
        throw new Error('게시글을 찾을 수 없습니다.');
      }

      return response.Item;
    } catch (error) {
      throw new Error('게시글을 불러오는데 실패했습니다: ' + error.message);
    }
  }

  async createPost(postData) {
    try {
      const newPost = {
        id: `post_${uuidv4()}`,
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newPost
      });

      await docClient.send(command);
      return newPost;
    } catch (error) {
      throw new Error('게시글 작성에 실패했습니다: ' + error.message);
    }
  }

  async editPost(postId, createdAt, { title, subtitle, content }) {

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        id: postId,
        createdAt: createdAt
      },
      UpdateExpression: "set title = :title, subtitle = :subtitle, content = :content, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":title": title,
        ":subtitle": subtitle,
        ":content": content,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    })

    try {
      const response = await docClient.send(command);
      console.log("response: ", response)
      return response.Attributes;
    } catch (error) {
      throw new Error('게시글 수정에 실패했습니다: ' + error.message);
    }
  }

  async deletePost(postId, createdAt, userId) {

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id: postId,
        createdAt: createdAt
      }
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      throw new Error('게시글 삭제에 실패했습니다: ' + error.message);
    }
  }
}