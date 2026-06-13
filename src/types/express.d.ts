


declare namespace Express {
  export interface Request {
    userId?: string;
  }

  /**
   * Adds a `success` convenience method to the Express Response.
   * @param data        Payload to return.
   * @param message     Optional human‑readable message (default: "Success").
   * @param statusCode  Optional HTTP status code (default: 200).
   */
  export interface Response {
    success<T = any>(data: T, message?: string, statusCode?: number): this;
  }
}
