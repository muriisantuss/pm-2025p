@workspace @frontend

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: Estamos finalizando o Frontend React (Material UI). Os formulários de CRUD (Instituições, Cursos, etc.) já existem, mas precisamos garantir que a validação e o tratamento de erros sejam robustos, visíveis e à prova de falhas. O usuário nunca deve ficar sem saber o que aconteceu.

Tarefa: Refatorar e aprimorar a lógica de validação e feedback em TODOS os componentes de formulário (`Instituicoes.jsx`, `Cursos.jsx`, `Professores.jsx`, `Laboratorios.jsx`, `Disciplinas.jsx`, `Blocos.jsx`).

Implemente as seguintes camadas de proteção e feedback visual:

1. VALIDAÇÃO VISUAL NOS CAMPOS (MUI):
   - Utilize as props `error` e `helperText` do TextField/Select do Material UI.
   - Se um campo obrigatório estiver vazio ao tentar salvar, ele deve ficar VERMELHO e exibir "Campo obrigatório" logo abaixo dele.
   - Para campos específicos (Email, CNPJ), valide o formato no frontend antes de enviar. Se inválido, mostre erro imediato no campo.

2. MAPEAMENTO DE ERROS DA API (Server-side Feedback):
   - O Backend retorna erros 400/409 com mensagens específicas (ex: "CNPJ já cadastrado", "Email inválido").
   - Capture o `error.response.data.message` no `catch` das requisições.
   - Exiba essa mensagem específica no `Snackbar` (barra de aviso) com cor de erro (`severity="error"`).
   - NÃO mostre mensagens genéricas como "Erro ao salvar" se a API tiver retornado um motivo específico.

3. ESTADOS DE CARREGAMENTO (Loading States):
   - Durante a requisição (Promise pendente):
     - O botão de "Salvar/Criar" deve ficar DESABILITADO (disabled).
     - O texto do botão deve mudar para "Salvando..." ou exibir um `CircularProgress` pequeno dentro dele.
     - Isso impede cliques duplos e duplicidade de dados.

4. MÁSCARAS E FORMATAÇÃO VISUAL:
   - Implemente formatação automática para campos numéricos e de texto fixo:
     - **CNPJ:** Formatar como XX.XXX.XXX/XXXX-XX
     - **Telefone:** Formatar como (XX) XXXXX-XXXX
   - Use o evento `onChange` para aplicar a máscara enquanto o usuário digita.

5. TRATAMENTO DE ERROS DE CONEXÃO:
   - Se o backend estiver offline (Network Error), exiba um Snackbar claro: "Sem conexão com o servidor. Verifique sua internet ou tente novamente mais tarde."

Aplique essas melhorias em todos os arquivos `.jsx` da pasta `src/components/`. Mantenha o código limpo e modular.