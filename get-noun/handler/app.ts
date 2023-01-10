import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

export const docClient = new DynamoDB.DocumentClient()

const params: DynamoDB.DocumentClient.QueryInput = { TableName: 'WORTERBUCH' }

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
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
  } catch (err) {
    console.error(`An error was thrown while reading the data: ${err}`)
    return {
      statusCode: err.status ? err.status : 500,
      body: JSON.stringify({ message: err.message ? err.message : 'An unknown error was thrown. Please get in touch with us!' })
    }
  }
}
