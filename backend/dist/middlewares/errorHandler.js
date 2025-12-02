"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
// Central error handler
function errorHandler(err, _req, res, _next) {
    console.error('[ERROR]', err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
}
