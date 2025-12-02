"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsController = void 0;
const SupabaseClient_1 = require("../config/SupabaseClient");
class DocumentsController {
    async uploadDocument(req, res) {
        try {
            const { file } = req.body;
            if (!file || !file.name || !file.content) {
                return res.status(400).json({ error: 'Parâmetros inválidos: file.name e file.content são obrigatórios.' });
            }
            const { data, error } = await SupabaseClient_1.supabase.storage
                .from('documents')
                .upload(`public/${file.name}`, file.content, {
                contentType: file.type || 'application/octet-stream',
                upsert: false,
            });
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ message: 'File uploaded successfully', data });
        }
        catch (err) {
            console.error('[DocumentsController.uploadDocument] Error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
exports.documentsController = new DocumentsController();
