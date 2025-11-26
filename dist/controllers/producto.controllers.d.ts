import { Request, Response } from 'express';
import { ICreateProductoRequest, IUpdateProductoRequest } from '../models/Producto.js';
export interface IErrorResponse {
    error: string;
    details?: string;
    message?: string;
}
export declare const getAllProductos: (req: Request, res: Response) => Promise<void>;
export declare const getProductoById: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const createProducto: (req: Request<{}, {}, ICreateProductoRequest>, res: Response) => Promise<void>;
export declare const updateProducto: (req: Request<{
    id: string;
}, {}, IUpdateProductoRequest>, res: Response) => Promise<void>;
export declare const deleteProducto: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const searchProductos: (req: Request, res: Response) => Promise<void>;
declare const _default: {
    getAllProductos: (req: Request, res: Response) => Promise<void>;
    getProductoById: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    createProducto: (req: Request<{}, {}, ICreateProductoRequest>, res: Response) => Promise<void>;
    updateProducto: (req: Request<{
        id: string;
    }, {}, IUpdateProductoRequest>, res: Response) => Promise<void>;
    deleteProducto: (req: Request<{
        id: string;
    }>, res: Response) => Promise<void>;
    searchProductos: (req: Request, res: Response) => Promise<void>;
};
export default _default;
//# sourceMappingURL=producto.controllers.d.ts.map