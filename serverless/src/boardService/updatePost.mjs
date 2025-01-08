import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { id, createdAt } = event.pathParameters;
    const { title, subtitle, content } = JSON.parse(event.body);

    const command = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
        createdAt: decodeURIComponent(createdAt)
      },
      UpdateExpression: "set title = :title, subtitle = :subtitle, content = :content, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":title": title,
        ":subtitle": subtitle,
        ":content": content,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(response.Attributes)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: '게시글 수정에 실패했습니다.' })
    };
  }
};