import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { id, createdAt } = event.pathParameters;

    const command = new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
        createdAt: decodeURIComponent(createdAt)
      }
    });

    await docClient.send(command);

    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: '게시글 삭제에 실패했습니다.' })
    };
  }
};