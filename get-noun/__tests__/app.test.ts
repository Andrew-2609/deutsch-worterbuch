import { APIGatewayProxyEvent } from 'aws-lambda'
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

describe('Get Noun Function', () => {
  test('should return 404 if noun is not found', async () => {
    const mockDynamoDbGet = jest.fn().mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve({ Item: null });
        }
      }
    })

    jest.spyOn(App.docClient, 'get').mockImplementationOnce(() => { return mockDynamoDbGet() })

    const { statusCode, body } = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(statusCode).toEqual(404)
    expect(JSON.parse(body).message).toStrictEqual('Noun not found!')
  })

  test('should return seached noun if it exists', async () => {
    const fakeNoun = { noun: 'Apfel', gender: 'masculine', article: 'der' }
    const mockDynamoDbGet = jest.fn().mockImplementationOnce(() => {
      return {
        promise() {
          return Promise.resolve({ Item: fakeNoun });
        }
      }
    })

    jest.spyOn(App.docClient, 'get').mockImplementationOnce(() => { return mockDynamoDbGet() })

    const { statusCode, body } = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(statusCode).toEqual(200)
    expect(JSON.parse(body)).toStrictEqual(fakeNoun)
  })

  test('should return thrown error if lambdaHandler throws', async () => {
    jest.spyOn(App.docClient, 'get').mockImplementationOnce(() => { throw new FakeError() })
    const response = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(response.statusCode).toEqual(403)
    expect(JSON.parse(response.body).message).toEqual('Unauthorized')
  })

  test('should return 500 if an unrecognized error is thrown in lambdaHandler', async () => {
    jest.spyOn(App.docClient, 'get').mockImplementationOnce(() => { throw new Error() })
    const response = await App.lambdaHandler(event as unknown as APIGatewayProxyEvent)
    expect(response.statusCode).toEqual(500)
    expect(JSON.parse(response.body).message).toEqual('An unknown error was thrown. Please get in touch with us!')
  })
})
