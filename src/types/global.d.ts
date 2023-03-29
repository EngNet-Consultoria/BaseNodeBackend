import { type Send, type Query } from "express-serve-static-core";
import { type Request, type Response } from "express";

declare global {
  interface Res<ResBody> extends Response {
    json: Send<ResBody, this>;
  }

  interface Req<ReqBody = any, ReqQuery extends Query = any> extends Request {
    body: ReqBody;
    query: ReqQuery;
  }
}
