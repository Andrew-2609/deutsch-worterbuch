import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const docClient = new DynamoDB.DocumentClient()

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const params: DynamoDB.DocumentClient.QueryInput = { TableName: 'WORTERBUCH', ProjectionExpression: 'noun, article, gender' }
  const { queryStringParameters } = event
  
  if (queryStringParameters?.gender)
    setGenderFromQueryStringParameters(params, queryStringParameters.gender)

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

const setGenderFromQueryStringParameters = (params: DynamoDB.DocumentClient.QueryInput, gender: string) => {
  params.FilterExpression = '#gender = :gender'
  params.ExpressionAttributeNames = {
    '#gender': 'gender',
  }
  params.ExpressionAttributeValues = {
    ':gender': gender
  }
}
