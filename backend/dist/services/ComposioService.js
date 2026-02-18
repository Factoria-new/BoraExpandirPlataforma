"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@composio/core");
class ComposioService {
    constructor() {
        // Inicializa Composio com a API key do .env
        this.composio = new core_1.Composio({
            apiKey: process.env.COMPOSIO_API_KEY || '',
        });
    }
    /**
     * Cria um evento no Google Calendar
     * @param userId - ID do usuário (entity ID)
     * @param eventData - Dados do evento a ser criado
     * @returns Resposta com ID e link do evento criado
     */
    async createCalendarEvent(userId, eventData) {
        try {
            console.log('🗓️ Criando evento no Google Calendar...', {
                userId,
                summary: eventData.summary,
                startTime: eventData.startTime,
            });
            // Formata as datas no formato esperado pela API do Composio
            // Formato: YYYY-MM-DDTHH:MM:SS (sem timezone, será adicionado pelo parâmetro timezone)
            const formatDateTime = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };
            const startDateTime = formatDateTime(eventData.startTime);
            const timezone = eventData.timeZone || 'America/Sao_Paulo';
            // Calcula a duração em horas e minutos
            const durationMs = eventData.endTime.getTime() - eventData.startTime.getTime();
            const durationMinutes = Math.floor(durationMs / 60000);
            const eventDurationHour = Math.floor(durationMinutes / 60);
            const eventDurationMinutes = durationMinutes % 60;
            // Prepara os attendees no formato correto
            const attendees = eventData.attendees || [];
            // Executa a ação do Google Calendar através do Composio
            const response = await this.composio.tools.execute("GOOGLECALENDAR_CREATE_EVENT", {
                userId,
                version: "20260203_00",
                arguments: {
                    summary: eventData.summary,
                    description: eventData.description ?? "",
                    start_datetime: startDateTime,
                    timezone: timezone,
                    event_duration_hour: eventDurationHour,
                    event_duration_minutes: eventDurationMinutes,
                    attendees,
                    location: eventData.location ?? "",
                    send_updates: true,
                },
            });
            console.log('✅ Evento criado com sucesso!');
            console.log('📦 Resposta completa:', JSON.stringify(response, null, 2));
            // A resposta do Composio tem estrutura: { data: Record<string, unknown>, error, successful }
            const data = response?.data;
            const eventId = data?.id || data?.event_id || data?.eventId;
            const eventLink = data?.htmlLink || data?.html_link;
            console.log('🔍 EventId extraído:', eventId);
            console.log('🔗 EventLink extraído:', eventLink);
            return {
                success: true,
                eventId: eventId,
                eventLink: eventLink,
            };
        }
        catch (error) {
            console.error('❌ Erro ao criar evento no Google Calendar:', error);
            console.error('Detalhes do erro:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data,
                status: error.response?.status,
                fullError: JSON.stringify(error, null, 2),
            });
            return {
                success: false,
                error: error.message || 'Erro desconhecido ao criar evento',
            };
        }
    }
    /**
     * Atualiza um evento existente no Google Calendar
     * @param userId - ID do usuário
     * @param eventId - ID do evento a ser atualizado
     * @param eventData - Novos dados do evento
     */
    async updateCalendarEvent(userId, eventId, eventData) {
        try {
            console.log('🔄 Atualizando evento no Google Calendar...', {
                userId,
                eventId,
            });
            const updateParams = { event_id: eventId };
            if (eventData.summary)
                updateParams.summary = eventData.summary;
            if (eventData.description)
                updateParams.description = eventData.description;
            if (eventData.location)
                updateParams.location = eventData.location;
            if (eventData.startTime && eventData.endTime) {
                const formatDateTime = (date) => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                };
                updateParams.start_datetime = formatDateTime(eventData.startTime);
                updateParams.timezone = eventData.timeZone || 'America/Sao_Paulo';
                const durationMs = eventData.endTime.getTime() - eventData.startTime.getTime();
                const durationMinutes = Math.floor(durationMs / 60000);
                updateParams.event_duration_hour = Math.floor(durationMinutes / 60);
                updateParams.event_duration_minutes = durationMinutes % 60;
            }
            if (eventData.attendees) {
                updateParams.attendees = eventData.attendees;
            }
            updateParams.send_updates = true;
            const response = await this.composio.tools.execute(userId, 'GOOGLECALENDAR_UPDATE_EVENT', updateParams);
            console.log('✅ Evento atualizado com sucesso:', response);
            const data = response?.data || response;
            return {
                success: true,
                eventId: data?.id,
                eventLink: (data?.htmlLink || data?.html_link),
            };
        }
        catch (error) {
            console.error('❌ Erro ao atualizar evento:', error);
            console.error('Detalhes do erro:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data,
                fullError: JSON.stringify(error, null, 2),
            });
            return {
                success: false,
                error: error.message || 'Erro desconhecido ao atualizar evento',
            };
        }
    }
    /**
     * Cancela/deleta um evento do Google Calendar
     * @param userId - ID do usuário
     * @param eventId - ID do evento a ser deletado
     */
    async deleteCalendarEvent(userId, eventId) {
        try {
            console.log('🗑️ Deletando evento do Google Calendar...', {
                userId,
                eventId,
            });
            await this.composio.tools.execute(userId, 'GOOGLECALENDAR_DELETE_EVENT', {
                event_id: eventId,
            });
            console.log('✅ Evento deletado com sucesso');
            return {
                success: true,
            };
        }
        catch (error) {
            console.error('❌ Erro ao deletar evento:', error);
            console.error('Detalhes do erro:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data,
                fullError: JSON.stringify(error, null, 2),
            });
            return {
                success: false,
                error: error.message || 'Erro desconhecido ao deletar evento',
            };
        }
    }
    /**
     * Gera URL de conexão para o usuário autenticar com Google Calendar
     * @param userId - ID único do usuário
     * @returns URL de redirecionamento para autenticação
     */
    async getConnectionUrl(userId) {
        try {
            // Cria sessão para obter URL de autenticação
            const session = await this.composio.create(userId, {
                toolkits: ['googlecalendar'],
            });
            const connectionRequest = await session.authorize('googlecalendar', {
                callbackUrl: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/calendar/callback`,
            });
            return connectionRequest.redirectUrl || '';
        }
        catch (error) {
            console.error('❌ Erro ao gerar URL de conexão:', error);
            throw new Error('Não foi possível gerar URL de autenticação');
        }
    }
    /**
     * Verifica se o usuário tem conexão ativa com Google Calendar
     * @param userId - ID do usuário
     */
    async isConnected(userId) {
        try {
            console.log('🔍 Verificando conexão para userId:', userId);
            const session = await this.composio.create(userId, {
                toolkits: ['googlecalendar'],
            });
            console.log('📦 Session criada, buscando toolkits...');
            const toolkits = await session.toolkits();
            console.log('📋 Toolkits encontrados:', JSON.stringify(toolkits, null, 2));
            // Procura pelo toolkit do Google Calendar usando o slug
            const googleCalendar = toolkits.items.find((toolkit) => toolkit.slug === 'googlecalendar');
            console.log('📅 Google Calendar toolkit:', JSON.stringify(googleCalendar, null, 2));
            console.log('🔗 Connection:', googleCalendar?.connection);
            console.log('✅ isActive:', googleCalendar?.connection?.isActive);
            return googleCalendar?.connection?.isActive || false;
        }
        catch (error) {
            console.error('❌ Erro ao verificar conexão:', error);
            return false;
        }
    }
}
exports.default = new ComposioService();
