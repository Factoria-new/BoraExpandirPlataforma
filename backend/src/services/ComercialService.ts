import ComposioService, { CalendarEventData } from './ComposioService';

interface AgendamentoData {
  clienteNome: string;
  clienteEmail: string;
  vendedorNome: string;
  vendedorEmail: string;
  dataHora: Date;
  duracao: number; // em minutos
  observacoes?: string;
  entityId: string; // ID do usuário no Composio (vendedor)
}

class ComercialService {
  /**
   * Cria um agendamento e adiciona ao Google Calendar
   */
  async criarAgendamento(dados: AgendamentoData) {
    try {
      console.log('📅 Criando agendamento...', dados);

      // 1. Verifica se o vendedor tem Google Calendar conectado
      const isConnected = await ComposioService.isConnected(dados.entityId);
      
      if (!isConnected) {
        // Gera URL para conectar o Google Calendar
        const connectionUrl = await ComposioService.getConnectionUrl(dados.entityId);
        
        return {
          success: false,
          needsConnection: true,
          connectionUrl,
          message: 'É necessário conectar o Google Calendar primeiro',
        };
      }

      // 2. Calcula horário de término
      const endTime = new Date(dados.dataHora);
      endTime.setMinutes(endTime.getMinutes() + dados.duracao);

      // 3. Prepara dados do evento
      const eventData: CalendarEventData = {
        summary: `Reunião com ${dados.clienteNome}`,
        description: `
Reunião comercial agendada através da plataforma Bora Expandir

Cliente: ${dados.clienteNome}
Email: ${dados.clienteEmail}
Vendedor: ${dados.vendedorNome}

${dados.observacoes ? `Observações:\n${dados.observacoes}` : ''}
        `.trim(),
        startTime: dados.dataHora,
        endTime: endTime,
        attendees: [dados.clienteEmail, dados.vendedorEmail],
        location: 'Google Meet', // Pode ser configurado
        timeZone: 'America/Sao_Paulo',
      };

      // 4. Cria evento no Google Calendar
      const calendarResult = await ComposioService.createCalendarEvent(
        dados.entityId,
        eventData
      );

      if (!calendarResult.success) {
        throw new Error(calendarResult.error || 'Erro ao criar evento no calendário');
      }

      // 5. Aqui você salvaria no banco de dados
      // const agendamento = await AgendamentoRepository.criar({
      //   ...dados,
      //   googleEventId: calendarResult.eventId,
      //   googleEventLink: calendarResult.eventLink,
      // });

      console.log('✅ Agendamento criado com sucesso!');

      return {
        success: true,
        // agendamento,
        googleEventId: calendarResult.eventId,
        googleEventLink: calendarResult.eventLink,
        message: 'Agendamento criado e adicionado ao Google Calendar',
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar agendamento:', error);
      throw new Error(`Falha ao criar agendamento: ${error.message}`);
    }
  }

  /**
   * Atualiza um agendamento existente
   */
  async atualizarAgendamento(
    entityId: string,
    googleEventId: string,
    novosDados: Partial<AgendamentoData>
  ) {
    try {
      const eventData: Partial<CalendarEventData> = {};

      if (novosDados.clienteNome) {
        eventData.summary = `Reunião com ${novosDados.clienteNome}`;
      }

      if (novosDados.dataHora && novosDados.duracao) {
        eventData.startTime = novosDados.dataHora;
        const endTime = new Date(novosDados.dataHora);
        endTime.setMinutes(endTime.getMinutes() + novosDados.duracao);
        eventData.endTime = endTime;
      }

      const result = await ComposioService.updateCalendarEvent(
        entityId,
        googleEventId,
        eventData
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        message: 'Agendamento atualizado com sucesso',
      };
    } catch (error: any) {
      console.error('❌ Erro ao atualizar agendamento:', error);
      throw new Error(`Falha ao atualizar agendamento: ${error.message}`);
    }
  }

  /**
   * Cancela um agendamento
   */
  async cancelarAgendamento(entityId: string, googleEventId: string) {
    try {
      const result = await ComposioService.deleteCalendarEvent(
        entityId,
        googleEventId
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // Aqui você atualizaria o status no banco de dados
      // await AgendamentoRepository.atualizar(agendamentoId, { status: 'cancelado' });

      return {
        success: true,
        message: 'Agendamento cancelado com sucesso',
      };
    } catch (error: any) {
      console.error('❌ Erro ao cancelar agendamento:', error);
      throw new Error(`Falha ao cancelar agendamento: ${error.message}`);
    }
  }
}

export default new ComercialService();
export type { AgendamentoData };
