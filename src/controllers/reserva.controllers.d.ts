import { Request, Response } from 'express';
import { ICreateReservaRequest, IUpdateReservaRequest } from '../models/Reserva.js';
export interface IErrorResponse {
    error: string;
    details?: string;
    message?: string;
}
export declare const getAllReservas: (req: Request, res: Response) => Promise<void>;
export declare const getReservaById: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const getMisReservas: (req: Request, res: Response) => Promise<void>;
export declare const getReservasByUsuario: (req: Request<{
    usuarioId: string;
}>, res: Response) => Promise<void>;
export declare const createReserva: (req: Request<{}, {}, ICreateReservaRequest>, res: Response) => Promise<void>;
export declare const updateReserva: (req: Request<{
    id: string;
}, {}, IUpdateReservaRequest>, res: Response) => Promise<void>;
export declare const cancelarReserva: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const confirmarReserva: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const deleteReserva: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const getReservasStats: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getAllReservas: (req: Request, res: Response) => Promise<void>;
    getReservaById: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    getReservasByUsuario: (req: Request<{
        usuarioId: string;
    }>, res: Response) => Promise<void>;
    getMisReservas: (req: Request, res: Response) => Promise<void>;
    createReserva: (req: Request<{}, {}, ICreateReservaRequest>, res: Response) => Promise<void>;
    updateReserva: (req: Request<{
        id: string;
    }, {}, IUpdateReservaRequest>, res: Response) => Promise<void>;
    cancelarReserva: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    confirmarReserva: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    deleteReserva: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    getReservasStats: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=reserva.controllers.d.ts.map