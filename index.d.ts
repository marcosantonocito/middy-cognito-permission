import middy from '@middy/core'

interface IPermissionOptions {
  allowedRoles?: string[]
}

declare const cognitoPermission: middy.Middleware<IPermissionOptions, any, any>

export default cognitoPermission