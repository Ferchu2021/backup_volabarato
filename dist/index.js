"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const paquete_js_1 = __importDefault(require("./routes/paquete.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const producto_routes_js_1 = __importDefault(require("./routes/producto.routes.js"));
const destino_routes_js_1 = __importDefault(require("./routes/destino.routes.js"));
const reserva_routes_js_1 = __importDefault(require("./routes/reserva.routes.js"));
const suscriptor_routes_js_1 = __importDefault(require("./routes/suscriptor.routes.js"));
const pago_routes_js_1 = __importDefault(require("./routes/pago.routes.js"));
const firebase_routes_js_1 = __importDefault(require("./routes/firebase.routes.js"));
require("./config/firebase.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
const corsOptions = {
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : process.env.NODE_ENV === 'production'
            ? ['https://frontend-volabarato.vercel.app', 'https://volabarato.vercel.app']
            : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
    app.use((req, res, next) => {
        console.log(`[REQUEST] ${req.method} ${req.path} - Headers Auth: ${req.header('Authorization') ? 'Presente' : 'Ausente'}`);
        next();
    });
}
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no estÃ¡ definida en las variables de entorno');
        }
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('âœ… Conectado a MongoDB Atlas');
    }
    catch (error) {
        console.error('âŒ Error de conexiÃ³n a MongoDB:', error);
        process.exit(1);
    }
};
app.use('/api/paquete', paquete_js_1.default);
app.use('/api/user', user_routes_js_1.default);
app.use('/api/producto', producto_routes_js_1.default);
app.use('/api/destino', destino_routes_js_1.default);
app.use('/api/reserva', reserva_routes_js_1.default);
app.use('/api/suscriptor', suscriptor_routes_js_1.default);
app.use('/api/pago', pago_routes_js_1.default);
app.use('/api/firebase', firebase_routes_js_1.default);
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
        message: 'Backend VolaBarato API',
        version: '1.0.0',
        status: 'running'
    });
});
app.get('/api', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({
        message: 'VolaBarato API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            paquete: '/api/paquete',
            user: '/api/user',
            producto: '/api/producto',
            destino: '/api/destino',
            reserva: '/api/reserva',
            suscriptor: '/api/suscriptor',
            pago: '/api/pago',
            firebase: '/api/firebase'
        }
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`,
        availableEndpoints: {
            paquete: '/api/paquete',
            user: '/api/user',
            producto: '/api/producto',
            destino: '/api/destino',
            reserva: '/api/reserva',
            suscriptor: '/api/suscriptor',
            pago: '/api/pago',
            firebase: '/api/firebase'
        }
    });
});
const startServer = async () => {
    try {
        await connectDB();
        const port = parseInt(process.env.PORT || '4000', 10);
        app.listen(port, () => {
            console.log(`🚀 Backend ready en puerto ${port}`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`📡 API disponible en: http://localhost:${port}/api`);
            }
            else {
                console.log(`📡 API disponible en puerto ${port}`);
            }
        });
    }
    catch (error) {
        console.error('âŒ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map