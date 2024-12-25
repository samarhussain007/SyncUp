import { STATUS_CODES } from "http";

export const CODES = {
  // Success
  success: 200, // OK
  created: 201, // Resource created successfully
  accepted: 202, // Request accepted but processing is not complete
  noContent: 204, // No content to send for this request

  // Client Errors
  badRequest: 400, // Invalid request
  unauthorized: 401, // Authentication is required or has failed
  forbidden: 403, // Server understands the request but refuses to authorize it
  notFound: 404, // Requested resource not found
  methodNotAllowed: 405, // HTTP method not allowed for this resource
  conflict: 409, // Request conflicts with the current state of the server
  unprocessableEntity: 422, // Validation error

  // Server Errors
  internalServerError: 500, // Generic server error
  notImplemented: 501, // Server does not recognize the request method
  badGateway: 502, // Received an invalid response from an upstream server
  serviceUnavailable: 503, // Server is not ready to handle the request
  gatewayTimeout: 504, // Upstream server failed to send a response in time
};
