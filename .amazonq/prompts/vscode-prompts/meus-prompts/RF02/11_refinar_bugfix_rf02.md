@workspace @backend @frontend @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O módulo de Aulas (RF02) foi implementado, mas a auditoria de qualidade identificou pontos de melhoria na usabilidade (UX) e robustez dos dados. Precisamos refinar o Backend, Frontend e Mobile.

Tarefa: Aplicar correções de usabilidade e consistência de dados no módulo de Aulas.

1. BACKEND (src/controllers/aulaController.js):
   - **Normalização de Data:** Antes de salvar ou validar conflitos, force a data para o início do dia (00:00:00.000Z) para evitar falsos negativos por diferença de horário.
   - Use `startOfDay` (date-fns ou nativo) tanto no `req.body.data` quanto nas queries de busca.

2. MOBILE (src/components/Aulas/AulasScreen.js):
   - **Teclado:** Envolva o conteúdo do Modal/Dialog em um `KeyboardAvoidingView` (behavior="padding") para que o teclado não cubra os botões de ação.
   - **Visualização:** No Card da lista, exiba o **Nome do Dia da Semana** (ex: "Segunda-feira") ao lado da data. Crie uma função helper `formatarDiaSemana(numero)`.
   - **Máscara de Data:** Se estiver usando TextInput simples para data, garanta que ele insira as barras '/' automaticamente (ex: DD/MM/AAAA) ou valide rigorosamente o formato antes de enviar.

3. FRONTEND (src/components/Aulas/Aulas.jsx):
   - **Sincronia de Data/Dia:** Garanta que, ao alterar o campo Data, o campo "Dia da Semana" seja atualizado automaticamente com o valor correto (0-6). O usuário não deve precisar calcular o dia da semana mentalmente.
   - **Tratamento de Erro no Carregamento:** No `useEffect` que carrega as listas (Cursos, Profs, etc), adicione um `try/catch` específico. Se falhar, mostre um Snackbar: "Erro ao carregar dados de cadastro. Verifique sua conexão." e desabilite o botão "Novo Agendamento".

4. REVISÃO GERAL:
   - Verifique se os campos de "Observações" são opcionais no Backend e no Frontend.
   - Confirme se a mensagem de erro 409 (Conflito) está sendo exibida na íntegra ("Conflito: Professor ocupado...") nos Snackbars de ambas as plataformas.

Gere o código atualizado apenas dos arquivos afetados.