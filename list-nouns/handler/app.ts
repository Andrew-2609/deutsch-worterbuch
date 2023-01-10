import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

export const docClient = new DynamoDB.DocumentClient()

const params: DynamoDB.DocumentClient.QueryInput = { TableName: 'WORTERBUCH' }

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { queryStringParameters } = event
    setGenderToQueryInputIfPresent(params, queryStringParameters?.gender)

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

export const setGenderToQueryInputIfPresent = (params: DynamoDB.DocumentClient.QueryInput, gender: string): void => {
  if (typeof gender === 'string') {
    params.FilterExpression = '#gender = :gender'
    params.ExpressionAttributeNames = {
      '#gender': 'gender',
    }
    params.ExpressionAttributeValues = {
      ':gender': gender
    }

    return
  }

  delete params?.FilterExpression
  delete params?.ExpressionAttributeNames
  delete params?.ExpressionAttributeValues
}
