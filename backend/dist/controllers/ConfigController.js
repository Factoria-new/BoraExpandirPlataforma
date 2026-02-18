"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigRepository_1 = __importDefault(require("../repositories/ConfigRepository"));
class ConfigController {
    async getConfig(req, res) {
        try {
            const { chave } = req.params;
            const valor = await ConfigRepository_1.default.get(chave);
            return res.status(200).json({ chave, valor });
        }
        catch (error) {
            console.error('[ConfigController.getConfig] Error:', error);
            return res.status(500).json({ error: 'Erro ao buscar configuração' });
        }
    }
    async setConfig(req, res) {
        try {
            const { chave, valor } = req.body;
            if (!chave) {
                return res.status(400).json({ error: 'Chave é obrigatória' });
            }
            const data = await ConfigRepository_1.default.set(chave, valor);
            return res.status(200).json(data);
        }
        catch (error) {
            console.error('[ConfigController.setConfig] Error:', error);
            return res.status(500).json({ error: 'Erro ao salvar configuração' });
        }
    }
}
exports.default = new ConfigController();
