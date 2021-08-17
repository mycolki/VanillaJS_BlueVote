class ServerError extends Error {
  constructor() {
    this.name = "ServerError";
    this.status = 500;
    this.message = 'Server Error';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

module.exports = {
  ServerError,
  ValidationError,
};
