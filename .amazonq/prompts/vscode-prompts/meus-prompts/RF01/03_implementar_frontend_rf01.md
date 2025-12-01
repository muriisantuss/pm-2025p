@workspace @frontend

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt, incluindo comentários de código e explicações, EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O Backend (RF01) está completo e rodando (http://localhost:3000), com rotas para Cursos, Professores, Laboratórios, Disciplinas e Blocos. O Frontend já possui o CRUD de Instituições (`Instituicoes.jsx`) funcionando perfeitamente.

Tarefa: Implementar as telas (CRUDs) restantes do RF01 no Frontend React, mantendo RIGOROSAMENTE o padrão visual e arquitetural do `Instituicoes.jsx`.

1. ATUALIZAR SERVIÇOS (src/services/api.js):
   - Adicione os novos serviços para conectar com o backend:
     - `cursosService` (endpoints: /cursos)
     - `professoresService` (endpoints: /professores)
     - `laboratoriosService` (endpoints: /laboratorios)
     - `disciplinasService` (endpoints: /disciplinas)
     - `blocosService` (endpoints: /blocos)

2. CRIAR COMPONENTES (src/components/):
   Crie as pastas e arquivos .jsx abaixo. Use `Instituicoes.jsx` como template (mesmos imports do MUI, Paper, Table, Dialog, Snackbar, etc).

   - `Cursos/Cursos.jsx`:
     - Tabela: Nome, Instituição (exibir nome), Turnos, Status.
     - Form: 
       - Nome (TextField)
       - Turnos (Select Múltiplo ou Checkbox: 'Manhã', 'Tarde', 'Noite')
       - Instituição (Select: obrigatório carregar lista via `instituicoesService.listar` no `useEffect`)
       - Status (Select Ativo/Inativo)

   - `Professores/Professores.jsx`:
     - Tabela: Nome, Email, Telefone, Status.
     - Form: Nome, Email, Telefone, Status (Select).

   - `Laboratorios/Laboratorios.jsx`:
     - Tabela: Nome, Capacidade, Localização, Status.
     - Form: Nome, Capacidade (type number), Localização, Status.

   - `Disciplinas/Disciplinas.jsx`:
     - Tabela: Nome, Carga Horária, Curso (nome), Professor (nome).
     - Form: 
       - Nome
       - Carga Horária (number)
       - Curso (Select: via `cursosService.listar`)
       - Professor Responsável (Select: via `professoresService.listar`)
       - Status

   - `Blocos/Blocos.jsx` (Blocos de Horário):
     - Tabela: Turno, Dia, Início, Fim, Ordem.
     - Form: 
       - Turno (Select: Manhã, Tarde, Noite)
       - Dia da Semana (Select: 0-Domingo a 6-Sábado)
       - Início (ex: 19:00)
       - Fim (ex: 20:40)
       - Ordem (number)

3. ATUALIZAR MENU (src/components/Menu/Menu.jsx):
   - Importe todos os novos componentes.
   - Adicione os itens na lista do Drawer para cada entidade.
   - Atualize a função de navegação para abrir o componente correto no Modal principal.

Requisitos de Qualidade:
- **Carregamento de Dados:** Ao abrir um modal de criação (ex: Disciplina), certifique-se de buscar os dados necessários (Cursos e Professores) via API dentro de um `useEffect`.
- **Feedback:** Use o `Snackbar` para mensagens de sucesso/erro.
- **UX:** Mantenha o botão de "Novo" e o filtro de busca em todas as telas.