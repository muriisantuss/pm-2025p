@workspace @backend @frontend @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: Estamos no dia da entrega do RF01. Identificamos bugs críticos de inconsistência entre as plataformas e falhas de lógica CRUD. O Backend usa o campo `ativo` (Boolean), mas os requisitos mencionam `status`. O Mobile não está deletando nada e falha ao criar relacionamentos (ex: Disciplina vinculada a Professor).

Tarefa: Realizar uma revisão de código e refatoração "Cirúrgica" em todo o projeto para corrigir os seguintes bugs:

1. CORREÇÃO DO PROBLEMA DE "STATUS" (Web e Mobile):
   - **Sintoma:** O usuário seleciona "Ativo", mas o registro salva/permanece "Inativo".
   - **Causa Provável:** O Frontend/Mobile está enviando string "true"/"false" ou o campo errado, e o Backend espera Boolean no campo `ativo`.
   - **Ação no Backend:** Verifique se os Controllers estão sanitizando esse campo.
   - **Ação no Frontend/Mobile:** Garanta que os Switches/Selects enviem `true` ou `false` (booleano puro) para o campo `ativo`. Se o form usa `status`, converta para `ativo` antes de enviar.

2. CORREÇÃO DA EXCLUSÃO NO MOBILE:
   - **Sintoma:** O botão de excluir não faz nada ou não remove o item.
   - **Ação:** Reescreva a função `remover...` em TODAS as telas (`*Screen.js`).
   - Certifique-se de que o `Alert.alert` chama a API corretamente dentro do `onPress` e, **CRUCIAL**: recarregue a lista (`carregarDados()`) após a exclusão bem-sucedida.

3. CORREÇÃO DE RELACIONAMENTOS (Disciplinas/Professores):
   - **Sintoma:** Update/Create de Disciplinas falha ou não salva o Professor/Curso.
   - **Ação:** Verifique no Mobile (`DisciplinasScreen.js` e `CursosScreen.js`) se os `Picker` (Dropdowns) estão salvando o `_id` (value) e não o nome (label) no state do formulário.

4. REVISÃO GERAL DE CONSISTÊNCIA:
   - Verifique se o Backend realmente implementou `sigla` em Instituição.
   - Verifique se o Mobile está usando as mesmas cores do Web (`#1976d2`).
   - Garanta que mensagens de erro 400/409/500 sejam exibidas no Snackbar do Mobile.

Gere o código corrigido para:
1. `projeto/backend/src/controllers/genericController.js` (ou ajuste os controllers existentes se não houver genérico).
2. `projeto/frontend/src/components/Instituicoes/Instituicoes.jsx` (Exemplo de correção do Status).
3. `projeto/mobile/src/components/Disciplinas/DisciplinasScreen.js` (Exemplo de correção de Picker e Delete).
4. `projeto/mobile/src/components/Professores/ProfessoresScreen.js` (Correção do Delete).
5. `projeto/mobile/src/services/api.js` (Se houver erro de rota).

Nota: Aplique as correções de lógica de Delete e Status para TODAS as entidades, não apenas as listadas acima.