import { APIGatewayProxyEvent } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import event from '../../events/event.json'
import * as App from '../handler/app'

class FakeError extends Error {
  private readonly status: number

  constructor() {
    super()
    this.status = 403
    this.message = 'Unauthorized'
  }
}

const fakeNoun = {
  noun: 'Apfel',
  gender: 'masculine',
  article: 'der',
}

describe('List Nouns Function', () => {
  test('should set query input parameters if gender is present', () => {
    const params: DynamoDB.DocumentClient.QueryInput = { TableName: 'TEST' }
    const expectedParams = ['TableName', 'FilterExpression', 'ExpressionAttributeNames', 'ExpressionAttributeValues']
    const spiedFunction = jest.spyOn(App, 'setGenderToQueryInputIfPresent')

    App.setGenderToQueryInputIfPresent(params, 'masculine')

    expect(spiedFunction).toHaveBeenCalledWith(params, 'masculine')
    expect(Object.keys(params)).toStrictEqual(expectedParams)
  })

  test('should remove query input parameters if gender is not present', () => {
    const params: DynamoDB.DocumentClient.QueryInput = { TableName: 'TEST', FilterExpression: '', ExpressionAttributeNames: {}, ExpressionAttributeValues: {} }
    const spiedFunction = jest.spyOn(App, 'setGenderToQueryInputIfPresent')

    App.setGenderToQueryInputIfPresent(params, undefined)

    expect(spiedFunction).toHaveBeenCalledWith(params, undefined)
    expect(Object.keys(params)).toStrictEqual(['TableName'])
  })

  test('should return nouns if a valid query input is given', async () => {
    const mockDynamoDbScan = jest.fn().mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve({ Items: [fakeNoun] });
        }
      }
    })

    jest.spyOn(App.docClient, 'scan').mockImplementationOnce(() => { return mockDynamoDbScan() })

    const response = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toStrictEqual([fakeNoun])
  })

  test('should return thrown error if lambdaHandler throws', async () => {
    jest.spyOn(App, 'setGenderToQueryInputIfPresent').mockImplementationOnce(() => { throw new FakeError() })
    const response = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(response.statusCode).toEqual(403)
    expect(JSON.parse(response.body).message).toEqual('Unauthorized')
  })

  test('should return 500 if an unrecognized error is thrown in lambdaHandler', async () => {
    jest.spyOn(App, 'setGenderToQueryInputIfPresent').mockImplementationOnce(() => { throw new Error() })
    const response = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(response.statusCode).toEqual(500)
    expect(JSON.parse(response.body).message).toEqual('An unknown error was thrown. Please get in touch with us!')
  })
})
