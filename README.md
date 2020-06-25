# Serverless Cognito Permission Middleware
===

[![GitHub version](https://badge.fury.io/gh/santonocito%2Fmiddy-cognito-groups-authorizer.svg)](https://badge.fury.io/gh/santonocito%2Fmiddy-cognito-groups-authorizer)

Amazon Cognito user pools enables you to create and manage groups, add users to groups, and remove users from groups. You can use these groups to create collections of users and manage their permissions. This middleware checks for the user’s groups permission and authorizes user requests.

## Install

To install this middleware you can use NPM:

```bash
npm install --save @marcosantonocito/middy-cognito-permission
```

## Options

 - `allowedRoles` (array) (optional): Array of strings defining containing the roles authorized to accomplish the request


## Sample usage

Example:

```javascript
const middy = require('@middy/core')
const cognitoPermission = require('@marcosantonocito/middy-cognito-permission')

const handler = middy((event, context, cb) => {
  cb(null, {})
})

handler.use(cognitoPermission({
  allowedRoles: ['Admin']
}))

// invokes the handler, note that property foo is missing
const event = {
  body: JSON.stringify({something: 'somethingelse'}),
  requestContext: {
    authorizer: {
      claims: {
        'cognito:groups': ['Admin']
      }
    }
  }
}
handler(event, {}, (err, res) => {
  console.log(res)
})
```

## Contributing

Everyone is very welcome to contribute to this repository. Feel free to [raise issues](https://github.com/santonocito/middy-cognito-permission/issues) or to [submit Pull Requests](https://github.com/santonocito/middy-cognito-permission/pulls).


## License

Licensed under [MIT License](LICENSE). Copyright (c) 2020 Marco Santonocito.