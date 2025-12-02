"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
function notFound(_req, res, _next) {
    res.status(404).json({ success: false, error: 'Rota não encontrada' });
}
