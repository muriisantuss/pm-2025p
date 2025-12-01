@workspace @frontend @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: Estamos implementando a tela de Consultas (RF03). A abordagem inicial de "escolher uma data específica" ficou confusa. O usuário precisa de uma navegação mais intuitiva, similar a um calendário (Google Calendar), podendo alternar entre visão Mensal, Semanal e Diária.

Tarefa: Refatorar a UX das telas de Consulta para suportar navegação por períodos dinâmicos.

---

### 1. LÓGICA DE DATAS (Frontend e Mobile)
Implemente funções auxiliares (use `date-fns` se disponível ou `Date` nativo) para calcular automaticamente os intervalos `dataInicio` e `dataFim` baseados em um "Pivô" (data atual):
- **Modo Mês:** Do dia 1 ao último dia do mês atual.
- **Modo Semana:** De Segunda a Sábado da semana atual.
- **Modo Dia:** O dia selecionado (00:00 às 23:59).

### 2. FRONTEND WEB (Consultas.jsx)
Refatore a barra de filtros para incluir:

**A. Controles de Navegação:**
- **Seletor de Modo:** Botões ou Tabs [ Mês | Semana | Dia ].
- **Navegação:** Botão `<` (Anterior), Texto Central (Ex: "Dezembro 2025" ou "01/12 - 07/12"), Botão `>` (Próximo).
  - *Ao clicar nas setas, incremente ou decremente o período baseado no modo selecionado.*
- **Filtro de Recurso:** Mantenha os Selects de Laboratório/Professor.

**B. Visualização Adaptativa:**
- **Se Modo = Mês:** Exiba um Grid de Calendário simplificado (apenas contagem de aulas ou lista resumida).
- **Se Modo = Semana:** Exiba a Grade Horária (Matriz Dias x Blocos) que já planejamos.
- **Se Modo = Dia:** Exiba uma lista detalhada dos blocos daquele dia específico.

### 3. MOBILE APP (ConsultasScreen.js)
Refatore para focar na usabilidade móvel:

**A. Cabeçalho de Navegação:**
- Adicione uma barra superior com: `<` [Texto do Período] `>`.
- Um botão de "Filtro" para abrir o Modal de seleção de Laboratório/Professor (para limpar a tela).

**B. Listagem Inteligente:**
- Use `SectionList`.
- Se o usuário navegar para "Próxima Semana", recarregue a lista automaticamente.
- Agrupe sempre por Dia.

---

### Requisitos de Qualidade:
- **Feedback:** Enquanto o usuário troca de semana/mês, mostre um `LinearProgress` (Web) ou `ActivityIndicator` (Mobile).
- **API:** Garanta que os parâmetros `dataInicio` e `dataFim` sejam enviados corretamente no formato ISO para o backend filtrar.
- **UX:** O botão "Hoje" deve estar disponível para voltar rapidamente para a data atual.