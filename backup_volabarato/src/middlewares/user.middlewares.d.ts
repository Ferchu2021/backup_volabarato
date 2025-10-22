import { Request, Response, NextFunction } from 'express';
import { IUserPayload } from '../models/user.models';
declare global {
    namespace Express {
        interface Request {
            user?: IUserPayload;
        }
    }
}
export declare const checkUserExists: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
export declare const checkUserNotExists: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
export declare const validatePasswordFormat: (req: Request, res: Response, next: NextFunction) => void | Response;
export declare const validateUsernameFormat: (req: Request, res: Response, next: NextFunction) => void | Response;
export declare const checkUserActive: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
export declare const basicRateLimit: (req: Request, res: Response, next: NextFunction) => void | Response;
declare const _default: {
    checkUserExists: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
    checkUserNotExists: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
    validatePasswordFormat: (req: Request, res: Response, next: NextFunction) => void | Response;
    validateUsernameFormat: (req: Request, res: Response, next: NextFunction) => void | Response;
    checkUserActive: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
    basicRateLimit: (req: Request, res: Response, next: NextFunction) => void | Response;
};
export default _default;
//# sourceMappingURL=user.middlewares.d.ts.map