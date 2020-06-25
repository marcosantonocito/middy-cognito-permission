const createError = require('http-errors')

module.exports = (opts) => {
  const defaults = {
    allowedRoles: []
  }

  const options = Object.assign({}, defaults, opts)

  /**
   * allowedRoles param can be a single role string (e.g. Role.User or 'User')
   * or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  **/
  if (typeof options.allowedRoles === 'string') {
    options.allowedRoles = [options.allowedRoles]
  }

  return {
    before: (handler, next) => {
      const allowedRoles = options.allowedRoles

      if (allowedRoles.length === 0) {
        next()
      }

      const authorizer = 'authorizer' in handler.event.requestContext ? handler.event.requestContext.authorizer : null

      if (authorizer === null) {
        throw new createError.Unauthorized('Unauthorized')
      }

      const userGroups = 'cognito:groups' in authorizer.claims ? authorizer.claims['cognito:groups'] : []

      if (userGroups === undefined || userGroups.length === 0) {
        throw new createError.Forbidden('You don\'t have any role associated with your account')
      }

      // Checking if userGroups contains at least one item from allowedRoles
      if (allowedRoles.length && !userGroups.some((val) => allowedRoles.includes(val))) {
        // user's role is not authorized
        throw new createError.Forbidden('You don\'t have the permission to access this resource')
      }

      // authorization successful
      next()
    }
  }
}
