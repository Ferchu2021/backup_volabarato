import { Request, Response } from 'express';
import { ILoginRequest, IRegisterRequest } from '../models/user.models';
export interface IRegisterResponse {
    message: string;
    user: {
        _id: string;
        usuario: string;
    };
}
export interface IErrorResponse {
    error: string;
    details?: string;
    message?: string;
}
export declare const registerUser: (req: Request<{}, {}, IRegisterRequest>, res: Response) => Promise<void>;
export declare const loginUser: (req: Request<{}, {}, ILoginRequest>, res: Response) => Promise<void>;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<void>;
export declare const updateUser: (req: Request, res: Response) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    registerUser: (req: Request<{}, {}, IRegisterRequest>, res: Response) => Promise<void>;
    loginUser: (req: Request<{}, {}, ILoginRequest>, res: Response) => Promise<void>;
    getCurrentUser: (req: Request, res: Response) => Promise<void>;
    updateUser: (req: Request, res: Response) => Promise<void>;
    deleteUser: (req: Request, res: Response) => Promise<void>;
    getAllUsers: (req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=user.controllers.d.ts.map