"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConfigController_1 = __importDefault(require("../controllers/ConfigController"));
const router = (0, express_1.Router)();
router.get('/:chave', ConfigController_1.default.getConfig);
router.post('/', ConfigController_1.default.setConfig);
exports.default = router;
