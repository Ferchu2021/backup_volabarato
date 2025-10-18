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
const paquete_1 = __importDefault(require("./routes/paquete"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const producto_routes_1 = __importDefault(require("./routes/producto.routes"));
const destino_routes_1 = __importDefault(require("./routes/destino.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está definida en las variables de entorno');
        }
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB Atlas');
    }
    catch (error) {
        console.error('❌ Error de conexión a MongoDB:', error);
        process.exit(1);
    }
};
app.use('/api/paquete', paquete_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/producto', producto_routes_1.default);
app.use('/api/destino', destino_routes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Backend VolaBarato API',
        version: '1.0.0',
        status: 'running'
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});
const startServer = async () => {
    try {
        await connectDB();
        const port = parseInt(process.env.PORT || '4000', 10);
        app.listen(port, () => {
            console.log(`🚀 Backend ready en puerto ${port}`);
            console.log(`📡 API disponible en: http://localhost:${port}/api`);
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map