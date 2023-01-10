import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

export const docClient = new DynamoDB.DocumentClient()

const params: DynamoDB.DocumentClient.QueryInput = { TableName: 'WORTERBUCH' }

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { noun } = event.pathParameters
  const { Item } = await docClient.get({ ...params, Key: { noun: noun } }).promise()

  if (!Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Noun not found!' })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Item)
  }
}
