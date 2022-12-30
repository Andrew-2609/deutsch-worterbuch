import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

const fakeNouns = [
  {id: 'fakeId1', noun: 'Apfel', gender: 'masculine', article: 'der'},
  {id: 'fakeId2', noun: 'Sonne', gender: 'feminine', article: 'die'},
  {id: 'fakeId3', noun: 'Mädchen', gender: 'neuter', article: 'das'},
]

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(fakeNouns)
  }
}
