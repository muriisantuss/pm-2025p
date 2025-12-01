# PM2025-2 Trabalho Final

## Descrição
Sistema de gerenciamento de laboratórios desenvolvido como trabalho final da disciplina PM2025-2.

## Estrutura do Projeto

### Pastas Criadas
- `projeto/` - Pasta principal do projeto
- `projeto/backend/` - Código do backend
- `projeto/frontend/` - Código do frontend web
- `projeto/mobile/` - Código da aplicação mobile
- `infraestrutura/` - Arquivos de infraestrutura e deploy

### Documentação
- `Documents/Horarios_Laboratórios.pdf` - Horários dos laboratórios
- `Documents/Requisitos_Sistema_Labs.pdf` - Requisitos do sistema

## Infraestrutura

### Serviços Docker
Configurados no arquivo `infraestrutura/docker-compose.yml`:

#### MongoDB
- **Serviço**: `pm2025-2-trabalho-final-mongo`
- **Usuário**: `pm2025-2-mongo-admin`
- **Senha**: `pm2025-2-mongo-secret`
- **Banco**: `pm2025-2-mongodb`
- **Porta**: `27017`

#### Portainer
- **Serviço**: `pm2025-2-trabalho-final-portainer`
- **Porta**: `9000`
- **Função**: Gerenciamento de containers Docker

#### Network
- **Nome**: `pm2025-2-network`
- **Driver**: bridge
- **Função**: Comunicação entre containers

## Como Executar

### Iniciar Infraestrutura
```bash
cd infraestrutura
docker-compose up -d
```

### Executar Backend
```bash
cd projeto/backend
npm install
npm run dev
```

**Nota:** O backend executa automaticamente o seeding de dados de teste na primeira inicialização se o banco estiver vazio.

### Executar Frontend
```bash
cd projeto/frontend
npm install
npm run dev
```

### Executar Mobile
```bash
cd projeto/mobile
npm install
npm start
```

### Acessar Serviços
- **Frontend Web**: `http://localhost:5173`
- **Mobile App**: Expo Development Server
- **API Backend**: `http://localhost:3000`
- **Documentação API**: `http://localhost:3000/api-docs`
- **MongoDB**: `localhost:27017`
- **Portainer**: `http://localhost:9000`

## Endpoints da API

### Instituições
- `POST /api/v1/instituicoes` - Criar instituição
- `GET /api/v1/instituicoes` - Listar instituições (com filtros)
- `PUT /api/v1/instituicoes/:id` - Atualizar instituição
- `DELETE /api/v1/instituicoes/:id` - Remover instituição

### Cursos
- `POST /api/v1/cursos` - Criar curso
- `GET /api/v1/cursos` - Listar cursos
- `PUT /api/v1/cursos/:id` - Atualizar curso
- `DELETE /api/v1/cursos/:id` - Remover curso

### Professores
- `POST /api/v1/professores` - Criar professor
- `GET /api/v1/professores` - Listar professores
- `PUT /api/v1/professores/:id` - Atualizar professor
- `DELETE /api/v1/professores/:id` - Remover professor

### Laboratórios
- `POST /api/v1/laboratorios` - Criar laboratório
- `GET /api/v1/laboratorios` - Listar laboratórios
- `PUT /api/v1/laboratorios/:id` - Atualizar laboratório
- `DELETE /api/v1/laboratorios/:id` - Remover laboratório

### Disciplinas
- `POST /api/v1/disciplinas` - Criar disciplina
- `GET /api/v1/disciplinas` - Listar disciplinas
- `PUT /api/v1/disciplinas/:id` - Atualizar disciplina
- `DELETE /api/v1/disciplinas/:id` - Remover disciplina

### Blocos de Horário
- `POST /api/v1/blocos` - Criar bloco
- `GET /api/v1/blocos` - Listar blocos
- `PUT /api/v1/blocos/:id` - Atualizar bloco
- `DELETE /api/v1/blocos/:id` - Remover bloco

### Aulas (Alocação de Horários)
- `POST /api/v1/aulas` - Criar aula (com validação de conflitos)
- `GET /api/v1/aulas` - Listar aulas (com filtros por data, laboratório, professor)
- `PUT /api/v1/aulas/:id` - Atualizar aula (com validação de conflitos)
- `DELETE /api/v1/aulas/:id` - Remover aula

### Desenvolvimento
- `POST /api/v1/reset-dados` - Reset e repopula o banco (apenas desenvolvimento)

#### Parâmetros de Consulta
- `?ativo=true|false` - Filtrar por status (onde aplicável)
- `?nome=texto` - Filtrar por nome (contém)
- `?data=YYYY-MM-DD` - Filtrar por data (aulas)
- `?dataInicio=YYYY-MM-DD` - Filtrar por data inicial (aulas)
- `?dataFim=YYYY-MM-DD` - Filtrar por data final (aulas)
- `?laboratorio=id` - Filtrar por laboratório (aulas)
- `?professor=id` - Filtrar por professor (aulas)
- `?curso=id` - Filtrar por curso (aulas)
- `?page=1&limit=20` - Paginação

## Funcionalidades Implementadas

✅ **Estrutura de Projeto**
- Organização em pastas (backend, frontend, mobile)
- Separação de infraestrutura

✅ **Infraestrutura Docker**
- Serviço MongoDB configurado
- Serviço Portainer para gerenciamento
- Network dedicada para comunicação
- Volumes persistentes para dados

✅ **Backend - API REST**
- Projeto Node.js com Express e Mongoose
- Modelo de dados para Instituições
- CRUD completo para instituições (/api/v1/instituicoes)
- Validação de dados e tratamento de erros
- Suporte a HTTPS configurável
- Documentação Swagger em /api-docs
- Middleware de segurança (Helmet, CORS)
- Logging com Morgan
- Paginação e filtros nas consultas

✅ **Frontend Web - React**
- Projeto React com Vite e Material-UI
- Layout responsivo com cabeçalho, área de trabalho e rodapé
- Menu lateral (drawer) com navegação
- Componente de Instituições com CRUD completo
- Grid de dados com ordenação e filtros
- Modais para edição e criação
- Integração com API do backend
- Design responsivo para mobile e desktop
- **Módulo de Aulas (RF02)**: Interface completa para agendamento com:
  - Formulário com todos os campos obrigatórios (semestre, data, horário, etc.)
  - Selects populados automaticamente com dados das entidades relacionadas
  - Validação de conflitos com mensagens claras do backend
  - Grid com formatação de data em português (DD/MM/AAAA)
  - Tratamento específico para erros 409 (conflitos de horário)

✅ **Mobile App - React Native**
- Projeto React Native com Expo
- Interface Material Design com React Native Paper
- Tela de Dashboard com navegação para todos os CRUDs
- CRUD completo para todas as entidades do RF01:
  - Instituições (nome, CNPJ, email, telefone, endereço, status)
  - Cursos (nome, turnos, instituição)
  - Professores (nome, email, telefone, status)
  - Laboratórios (nome, capacidade, localização)
  - Disciplinas (nome, carga horária, curso, professor)
  - Blocos de Horário (turno, dia, início, fim, ordem)
- Cards responsivos para listagem
- Formulários modais para criação/edição
- Filtros em tempo real com Searchbar
- Navegação com React Navigation e botão voltar
- Integração com API do backend para todas as entidades
- Mensagens de feedback em português com Snackbar
- Confirmações nativas para exclusões
- Loading indicators durante requisições
- Pickers para seleção de entidades relacionadas
- Validação de campos numéricos
- **Módulo de Aulas (RF02)**: Tela completa para agendamento com:
  - Formulário com todos os campos obrigatórios usando Pickers nativos
  - Carregamento automático de listas auxiliares via Promise.all
  - Tratamento específico para conflitos de horário (erro 409)
  - Cards com informações essenciais (data, horário, laboratório, disciplina)
  - Integração total com API do backend

✅ **Backend - Módulo de Aulas (RF02)**
- Modelo Aula com relacionamentos para todas as entidades
- Validação rigorosa de conflitos de horário:
  - Conflito de laboratório: impede alocação dupla do mesmo lab no mesmo horário
  - Conflito de professor: impede que professor dê aula em dois locais simultaneamente
- CRUD completo para aulas (/api/v1/aulas)
- Filtros específicos por data, laboratório e professor
- Documentação Swagger completa
- Índices otimizados para consultas de conflito
- Mensagens de erro claras em português

✅ **Frontend - Módulo de Aulas (RF02)**
- Interface completa para agendamento de aulas
- Formulário com validação de todos os campos obrigatórios
- Carregamento automático de listas auxiliares (cursos, professores, etc.)
- Tratamento específico para conflitos de horário (erro 409)
- Grid com formatação adequada e filtros em tempo real
- Integração total com API do backend

✅ **Backend - Módulo de Consultas (RF03)**
- API refinada com filtros combinados para consultas avançadas:
  - Filtro por laboratório, professor e curso
  - Filtro por intervalo de datas (dataInicio e dataFim)
  - Suporte a consultas de grade semanal
- Operadores MongoDB ($gte, $lte) para consultas de intervalo
- Populate obrigatório para trazer nomes das entidades relacionadas
- Ordenação por data e ordem do bloco para visualização cronológica

✅ **Frontend - Módulo de Consultas (RF03)**
- **Navegação por Períodos Dinâmicos**: Sistema similar ao Google Calendar
  - Tabs para alternar entre Mês, Semana e Dia
  - Navegação com setas (anterior/próximo) baseada no modo selecionado
  - Botão "Hoje" para voltar rapidamente à data atual
  - Títulos dinâmicos (ex: "Dezembro 2025", "01/12 - 07/12")
- **Visualização Adaptativa**:
  - **Modo Mês**: Grid de cards com resumo das aulas
  - **Modo Semana**: Grade tabular completa (Dias × Blocos)
  - **Modo Dia**: Lista detalhada dos horários do dia selecionado
- **Filtros Inteligentes**:
  - Select "Tipo de Recurso" (Laboratório ou Professor)
  - Select dinâmico para escolha do item específico
  - Busca automática ao alterar período ou filtros
- **Grade de Horários Aprimorada**:
  - Células coloridas por disciplina (Algoritmos, Banco de Dados, etc.)
  - Cards com informações secundárias (professor/laboratório)
  - Células vazias com indicador visual "-"
  - Contador de aulas encontradas
- **UX Melhorada**:
  - LinearProgress durante carregamento
  - Mensagens informativas para estados vazios
  - Interface responsiva com Material-UI e date-fns

✅ **Mobile - Módulo de Consultas (RF03)**
- **Navegação Semanal Intuitiva**:
  - Cabeçalho com navegação por setas (semana anterior/próxima)
  - Título dinâmico mostrando intervalo da semana (DD/MM - DD/MM)
  - Botão "Hoje" para retornar à semana atual
  - Busca automática ao navegar entre semanas
- **Modal de Filtros Otimizado**:
  - Ícone de filtro no AppBar para economizar espaço
  - Modal com RadioButtons para seleção de tipo (Lab/Prof)
  - Picker dinâmico baseado na seleção
  - Chip indicativo do filtro ativo no cabeçalho
- **SectionList Aprimorada**:
  - Seções por dia da semana com datas formatadas (SEGUNDA-FEIRA - DD/MM)
  - Cards redesenhados com horário em destaque
  - Informações hierárquicas (horário → disciplina → professor/lab)
  - Cores consistentes com tema Material Design
- **Estados de Interface**:
  - Tela de boas-vindas quando não há filtros configurados
  - ListEmptyComponent com ícone e mensagem amigável
  - ActivityIndicator durante navegação entre períodos
  - Snackbar para feedback de ações
- **Performance Otimizada**:
  - Carregamento automático ao alterar filtros ou período
  - SectionList para listas grandes
  - Integração completa com API do backend

✅ **Sistema de Seeding Automático**
- Serviço `SeederService` para população automática do banco
- Execução automática na inicialização se banco vazio
- Dados de teste completos:
  - 1 Instituição (FATEC SJC)
  - 2 Cursos (Análise de Sistemas, Gestão Empresarial)
  - 2 Laboratórios (Lab 1, Lab 2)
  - 2 Professores (Prof. Silva, Prof. Santos)
  - 3 Disciplinas (Algoritmos, Banco de Dados, Gestão de Projetos)
  - 4 Blocos de horário (Manhã 1-2, Noite 1-2)
  - 6 Aulas distribuídas na próxima semana
- Endpoint `/api/v1/reset-dados` para reset em desenvolvimento
- Logs informativos no console do backend

✅ **Dependências e Bibliotecas**
- **Frontend**: Material-UI, React Router, Axios, date-fns (para manipulação de datas)
- **Mobile**: React Native Paper, React Navigation, Expo, Picker nativo
- **Backend**: Express, Mongoose, Swagger, Helmet, CORS, Morgan
- **Infraestrutura**: Docker, MongoDB, Portainer

✅ **Documentação**
- README.md atualizado com todas as funcionalidades implementadas
- Documentos de requisitos e horários dos laboratórios
- JSDoc completo em todo o código do backend
- Documentação Swagger da API em `/api-docs`
- Instruções detalhadas de instalação e execução
- Estrutura de pastas e arquitetura do projeto
- Endpoints da API com exemplos de uso
- Funcionalidades de cada módulo (RF01, RF02, RF03)