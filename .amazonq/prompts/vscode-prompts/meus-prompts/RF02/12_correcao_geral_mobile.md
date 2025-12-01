@workspace @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O Frontend Web está finalizado e aprovado. O Mobile, no entanto, está com falhas críticas de usabilidade e implementação incompleta. A função de EXCLUSÃO (Delete) não funciona em NENHUMA tela, e a tela inicial (Dashboard) está quebrada (sem scroll e faltando menu).

Tarefa: Realizar uma varredura completa no projeto Mobile para corrigir a funcionalidade de exclusão e arrumar a tela inicial.

1. IMPLEMENTAÇÃO UNIVERSAL DE EXCLUSÃO (DELETE):
   - Vá em **TODAS** as telas de listagem da pasta `src/components/` (`InstituicoesScreen.js`, `CursosScreen.js`, `ProfessoresScreen.js`, `DisciplinasScreen.js`, `LaboratoriosScreen.js`, `BlocosScreen.js` e a nova `AulasScreen.js`).
   - Localize o botão ou ícone de exclusão nos Cards da lista.
   - Implemente (ou corrija) a função `handleDelete(id)` seguindo RIGOROSAMENTE este fluxo:
     1. Exibir `Alert.alert` nativo: Título "Excluir", Mensagem "Tem certeza?", Botões "Cancelar" e "Confirmar".
     2. No `onPress` do "Confirmar", chamar o serviço de delete da API (ex: `api.delete(...)`).
     3. Usar `try/catch`.
     4. No `try` (sucesso): Exibir Snackbar "Excluído com sucesso" E chamar a função de recarregar a lista (ex: `carregarDados()`) para atualizar a tela imediatamente.
     5. No `catch` (erro): Exibir Snackbar com a mensagem de erro da API.

2. CORREÇÃO DA TELA INICIAL (HomeScreen.js):
   - Envolva todo o conteúdo principal (onde estão os botões/cards de navegação) em um `ScrollView`. Isso é obrigatório para garantir acesso a todos os itens em telas pequenas.
   - Adicione um novo botão/card para navegar para a rota "Aulas" (Agendamento), que foi implementada recentemente mas não está no menu.

3. REVISÃO DE NAVEGAÇÃO (App.js):
   - Certifique-se de que a `AulasScreen` está registrada corretamente no `Stack.Navigator`.

Gere o código corrigido para `HomeScreen.js` e um exemplo de uma tela de listagem (ex: `CursosScreen.js`) mostrando a implementação correta do delete.