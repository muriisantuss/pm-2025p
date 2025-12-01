@workspace @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt, incluindo comentários de código, EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O Backend (RF01) está pronto e o Frontend Web já foi finalizado. O Mobile (React Native + Paper) possui apenas a tela `InstituicoesScreen.js` funcionando. Precisamos finalizar o RF01 no app.

Tarefa: Implementar as telas restantes do RF01 no Mobile App, espelhando a funcionalidade da Web.

1. ATUALIZAR SERVIÇOS (src/services/api.js):
   - Certifique-se que o `api.js` do mobile exporta os serviços para:
     - cursosService, professoresService, laboratoriosService, disciplinasService, blocosService.
     - (Nota: Os endpoints são os mesmos da web: /cursos, /professores, etc).

2. CRIAR TELAS (src/components/):
   Crie uma pasta para cada entidade e o arquivo da tela (ex: `Cursos/CursosScreen.js`).
   
   ⚠️ IMPORTANTE: Use `InstituicoesScreen.js` como modelo base (Card para listar, FAB para adicionar, Portal/Dialog para formulário, Snackbar para avisos).

   Específicos de cada tela:
   
   - `CursosScreen.js`:
     - Lista: Mostre Nome e Instituição.
     - Form: Nome, Turnos (texto simples ou chips), Instituição (Carregue a lista via API para um Picker/Select).
   
   - `ProfessoresScreen.js`:
     - Lista: Nome, Email.
     - Form: Nome, Email, Telefone, Status (Switch).

   - `LaboratoriosScreen.js`:
     - Lista: Nome, Capacidade.
     - Form: Nome, Capacidade (keyboardType="numeric"), Localização.

   - `DisciplinasScreen.js`:
     - Lista: Nome, Carga Horária.
     - Form: Nome, Carga Horária, Curso (Picker/Select), Professor (Picker/Select).

   - `BlocosScreen.js`:
     - Lista: Turno, Dia, Horário.
     - Form: Turno, Dia, Início, Fim, Ordem.

3. ATUALIZAR NAVEGAÇÃO (App.js):
   - Importe as novas telas.
   - Adicione-as no `Stack.Navigator`.
   - Crie uma **Tela de Dashboard (HomeScreen)** simples e elegante que contenha botões (Cards ou List.Item) para navegar para cada um desses CRUDs.
   - Defina a `HomeScreen` como a rota inicial do app.

Requisitos de Qualidade:
- Mantenha o visual Material Design (React Native Paper).
- Trate erros de API exibindo Snackbar com a mensagem vinda do backend.
- Adicione "loading" (ActivityIndicator) durante as requisições.