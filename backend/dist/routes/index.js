"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const DocumentsController_1 = require("../controllers/DocumentsController");
const calendar_1 = __importDefault(require("./calendar"));
const router = (0, express_1.Router)();
router.get('/ping', health_controller_1.healthController.ping);
router.post('/documents/upload', DocumentsController_1.documentsController.uploadDocument);
// Rotas do Google Calendar
router.use('/calendar', calendar_1.default);
exports.default = router;
