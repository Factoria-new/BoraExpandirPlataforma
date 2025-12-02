"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsRepository = void 0;
const SupabaseClient_1 = require("../config/SupabaseClient");
const database_1 = require("../config/database");
class DocumentsRepository {
    // Faz upload do arquivo no bucket "documents" gerando um caminho único
    async saveFileToBucket(usuarioId, file) {
        const basePath = `usuarios/${usuarioId}`;
        const uniqueName = `${Date.now()}_${file.name}`;
        const objectPath = `${basePath}/${uniqueName}`;
        const { data, error } = await SupabaseClient_1.supabase.storage
            .from('documents')
            .upload(objectPath, file.content, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
        });
        if (error) {
            throw new Error(`Erro ao salvar no bucket: ${error.message}`);
        }
        // Obtém URL pública (caso o bucket esteja configurado como público)
        const publicUrlData = SupabaseClient_1.supabase.storage.from('documents').getPublicUrl(objectPath);
        return {
            path: data?.path || objectPath,
            publicUrl: publicUrlData.data.publicUrl,
        };
    }
    // Atualiza o campo bucket_root_path do usuário com o path do documento recém criado.
    async setUserBucketRootPath(usuarioId, filePath) {
        const usuario = await database_1.prisma.usuario.update({
            where: { id: usuarioId },
            data: { bucketRootPath: filePath },
        });
        return usuario;
    }
}
exports.documentsRepository = new DocumentsRepository();
