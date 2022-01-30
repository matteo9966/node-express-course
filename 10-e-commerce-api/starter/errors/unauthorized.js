const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

module.exports=class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
      }
}
