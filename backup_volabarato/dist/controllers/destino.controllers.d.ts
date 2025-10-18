import { Request, Response } from 'express';
import { ICreateDestinoRequest, IUpdateDestinoRequest } from '../models/Destino';
export interface IErrorResponse {
    error: string;
    details?: string;
    message?: string;
}
export declare const getAllDestinos: (req: Request, res: Response) => Promise<void>;
export declare const getDestinoById: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const createDestino: (req: Request<{}, {}, ICreateDestinoRequest>, res: Response) => Promise<void>;
export declare const updateDestino: (req: Request<{
    id: string;
}, {}, IUpdateDestinoRequest>, res: Response) => Promise<void>;
export declare const deleteDestino: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const searchDestinos: (req: Request, res: Response) => Promise<void>;
export declare const getDestinosByPais: (req: Request<{
    pais: string;
}>, res: Response) => Promise<void>;
export declare const getDestinosByClima: (req: Request<{
    clima: string;
}>, res: Response) => Promise<void>;
declare const _default: {
    getAllDestinos: (req: Request, res: Response) => Promise<void>;
    getDestinoById: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    createDestino: (req: Request<{}, {}, ICreateDestinoRequest>, res: Response) => Promise<void>;
    updateDestino: (req: Request<{
        id: string;
    }, {}, IUpdateDestinoRequest>, res: Response) => Promise<void>;
    deleteDestino: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    searchDestinos: (req: Request, res: Response) => Promise<void>;
    getDestinosByPais: (req: Request<{
        pais: string;
    }>, res: Response) => Promise<void>;
    getDestinosByClima: (req: Request<{
        clima: string;
    }>, res: Response) => Promise<void>;
};
export default _default;
