@workspace @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O aplicativo mobile atual está inconsistente com o Frontend Web. Existem erros de validação (400 Bad Request), campos faltando (Sigla) e a navegação está confusa. Precisamos elevar o nível do Mobile para espelhar exatamente a qualidade e as regras de negócio da Web.

Tarefa: Refatorar COMPLETAMENTE os componentes do Mobile (`src/components/`) e a navegação (`App.js`) para garantir paridade total com a Web.

1. CONFIGURAÇÃO GLOBAL (App.js e Theme):
   - Defina o tema do `react-native-paper` para usar as mesmas cores do Frontend:
     - Primary: '#1976d2' (Azul padrão MUI)
     - Background: '#f5f5f5'
   - Configure o `Stack.Navigator` para exibir o cabeçalho padrão (`headerShown: true`) nas telas internas, garantindo que o botão "Voltar" nativo apareça. Apenas na `HomeScreen` o título pode ser centralizado ou customizado.

2. REFATORAÇÃO DAS TELAS (src/components/):
   Reescreva os arquivos abaixo aplicando validação robusta (campo vermelho se vazio), feedback de erro da API no Snackbar e componentes de UI corretos.

   - `Instituicoes/InstituicoesScreen.js`:
     - **Adicionar campo SIGLA** (Obrigatório, Uppercase). Sem isso o backend recusa.
     - Campos: Nome, Sigla, CNPJ, Email, Telefone, Endereço, Ativo (Switch).

   - `Cursos/CursosScreen.js`:
     - Form:
       - Instituição: Use um `Picker` (Dropdown) carregado da API.
       - Turnos: Use `Chip` selecionáveis ou um `Picker` múltiplo simplificado.
       - Status: Picker ou Switch.

   - `Blocos/BlocosScreen.js` (Correção do Erro 400):
     - **Turno:** Use `Picker` com opções fixas (Manhã, Tarde, Noite).
     - **Dia da Semana:** Use `Picker` com opções (Domingo=0 a Sábado=6). O backend espera NÚMERO.
     - **Ordem:** Input numérico (`keyboardType="numeric"`).
     - **Início/Fim:** Inputs de texto formatados (Ex: "19:00").

   - `Laboratorios/LaboratoriosScreen.js`:
     - Capacidade: Input numérico obrigatório.

   - `Disciplinas/DisciplinasScreen.js` e `Professores/ProfessoresScreen.js`:
     - Padronizar selects e validações conforme telas acima.

3. LÓGICA DE VALIDAÇÃO E FEEDBACK (Padrão "Blindagem"):
   Em TODAS as telas de formulário (Dialog/Modal), implemente:
   - **Loading:** Botão de salvar desabilitado e com `ActivityIndicator` durante o envio.
   - **Tratamento de Erro:** No `catch`, leia `error.response?.data?.message`. Se existir, mostre essa mensagem exata no Snackbar. Caso contrário, mostre erro genérico.
   - **Feedback Visual:** Use a prop `error={!!errors.campo}` nos TextInputs para deixá-los vermelhos se falharem na validação local.

Requisitos Técnicos:
- Utilize `@react-native-picker/picker` para os dropdowns.
- Mantenha a estrutura de pastas atual.
- Garanta que a navegação entre Dashboard -> Listagem -> Edição flua sem travar.