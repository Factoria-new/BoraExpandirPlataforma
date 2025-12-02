"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
exports.healthController = {
    ping: (_req, res) => {
        res.json({ success: true, message: 'pong', timestamp: new Date().toISOString() });
    },
};
