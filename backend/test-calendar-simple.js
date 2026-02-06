// Script de teste rápido para a API do Google Calendar
// Execute: node test-calendar-simple.js

const BASE_URL = 'http://localhost:4000/api/calendar';
// Use um userId FIXO para que a conexão OAuth persista entre execuções
const USER_ID = 'meu_usuario_teste';

async function testCalendar() {
  console.log('🧪 Testando API do Google Calendar');
  console.log('==================================\n');

  try {
    // 1. Obter URL de conexão
    console.log('1️⃣  Obtendo URL de conexão...');
    const connectRes = await fetch(`${BASE_URL}/connect?userId=${USER_ID}`);
    const connectData = await connectRes.json();
    console.log('Resposta:', JSON.stringify(connectData, null, 2));
    
    if (connectData.connectionUrl) {
      console.log('\n✅ URL de conexão obtida!');
      console.log('🔗 Abra este link no navegador:');
      console.log(connectData.connectionUrl);
      console.log('\n⏸️  Aguarde 10 segundos para você autorizar...\n');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }

    // 2. Verificar status
    console.log('2️⃣  Verificando status da conexão...');
    const statusRes = await fetch(`${BASE_URL}/status?userId=${USER_ID}`);
    const statusData = await statusRes.json();
    console.log('Resposta:', JSON.stringify(statusData, null, 2));
    console.log('');

    // 3. Criar evento
    console.log('3️⃣  Criando evento de teste...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    
    const endTime = new Date(tomorrow);
    endTime.setHours(15, 0, 0, 0);

    const eventData = {
      userId: USER_ID,
      summary: 'Teste de Integração - Calendar API',
      description: 'Evento criado pelo script de teste Node.js',
      startTime: tomorrow.toISOString(),
      endTime: endTime.toISOString(),
      location: 'Online',
      timeZone: 'America/Sao_Paulo'
    };

    console.log('Enviando dados do evento:', JSON.stringify(eventData, null, 2));

    const createRes = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    console.log(`Status da resposta: ${createRes.status} ${createRes.statusText}`);
    const createData = await createRes.json();
    console.log('Corpo da resposta:', JSON.stringify(createData, null, 2));
    console.log('');

    if (createRes.ok && createData.eventId) {
      console.log('✅ Evento criado com sucesso!');
      console.log(`📅 Event ID: ${createData.eventId}\n`);

      // 4. Atualizar evento
      console.log('4️⃣  Atualizando evento...');
      const updateData = {
        userId: USER_ID,
        summary: 'Teste ATUALIZADO - Calendar API',
        description: 'Evento atualizado pelo script'
      };
      
      console.log('Enviando atualização:', JSON.stringify(updateData, null, 2));

      const updateRes = await fetch(`${BASE_URL}/events/${createData.eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      console.log(`Status da resposta: ${updateRes.status} ${updateRes.statusText}`);
      const updateResult = await updateRes.json();
      console.log('Corpo da resposta:', JSON.stringify(updateResult, null, 2));
      console.log('');

      // 5. Deletar evento
      console.log('5️⃣  Deletando evento...');
      console.log(`Deletando evento ${createData.eventId} para usuário ${USER_ID}`);
      const deleteRes = await fetch(`${BASE_URL}/events/${createData.eventId}?userId=${USER_ID}`, {
        method: 'DELETE'
      });

      console.log(`Status da resposta: ${deleteRes.status} ${deleteRes.statusText}`);
      const deleteData = await deleteRes.json();
      console.log('Corpo da resposta:', JSON.stringify(deleteData, null, 2));
      console.log('');

      console.log('✅ Teste completo!');
    } else {
      console.log('❌ Erro ao criar evento. Verifique se o usuário já autorizou a conexão no link acima.');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }

  console.log('\n==================================');
  console.log('🎉 Testes finalizados!');
}

testCalendar();
