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
const parceiro_1 = __importDefault(require("./routes/parceiro"));
const cliente_1 = __importDefault(require("./routes/cliente"));
const comercial_1 = __importDefault(require("./routes/comercial"));
const juridico_1 = __importDefault(require("./routes/juridico"));
const traducoes_1 = __importDefault(require("./routes/traducoes"));
const config_1 = __importDefault(require("./routes/config"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// Rota de Webhook do Stripe precisa do corpo bruto (raw) para validar a assinatura
app.post('/comercial/webhook/stripe', express_1.default.raw({ type: 'application/json' }), (req, res) => {
    const ComercialController = require('./controllers/ComercialController').default;
    ComercialController.handleStripeWebhook(req, res);
});
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.get('/', (_req, res) => {
    res.json({ ok: true, message: 'API BoraExpandir', env: env_1.env.NODE_ENV });
});
app.get('/', (_req, res) => {
    res.json({ ok: true, message: 'Endpoint de exemplo funcionando!' });
});
app.use('/api', routes_1.default);
app.use('/parceiro', parceiro_1.default);
app.use('/cliente', cliente_1.default);
app.use('/comercial', comercial_1.default);
app.use('/juridico', juridico_1.default);
app.use('/traducoes', traducoes_1.default);
app.use('/configuracoes', config_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== 'test') {
    app.listen(env_1.env.PORT, () => {
        console.log(`Servidor rodando na porta ${env_1.env.PORT}`);
    });
}
exports.default = app;
