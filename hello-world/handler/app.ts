import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(event)
  }
}
