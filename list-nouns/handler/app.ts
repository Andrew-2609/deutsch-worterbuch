import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()
const params = {
  TableName: 'WORTERBUCH'
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { Items } = await docClient.scan(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(Items)
    }
  } catch (err) {
    console.error(`An error was thrown while reading the data: ${err}`)
    return {
      statusCode: err.status ? err.status : 500,
      body: JSON.stringify({ message: err.message ? err.message : 'An unknown error was thrown. Please get in touch with us!' })
    }
  }
}
