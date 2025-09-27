import { Request, Response, NextFunction } from 'express';
import { IUserPayload } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUserPayload;
        }
    }
}
export interface IAuthMiddleware {
    (req: Request, res: Response, next: NextFunction): void | Response;
}
export declare const auth: IAuthMiddleware;
export default auth;
