"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const DocumentsController_1 = require("../controllers/DocumentsController");
const router = (0, express_1.Router)();
router.get('/ping', health_controller_1.healthController.ping);
// Documents
router.post('/documents/upload', DocumentsController_1.documentsController.uploadDocument);
exports.default = router;
