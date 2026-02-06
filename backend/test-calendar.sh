#!/bin/bash

# Script de teste para a API do Google Calendar
# Execute: chmod +x test-calendar.sh && ./test-calendar.sh

BASE_URL="http://localhost:4000/api/calendar"
USER_ID="test_user_$(date +%s)"

echo "🧪 Testando API do Google Calendar"
echo "=================================="
echo ""

# 1. Obter URL de conexão
echo "1️⃣  Obtendo URL de conexão..."
CONNECT_RESPONSE=$(curl -s -X GET "${BASE_URL}/connect?userId=${USER_ID}")
echo "Resposta: $CONNECT_RESPONSE"
echo ""

# Extrair URL de conexão
CONNECTION_URL=$(echo $CONNECT_RESPONSE | grep -o '"connectionUrl":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CONNECTION_URL" ]; then
    echo "✅ URL de conexão obtida com sucesso!"
    echo "🔗 Abra este link no navegador para autorizar:"
    echo "$CONNECTION_URL"
    echo ""
    echo "⏸️  Pressione ENTER após autorizar no navegador..."
    read
else
    echo "❌ Erro ao obter URL de conexão"
    exit 1
fi

# 2. Verificar status da conexão
echo "2️⃣  Verificando status da conexão..."
STATUS_RESPONSE=$(curl -s -X GET "${BASE_URL}/status?userId=${USER_ID}")
echo "Resposta: $STATUS_RESPONSE"
echo ""

# 3. Criar evento de teste
echo "3️⃣  Criando evento de teste..."

# Data de amanhã às 14h
TOMORROW=$(date -d "tomorrow 14:00" -Iseconds)
END_TIME=$(date -d "tomorrow 15:00" -Iseconds)

CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"${USER_ID}\",
    \"summary\": \"Teste de Integração - Calendar API\",
    \"description\": \"Evento criado automaticamente pelo script de teste\",
    \"startTime\": \"${TOMORROW}\",
    \"endTime\": \"${END_TIME}\",
    \"location\": \"Online\",
    \"timeZone\": \"America/Sao_Paulo\"
  }")

echo "Resposta: $CREATE_RESPONSE"
echo ""

# Extrair eventId
EVENT_ID=$(echo $CREATE_RESPONSE | grep -o '"eventId":"[^"]*"' | cut -d'"' -f4)

if [ -n "$EVENT_ID" ]; then
    echo "✅ Evento criado com sucesso!"
    echo "📅 Event ID: $EVENT_ID"
    echo ""
    
    # 4. Atualizar evento
    echo "4️⃣  Atualizando evento..."
    UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/events/${EVENT_ID}" \
      -H "Content-Type: application/json" \
      -d "{
        \"userId\": \"${USER_ID}\",
        \"summary\": \"Teste ATUALIZADO - Calendar API\",
        \"description\": \"Evento atualizado pelo script\"
      }")
    
    echo "Resposta: $UPDATE_RESPONSE"
    echo ""
    
    # 5. Deletar evento
    echo "5️⃣  Deletando evento..."
    DELETE_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/events/${EVENT_ID}?userId=${USER_ID}")
    echo "Resposta: $DELETE_RESPONSE"
    echo ""
    
    echo "✅ Teste completo!"
else
    echo "❌ Erro ao criar evento"
fi

echo ""
echo "=================================="
echo "🎉 Testes finalizados!"
