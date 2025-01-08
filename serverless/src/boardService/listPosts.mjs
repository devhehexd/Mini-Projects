import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const limit = event.queryStringParameters?.limit || 10;
    const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey
      ? JSON.parse(event.queryStringParameters.lastEvaluatedKey)
      : null;

    const command = new ScanCommand({
      TableName: process.env.TABLE_NAME,
      Limit: parseInt(limit),
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        items: response.Items,
        lastEvaluatedKey: response.LastEvaluatedKey
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: '게시글을 불러오는데 실패했습니다.' })
    };
  }
};