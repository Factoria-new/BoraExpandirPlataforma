"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TraducoesController_1 = __importDefault(require("../controllers/TraducoesController"));
const router = (0, express_1.Router)();
// GET /api/traducoes/orcamentos/pendentes
router.get('/orcamentos/pendentes', TraducoesController_1.default.getOrcamentos);
// POST /api/traducoes/orcamentos
router.post('/orcamentos', TraducoesController_1.default.responderOrcamento);
// GET /api/traducoes/orcamentos/documento/:documentoId
router.get('/orcamentos/documento/:documentoId', TraducoesController_1.default.getOrcamentoByDocumento);
// POST /api/traducoes/orcamentos/:id/aprovar
router.post('/orcamentos/:id/aprovar', TraducoesController_1.default.aprovarOrcamento);
// POST /api/traducoes/orcamentos/:id/aprovar-adm
router.post('/orcamentos/:id/aprovar-adm', TraducoesController_1.default.aprovarOrcamentoAdm);
// POST /api/traducoes/checkout/stripe
router.post('/checkout/stripe', TraducoesController_1.default.createCheckoutSession);
exports.default = router;
