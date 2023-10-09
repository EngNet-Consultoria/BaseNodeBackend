export interface ErrorResponse {
  message: any;
  timestamp: string;
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }

  static fromError(err: Error): DatabaseError {
    return new DatabaseError(err.message);
  }
}
