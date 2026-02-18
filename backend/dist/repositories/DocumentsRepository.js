"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsRepository = void 0;
const SupabaseClient_1 = require("../config/SupabaseClient");
const database_1 = require("../config/database");
class DocumentsRepository {
    async saveFileToBucket(usuarioId, file) {
        const basePath = `usuarios/${usuarioId}`;
        const uniqueName = `${Date.now()}_${file.name}`;
        const objectPath = `${basePath}/${uniqueName}`;
        const { data, error } = await SupabaseClient_1.supabase.storage
            .from('documentos')
            .upload(`public/${file.name}`, file.content, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
        });
        if (error) {
            throw new Error(`Erro ao salvar no bucket: ${error.message}`);
        }
        const publicUrlData = SupabaseClient_1.supabase.storage.from('documentos').getPublicUrl(objectPath);
        return {
            path: data?.path || objectPath,
            publicUrl: publicUrlData.data.publicUrl,
        };
    }
    async setUserBucketRootPath(usuarioId, filePath) {
        const usuario = await database_1.prisma.usuario.update({
            where: { id: usuarioId },
            data: { bucketRootPath: filePath },
        });
        return usuario;
    }
}
exports.documentsRepository = new DocumentsRepository();
