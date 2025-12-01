@workspace @backend @frontend

## INSTRUÇÃO OBRIGATÓRIA:
Responda EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O filtro de "Visão Diária" (1 dia) na tela de Consultas não está trazendo resultados, mesmo havendo aulas cadastradas naquele dia. Isso é um erro crítico de comparação de datas (Timezone/UTC) no MongoDB.

Tarefa: Reescrever a lógica de filtro de data no Backend para garantir que o dia inteiro (00:00 a 23:59:59) seja coberto, independente do fuso horário, e garantir que o Frontend envie o formato correto.

---

### 1. BACKEND (src/controllers/aulaController.js)
Reescreva a lógica de construção do filtro `data` dentro do método `listar`.

**Nova Lógica Obrigatória (Intervalo Absoluto):**
Ao receber `dataInicio` e `dataFim` (strings YYYY-MM-DD):
1. Não use `new Date(req.query.dataInicio)` diretamente, pois isso pode gerar desvios de timezone.
2. Crie o objeto de data forçando o **início do dia (00:00:00.000)** e **fim do dia (23:59:59.999)**.
3. Se `dataInicio` e `dataFim` forem iguais (filtro de 1 dia), o intervalo deve cobrir o dia inteiro.

Exemplo de implementação robusta:
```javascript
const { dataInicio, dataFim } = req.query;

if (dataInicio || dataFim) {
  const filtroData = {};
  
  // Pega o início do dia da data inicial (ou data atual se vazia)
  if (dataInicio) {
    const start = new Date(dataInicio);
    start.setUTCHours(0, 0, 0, 0); 
    filtroData.$gte = start;
  }

  // Pega o final do dia da data final (ou usa a inicial se for filtro de 1 dia)
  if (dataFim) {
    const end = new Date(dataFim);
    end.setUTCHours(23, 59, 59, 999);
    filtroData.$lte = end;
  } else if (dataInicio) {
    // Se mandou só dataInicio (visão diária), o fim é o final do MESMO dia
    const end = new Date(dataInicio);
    end.setUTCHours(23, 59, 59, 999);
    filtroData.$lte = end;
  }

  filter.data = filtroData;
}