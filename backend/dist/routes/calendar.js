"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CalendarController_1 = __importDefault(require("../controllers/CalendarController"));
const router = (0, express_1.Router)();
// Rotas de conexão
router.get('/connect', CalendarController_1.default.getConnectionUrl);
router.get('/status', CalendarController_1.default.getConnectionStatus);
router.get('/callback', CalendarController_1.default.handleCallback);
// Rotas de eventos
router.post('/events', CalendarController_1.default.createEvent);
router.put('/events/:eventId', CalendarController_1.default.updateEvent);
router.delete('/events/:eventId', CalendarController_1.default.deleteEvent);
exports.default = router;
