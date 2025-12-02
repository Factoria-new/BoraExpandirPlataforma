"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const env_1 = require("./config/env");
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares básicos
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rota raiz simples
app.get('/', (_req, res) => {
    res.json({ ok: true, message: 'API BoraExpandir', env: env_1.env.NODE_ENV });
});
app.get('/', (_req, res) => {
    res.json({ ok: true, message: 'Endpoint de exemplo funcionando!' });
});
// Usando roteador principal em /api
app.use('/api', routes_1.default);
// 404 e erros
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
// Inicialização do servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(env_1.env.PORT, () => {
        console.log(`Servidor rodando na porta ${env_1.env.PORT}`);
    });
}
exports.default = app;
