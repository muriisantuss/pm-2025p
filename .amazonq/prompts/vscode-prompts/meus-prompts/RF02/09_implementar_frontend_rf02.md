@workspace @frontend

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt, incluindo comentários de código, EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O Backend para o RF02 (Aulas) está pronto e valida conflitos de horário (retornando erro 409). Precisamos criar a interface para gerenciar essas alocações.

Tarefa: Implementar o módulo de "Aulas" (Agendamento) no Frontend React.

1. ATUALIZAR SERVIÇOS (src/services/api.js):
   - Adicione `aulasService` com os métodos padrão (listar, criar, atualizar, remover).
   - Endpoint base: `/aulas`

2. CRIAR COMPONENTE (src/components/Aulas/Aulas.jsx):
   Use o padrão visual do `Instituicoes.jsx` (Table + Dialog + Snackbar), mas adapte para a complexidade deste formulário.

   **Lógica de Carregamento (useEffect):**
   - Ao abrir o componente ou o modal, você precisará carregar TODAS as listas auxiliares para preencher os Selects:
     - Cursos, Professores, Disciplinas, Laboratórios e Blocos.
     - Use `Promise.all` para buscar tudo de uma vez ou efeitos separados.

   **Campos do Formulário (Dialog):**
   - **Semestre:** TextField (ex: "2025-2").
   - **Data:** TextField (type="date") ou DatePicker.
   - **Dia da Semana:** Select (0-Domingo a 6-Sábado).
   - **Bloco (Horário):** Select (Exibir: `${bloco.inicio} - ${bloco.fim} (${bloco.turno})`).
   - **Laboratório:** Select (Exibir nome e capacidade).
   - **Curso:** Select.
   - **Disciplina:** Select.
   - **Professor:** Select.
   - **Observações:** TextField (multiline).

   **Grid de Listagem:**
   - Colunas: Data, Dia, Horário (Bloco), Laboratório, Disciplina, Professor.
   - Ordenação padrão: Por Data.

3. TRATAMENTO DE ERROS (UX):
   - **Crucial:** Se a API retornar erro 409 (Conflito), o Snackbar deve exibir Exatamente a mensagem que veio do backend (ex: "Conflito: Laboratório ocupado").
   - Destaque visualmente que houve um erro de agendamento.

4. ATUALIZAR MENU:
   - Adicione "Agendamento de Aulas" no `src/components/Menu/Menu.jsx`.

Requisitos de Qualidade:
- Mantenha a consistência com Material UI.
- Garanta que os IDs corretos (`_id`) sejam enviados no JSON para o backend.
- Formate a data visualmente na tabela (DD/MM/AAAA).