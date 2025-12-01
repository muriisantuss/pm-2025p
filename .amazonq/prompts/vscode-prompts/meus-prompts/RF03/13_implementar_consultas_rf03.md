@workspace @backend @frontend @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O sistema já realiza o cadastro de aulas (RF02) com validação. Agora precisamos implementar a Entrega 3 (RF03): Consulta de Horários e Grade Semanal. O objetivo é visualizar a ocupação de forma inteligente.

Tarefa: Implementar o módulo de Consulta/Relatórios em todas as camadas.

### 1. BACKEND (Refinar API)
No `src/controllers/aulaController.js`, garanta que o método `listar` suporte filtros combinados via `req.query`:
- `?laboratorio=ID`
- `?professor=ID`
- `?curso=ID`
- `?dataInicio=YYYY-MM-DD` e `?dataFim=YYYY-MM-DD` (Filtrar intervalo).

*Dica:* Use o operador `$gte` e `$lte` do MongoDB para as datas.

### 2. FRONTEND WEB (Nova Tela: Grade de Horários)
Crie `src/components/Consultas/Consultas.jsx` e registre no Menu.

**Interface:**
1.  **Filtros (Topo):**
    - Select "Visão": (Laboratório | Professor).
    - Select "Selecione": (Carrega lista de Labs ou Profs baseado na escolha anterior).
    - TextField "Data Base": (Date) - Serve para definir a semana a ser visualizada.
    - Botão "Buscar".

2.  **Grade Visual (Grid):**
    - Monte uma tabela onde:
      - **Colunas:** Dias da Semana (Segunda a Sábado).
      - **Linhas:** Blocos de Horário (Manhã 1, Manhã 2... Noite 2).
    - **Célula:** Se houver aula naquele cruzamento (Dia/Bloco), exiba um Card colorido com:
      - Nome da Disciplina
      - Nome do Professor (se a visão for Lab) ou Laboratório (se a visão for Prof).

### 3. MOBILE APP (Nova Tela: Consultas)
Crie `src/components/Consultas/ConsultasScreen.js` e registre no App e Home.

**Interface:**
1.  **Filtros:**
    - Picker "Filtrar por" (Laboratório, Professor).
    - Picker "Item" (Lista carregada da API).
    - Botão "Buscar".

2.  **Lista Agrupada:**
    - Use `ScrollView`.
    - Exiba os resultados agrupados por **Dia da Semana**.
    - Exemplo:
      > **SEGUNDA-FEIRA**
      > [Card] 19:00 - Algoritmos (Lab 1)
      >
      > **TERÇA-FEIRA**
      > [Card] 21:00 - Banco de Dados (Lab 2)

Requisitos Técnicos:
- Backend: `populate` obrigatório para trazer nomes.
- Frontend: Use `Paper` e `Grid` do MUI. Lógica para mapear o array plano de aulas para a matriz da grade.
- Mobile: Use componentes nativos e Paper.