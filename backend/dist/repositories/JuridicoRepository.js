"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SupabaseClient_1 = require("../config/SupabaseClient");
class JuridicoRepository {
    // =============================================
    // GESTÃO DE FUNCIONÁRIOS DO JURÍDICO
    // =============================================
    // Buscar todos os funcionários do jurídico
    async getFuncionarios() {
        const { data, error } = await SupabaseClient_1.supabase
            .from('profiles')
            .select('id, full_name, email, telefone')
            .eq('role', 'juridico')
            .order('full_name', { ascending: true });
        if (error) {
            console.error('Erro ao buscar funcionários do jurídico:', error);
            throw error;
        }
        return (data || []);
    }
    // Buscar funcionário por ID
    async getFuncionarioById(funcionarioId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('profiles')
            .select('id, full_name, email, telefone')
            .eq('id', funcionarioId)
            .eq('role', 'juridico')
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // Not found
            console.error('Erro ao buscar funcionário:', error);
            throw error;
        }
        return data;
    }
    // =============================================
    // GESTÃO DE PROCESSOS DO JURÍDICO
    // =============================================
    // Listar todos os processos com dados do cliente e responsável
    async getProcessos() {
        const { data: processos, error } = await SupabaseClient_1.supabase
            .from('processos')
            .select(`
                *,
                client:profiles!client_id (
                    id,
                    full_name,
                    email
                ),
                documentos (*),
                requerimentos (*)
            `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar processos:', error);
            throw error;
        }
        if (!processos || processos.length === 0)
            return [];
        // Buscar responsáveis únicos
        const responsavelIds = [...new Set(processos
                .filter(p => p.responsavel_id)
                .map(p => p.responsavel_id))];
        let responsaveisMap = {};
        if (responsavelIds.length > 0) {
            const { data: responsaveis } = await SupabaseClient_1.supabase
                .from('profiles')
                .select('id, full_name, email, telefone')
                .in('id', responsavelIds);
            if (responsaveis) {
                responsaveisMap = responsaveis.reduce((acc, r) => {
                    acc[r.id] = r;
                    return acc;
                }, {});
            }
        }
        // Mapear processos com seus responsáveis
        return processos.map(processo => ({
            ...processo,
            responsavel: processo.responsavel_id
                ? responsaveisMap[processo.responsavel_id] || null
                : null
        }));
    }
    // Listar processos sem responsável (vagos)
    async getProcessosSemResponsavel() {
        const { data, error } = await SupabaseClient_1.supabase
            .from('processos')
            .select(`
                *,
                client:profiles!client_id (
                    id,
                    full_name,
                    email
                ),
                documentos (*)
            `)
            .is('responsavel_id', null)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar processos sem responsável:', error);
            throw error;
        }
        return data || [];
    }
    // Listar processos de um responsável específico
    async getProcessosByResponsavel(responsavelId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('processos')
            .select(`
                *,
                clientes:clientes!cliente_id (
                    id,
                    nome,
                    email
                ),
                documentos (*),
                requerimentos (*)
            `)
            .eq('responsavel_id', responsavelId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar processos do responsável:', error);
            throw error;
        }
        return data || [];
    }
    // Atribuir responsável jurídico a um processo
    async atribuirResponsavel(processoId, responsavelId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('processos')
            .update({
            responsavel_id: responsavelId,
            delegado_em: responsavelId ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        })
            .eq('id', processoId)
            .select()
            .single();
        if (error) {
            console.error('Erro ao atribuir responsável jurídico:', error);
            throw error;
        }
        return data;
    }
    // Atualizar etapa do processo
    async updateEtapaProcesso(processoId, etapa) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('processos')
            .update({
            etapa_atual: etapa,
            updated_at: new Date().toISOString()
        })
            .eq('id', processoId)
            .select()
            .single();
        if (error) {
            console.error('Erro ao atualizar etapa do processo:', error);
            throw error;
        }
        return data;
    }
    // Buscar clientes por responsável jurídico
    async getClientesByResponsavel(responsavelId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('clientes')
            .select('*')
            .eq('responsavel_juridico_id', responsavelId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar clientes do responsável:', error);
            throw error;
        }
        return data || [];
    }
    // Buscar clientes sem responsável jurídico (vagos)
    async getClientesSemResponsavel() {
        const { data, error } = await SupabaseClient_1.supabase
            .from('clientes')
            .select('*')
            .is('responsavel_juridico_id', null)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar clientes sem responsável:', error);
            throw error;
        }
        return data || [];
    }
    // Buscar cliente com dados do responsável jurídico
    async getClienteComResponsavel(clienteId) {
        // Primeiro busca o cliente
        const { data: cliente, error: clienteError } = await SupabaseClient_1.supabase
            .from('clientes')
            .select('*')
            .eq('id', clienteId)
            .single();
        if (clienteError) {
            if (clienteError.code === 'PGRST116')
                return null;
            console.error('Erro ao buscar cliente:', clienteError);
            throw clienteError;
        }
        // Se tiver responsável, busca os dados dele
        if (cliente?.responsavel_juridico_id) {
            const { data: responsavel, error: responsavelError } = await SupabaseClient_1.supabase
                .from('profiles')
                .select('id, full_name, email, telefone')
                .eq('id', cliente.responsavel_juridico_id)
                .single();
            if (!responsavelError && responsavel) {
                return {
                    ...cliente,
                    responsavel_juridico: responsavel
                };
            }
        }
        return {
            ...cliente,
            responsavel_juridico: null
        };
    }
    // Buscar todos os clientes com seus responsáveis (para listagem geral)
    async getAllClientesComResponsavel() {
        const { data: clientes, error } = await SupabaseClient_1.supabase
            .from('clientes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar clientes:', error);
            throw error;
        }
        if (!clientes || clientes.length === 0)
            return [];
        // Buscar todos os responsáveis únicos
        const responsavelIds = [...new Set(clientes
                .filter(c => c.responsavel_juridico_id)
                .map(c => c.responsavel_juridico_id))];
        let responsaveisMap = {};
        if (responsavelIds.length > 0) {
            const { data: responsaveis } = await SupabaseClient_1.supabase
                .from('profiles')
                .select('id, full_name, email, telefone')
                .in('id', responsavelIds);
            if (responsaveis) {
                responsaveisMap = responsaveis.reduce((acc, r) => {
                    acc[r.id] = r;
                    return acc;
                }, {});
            }
        }
        // Mapear clientes com seus responsáveis
        return clientes.map(cliente => ({
            ...cliente,
            responsavel_juridico: cliente.responsavel_juridico_id
                ? responsaveisMap[cliente.responsavel_juridico_id] || null
                : null
        }));
    }
    // =============================================
    // ESTATÍSTICAS DO JURÍDICO
    // =============================================
    // Contar clientes por responsável
    async getEstatisticasPorResponsavel() {
        const funcionarios = await this.getFuncionarios();
        const stats = await Promise.all(funcionarios.map(async (func) => {
            const { count } = await SupabaseClient_1.supabase
                .from('clientes')
                .select('*', { count: 'exact', head: true })
                .eq('responsavel_juridico_id', func.id);
            return {
                funcionario: func,
                totalClientes: count || 0
            };
        }));
        // Adicionar contagem de vagos
        const { count: vagos } = await SupabaseClient_1.supabase
            .from('clientes')
            .select('*', { count: 'exact', head: true })
            .is('responsavel_juridico_id', null);
        return [
            ...stats,
            { funcionario: null, totalClientes: vagos || 0, isVago: true }
        ];
    }
    // =============================================
    // FORMULÁRIOS DO JURÍDICO (enviados para clientes)
    // =============================================
    // Upload document to formularios-juridico bucket
    async uploadFormularioJuridico(params) {
        const { data, error } = await SupabaseClient_1.supabase.storage
            .from('formularios-juridico')
            .upload(params.filePath, params.fileBuffer, {
            contentType: params.contentType,
            upsert: true
        });
        if (error) {
            console.error('Erro ao fazer upload para bucket formularios-juridico:', error);
            throw error;
        }
        const { data: urlData } = SupabaseClient_1.supabase.storage
            .from('formularios-juridico')
            .getPublicUrl(params.filePath);
        return {
            path: data.path,
            fullPath: data.fullPath,
            publicUrl: urlData.publicUrl
        };
    }
    // Create formulario_juridico record
    async createFormularioJuridico(params) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('formularios_juridico')
            .insert([{
                funcionario_juridico_id: params.funcionarioJuridicoId,
                cliente_id: params.clienteId,
                membro_id: params.membroId || null,
                processo_id: params.processoId || null,
                nome_original: params.nomeOriginal,
                nome_arquivo: params.nomeArquivo,
                storage_path: params.storagePath,
                public_url: params.publicUrl,
                content_type: params.contentType,
                tamanho: params.tamanho
            }])
            .select()
            .single();
        if (error) {
            console.error('Erro ao criar formulário jurídico:', error);
            throw error;
        }
        return data;
    }
    // Get formularios_juridico by cliente (documents sent to this client)
    async getFormulariosJuridicoByClienteId(clienteId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('formularios_juridico')
            .select('*')
            .eq('cliente_id', clienteId)
            .order('criado_em', { ascending: false });
        if (error) {
            console.error('Erro ao buscar formulários jurídico:', error);
            throw error;
        }
        return (data || []).map(f => ({
            id: f.id,
            name: f.nome_original?.replace(/\.[^/.]+$/, '') || 'Documento',
            fileName: f.nome_original,
            fileSize: f.tamanho,
            uploadDate: f.criado_em,
            memberId: f.membro_id,
            downloadUrl: f.public_url,
            funcionarioId: f.funcionario_juridico_id
        }));
    }
    // Delete formulario_juridico
    async deleteFormularioJuridico(formularioId) {
        // Fetch to get storage_path
        const { data: formulario, error: fetchError } = await SupabaseClient_1.supabase
            .from('formularios_juridico')
            .select('storage_path')
            .eq('id', formularioId)
            .single();
        if (fetchError) {
            console.error('Erro ao buscar formulário jurídico para deletar:', fetchError);
            throw fetchError;
        }
        if (formulario?.storage_path) {
            const { error: storageError } = await SupabaseClient_1.supabase.storage
                .from('formularios-juridico')
                .remove([formulario.storage_path]);
            if (storageError) {
                console.error('Erro ao deletar arquivo do storage:', storageError);
            }
        }
        const { error: deleteError } = await SupabaseClient_1.supabase
            .from('formularios_juridico')
            .delete()
            .eq('id', formularioId);
        if (deleteError) {
            console.error('Erro ao deletar formulário jurídico:', deleteError);
            throw deleteError;
        }
    }
    // Get formulários with response status (waiting or received)
    async getFormulariosWithResponses(clienteId, membroId) {
        // 1. Fetch all formularios_juridico for this client/member
        let query = SupabaseClient_1.supabase
            .from('formularios_juridico')
            .select('*')
            .eq('cliente_id', clienteId)
            .order('criado_em', { ascending: false });
        if (membroId) {
            query = query.eq('membro_id', membroId);
        }
        const { data: formularios, error } = await query;
        if (error) {
            console.error('Erro ao buscar formulários jurídico:', error);
            throw error;
        }
        if (!formularios || formularios.length === 0) {
            return [];
        }
        // 2. For each formulário, check if there's a response in formularios_cliente
        const formularioIds = formularios.map(f => f.id);
        const { data: respostas, error: respostasError } = await SupabaseClient_1.supabase
            .from('formularios_cliente')
            .select('*')
            .in('formulario_juridico_id', formularioIds);
        if (respostasError) {
            console.error('Erro ao buscar respostas de formulários:', respostasError);
            // Continue without responses if there's an error
        }
        // Create a map of formularioId -> response
        const respostasMap = {};
        if (respostas) {
            respostas.forEach(r => {
                respostasMap[r.formulario_juridico_id] = r;
            });
        }
        // 3. Map formulários with their status
        return formularios.map(f => {
            const resposta = respostasMap[f.id];
            return {
                id: f.id,
                name: f.nome_original?.replace(/\.[^/.]+$/, '') || 'Formulário',
                fileName: f.nome_original,
                fileSize: f.tamanho,
                uploadDate: f.criado_em,
                memberId: f.membro_id,
                downloadUrl: f.public_url,
                funcionarioId: f.funcionario_juridico_id,
                // Response status
                status: resposta ? 'received' : 'waiting',
                // Response approval status (pendente/aprovado/rejeitado)
                responseStatus: resposta?.status || null,
                motivoRejeicao: resposta?.motivo_rejeicao || null,
                // Response data (if exists)
                response: resposta ? {
                    id: resposta.id,
                    fileName: resposta.nome_original,
                    downloadUrl: resposta.public_url,
                    uploadDate: resposta.criado_em
                } : null
            };
        });
    }
    // Update formulario_cliente status (approve/reject)
    async updateFormularioClienteStatus(formularioClienteId, status, motivoRejeicao) {
        const updateData = {
            status,
            atualizado_em: new Date().toISOString()
        };
        // Only set motivo_rejeicao if rejecting
        if (status === 'rejeitado' && motivoRejeicao) {
            updateData.motivo_rejeicao = motivoRejeicao;
        }
        else if (status !== 'rejeitado') {
            updateData.motivo_rejeicao = null;
        }
        const { data, error } = await SupabaseClient_1.supabase
            .from('formularios_cliente')
            .update(updateData)
            .eq('id', formularioClienteId)
            .select()
            .single();
        if (error) {
            console.error('Erro ao atualizar status do formulário cliente:', error);
            throw error;
        }
        return data;
    }
    // =============================================
    // GESTÃO DE NOTAS DO JURÍDICO
    // =============================================
    // Criar uma nova nota
    async createNote(params) {
        console.log('[JuridicoRepository] Tentando inserir nota no Supabase...');
        const { data, error } = await SupabaseClient_1.supabase
            .from('notas_juridico')
            .insert([{
                cliente_id: params.clienteId,
                processo_id: params.processoId || null,
                etapa: params.etapa || null,
                autor_id: params.autorId,
                texto: params.texto
            }])
            .select(`
                *,
                autor:profiles!autor_id (
                    id,
                    full_name
                )
            `)
            .single();
        if (error) {
            console.error('[JuridicoRepository] Erro do Supabase ao inserir nota:', error);
            throw error;
        }
        console.log('[JuridicoRepository] Nota inserida com sucesso:', data?.id);
        return data;
    }
    // Buscar todas as notas de um cliente
    async getNotesByClienteId(clienteId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('notas_juridico')
            .select(`
                *,
                autor:profiles!autor_id (
                    id,
                    full_name
                )
            `)
            .eq('cliente_id', clienteId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar notas jurídicas:', error);
            throw error;
        }
        return data || [];
    }
    // Deletar uma nota
    async deleteNote(noteId) {
        const { error } = await SupabaseClient_1.supabase
            .from('notas_juridico')
            .delete()
            .eq('id', noteId);
        if (error) {
            console.error('Erro ao deletar nota jurídica:', error);
            throw error;
        }
    }
    // Solicitar um documento (criar registro pendente)
    async solicitarDocumento(params) {
        console.log('========== SOLICITAR DOCUMENTO REPO DEBUG ==========');
        console.log('Params:', {
            clienteId: params.clienteId,
            tipo: params.tipo,
            processoId: params.processoId,
            membroId: params.membroId,
            notificar: params.notificar,
            notificarType: typeof params.notificar,
            prazo: params.prazo
        });
        // 1. Criar o documento
        console.log('Tentando criar registro em documentos...');
        const { data: doc, error: docError } = await SupabaseClient_1.supabase
            .from('documentos')
            .insert([{
                cliente_id: params.clienteId,
                tipo: params.tipo,
                processo_id: params.processoId || null,
                dependente_id: params.membroId || null,
                status: 'PENDING',
                nome_original: params.tipo,
                nome_arquivo: params.tipo,
                storage_path: 'pending',
                criado_em: new Date().toISOString(),
                atualizado_em: new Date().toISOString()
            }])
            .select()
            .single();
        if (docError) {
            console.error('Erro ao solicitar documento no repositório:', docError);
            throw docError;
        }
        console.log('Documento criado com sucesso:', doc.id);
        // 2. Criar notificação se solicitado
        if (params.notificar === true || params.notificar === 'true') {
            console.log('Notificar é true, tentando criar notificação para o cliente...');
            const prazoDias = params.prazo || 7;
            const dataPrazo = new Date();
            dataPrazo.setDate(dataPrazo.getDate() + prazoDias);
            const notificacaoData = {
                cliente_id: params.clienteId,
                criador_id: params.criadorId, // Adicionando quem criou a solicitação
                titulo: params.tipo,
                mensagem: `A equipe jurídica solicitou o seguinte documento: ${params.tipo}. Por favor, realize o envio o quanto antes.`,
                lida: false,
                data_prazo: dataPrazo.toISOString(),
                criado_em: new Date().toISOString()
            };
            console.log('Dados da notificação (cliente_id):', notificacaoData);
            const { data: notif, error: notifError } = await SupabaseClient_1.supabase
                .from('notificacoes')
                .insert([notificacaoData])
                .select();
            if (notifError) {
                console.error('Erro ao criar notificação (FK violada?):', notifError);
                // Não travamos o processo se a notificação falhar
            }
            else {
                console.log('Notificação criada com sucesso:', notif);
            }
        }
        else {
            console.log('Notificar está desmarcado ou não é true/boolean.');
        }
        console.log('=====================================================');
        return doc;
    }
    // Solicitar um requerimento
    async solicitarRequerimento(params) {
        console.log('========== SOLICITAR REQUERIMENTO REPO DEBUG ==========');
        console.log('Params:', params);
        const { data, error } = await SupabaseClient_1.supabase
            .from('requerimentos')
            .insert([{
                cliente_id: params.clienteId,
                processo_id: params.processoId || null,
                tipo: params.tipo,
                status: 'pendente',
                criador_id: params.criadorId || null,
                observacoes: params.observacoes || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();
        if (error) {
            console.error('Erro ao solicitar requerimento no repositório:', error);
            throw error;
        }
        console.log('Requerimento solicitado com sucesso:', data.id);
        console.log('========================================================');
        return data;
    }
    // Buscar requerimentos de um cliente
    async getRequerimentosByClienteId(clienteId) {
        const { data, error } = await SupabaseClient_1.supabase
            .from('requerimentos')
            .select('*')
            .eq('cliente_id', clienteId)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Erro ao buscar requerimentos do cliente:', error);
            throw error;
        }
        return data || [];
    }
}
exports.default = new JuridicoRepository();
