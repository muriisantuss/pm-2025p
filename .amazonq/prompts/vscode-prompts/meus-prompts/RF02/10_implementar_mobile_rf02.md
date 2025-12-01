@workspace @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt, incluindo comentários de código, EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O Backend (RF02) está pronto com validação de conflitos. O Frontend Web já tem a tela de Aulas. Agora precisamos implementar o módulo de "Aulas" no App Mobile.

Tarefa: Implementar a tela de Agendamento de Aulas no React Native.

1. ATUALIZAR SERVIÇOS (src/services/api.js):
   - Adicione `aulasService` (endpoints: /aulas) no arquivo de serviços do mobile.

2. CRIAR TELA (src/components/Aulas/AulasScreen.js):
   Use o padrão `InstituicoesScreen.js` (Card, FAB, Dialog, Snackbar), mas com atenção especial aos seletores.

   **Carregamento de Dados:**
   - Ao montar a tela (`useEffect`), carregue as listas de: Cursos, Professores, Disciplinas, Laboratórios e Blocos.
   - Armazene em estados locais (`cursos`, `professores`, etc) para popular os Pickers.

   **Formulário (Dialog/Modal):**
   - Devido à quantidade de campos, use um `ScrollView` dentro do Dialog.
   - Campos:
     - **Semestre:** TextInput.
     - **Data:** TextInput (com máscara ou placeholder 'AAAA-MM-DD').
     - **Dia da Semana:** Picker (Domingo a Sábado).
     - **Bloco:** Picker (Mostre o horário no label, ex: "19:00 - 20:40").
     - **Laboratório:** Picker.
     - **Curso:** Picker.
     - **Disciplina:** Picker.
     - **Professor:** Picker.
     - **Observações:** TextInput (multiline).

   **Lista (Cards):**
   - Exiba nos cards: Data, Horário, Laboratório e Disciplina.

3. TRATAMENTO DE ERROS (UX Crítico):
   - Se o backend retornar **409 (Conflito)**, o Snackbar DEVE mostrar a mensagem exata do erro (ex: "Conflito: Professor ocupado").
   - Isso é um critério de aceite obrigatório.

4. NAVEGAÇÃO:
   - Adicione a rota "Aulas" no `App.js`.
   - Adicione o botão para "Aulas" na `HomeScreen`.

Requisitos de Qualidade:
- Use `@react-native-picker/picker` para os dropdowns.
- Mantenha o visual consistente com o restante do app (React Native Paper).