const { invoke } = require('../test-helpers')
const middy = require('middy')
const cognitoGroupsAuthorizer = require('..')

describe('🚫  Middleware Cognito Groups Authorizer', () => {
  test('It should pass if roles are empty', async () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(cognitoGroupsAuthorizer())

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar'
      },
      requestContext: {
        authorizer: {
          claims: {
            'cognito:groups': ['Admin']
          }
        }
      }
    }

    const body = await invoke(handler, event)

    expect(body).toEqual({ foo: 'bar' })
  })

  test('It should return UnauthorizedError if requestContext.authorizer is not defined', async () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(cognitoGroupsAuthorizer({
      allowedRoles: ['Admin']
    }))

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar'
      },
      requestContext: {}
    }

    try {
      await invoke(handler, event)
    } catch (err) {
      expect(err.message).toEqual('Unauthorized')
    }
  })

  test('It should return forbidden if cognito:groups is undefined', async () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(cognitoGroupsAuthorizer({
      allowedRoles: ['Admin']
    }))

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar'
      },
      requestContext: {
        authorizer: {
          claims: {}
        }
      }
    }

    try {
      await invoke(handler, event)
    } catch (err) {
      expect(err.message).toEqual('You don\'t have any role associated with your account')
    }
  })

  test('It should return forbidden if cognito:groups does not match with user groups', async () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(cognitoGroupsAuthorizer({
      allowedRoles: ['Admin']
    }))

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar'
      },
      requestContext: {
        authorizer: {
          claims: {
            'cognito:groups': ['User']
          }
        }
      }
    }

    try {
      await invoke(handler, event)
    } catch (err) {
      expect(err.message).toEqual('You don\'t have the permission to access this resource')
    }
  })

  test('It should authorize the user if at least one cognito:groups matches with authorized roles', async () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(cognitoGroupsAuthorizer({
      allowedRoles: ['Admin']
    }))

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar'
      },
      requestContext: {
        authorizer: {
          claims: {
            'cognito:groups': ['Admin', 'User']
          }
        }
      }
    }

    const body = await invoke(handler, event)

    expect(body).toEqual({ foo: 'bar' })
  })

  test('It should authorize the user if cognito:groups matches with authorized roles', async () => {
    const handler = middy((event, context, cb) => {
      cb(null, event.body) // propagates the body as a response
    })

    handler.use(cognitoGroupsAuthorizer({
      allowedRoles: ['Admin']
    }))

    // invokes the handler
    const event = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        foo: 'bar'
      },
      requestContext: {
        authorizer: {
          claims: {
            'cognito:groups': ['Admin']
          }
        }
      }
    }

    const body = await invoke(handler, event)

    expect(body).toEqual({ foo: 'bar' })
  })
})