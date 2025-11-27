@workspace @backend

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt, incluindo todas as explicações, comentários de código e documentação, EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

---

Contexto: Estamos finalizando o Trabalho Final (PM2025-2). O RF01 exige CRUD de Instituição, Curso, Professor, Disciplina, Laboratório e Blocos. Atualmente, apenas "Instituicao" está implementado. Precisamos implementar o restante do Backend mantendo estritamente o padrão de arquitetura atual (Controller, Routes, Model, Swagger).

Tarefa: Implementar as entidades restantes do RF01 no Backend Node.js/Mongoose.

1. CORREÇÃO DE MODELO:
   - Atualize `src/models/Instituicao.js`: Adicione o campo `sigla` (String, required, uppercase) que está faltando conforme requisitos.

2. NOVOS MODELOS (Mongoose):
   Crie os arquivos em `src/models/` com os seguintes campos (conforme documento de requisitos):
   
   - `Curso.js`:
     - instituicao: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituicao', required: true }
     - nome: { type: String, required: true }
     - turnos: { type: [String], required: true } // Ex: ['Manhã', 'Noite']
     - status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' }
   
   - `Professor.js`:
     - nome: { type: String, required: true }
     - email: { type: String, required: true, unique: true }
     - telefone: String
     - status: { type: Boolean, default: true }
   
   - `Laboratorio.js`:
     - nome: { type: String, required: true } (Identificador)
     - capacidade: { type: Number, required: true }
     - localizacao: String
     - status: { type: Boolean, default: true }

   - `Disciplina.js`:
     - curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true }
     - nome: { type: String, required: true }
     - cargaHoraria: { type: Number, required: true }
     - professorResponsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }
     - status: { type: Boolean, default: true }

   - `Bloco.js` (Blocos de horário):
     - turno: { type: String, required: true }
     - diaSemana: { type: Number, required: true } (0-6 ou 1-7)
     - inicio: { type: String, required: true } (Ex: "19:00")
     - fim: { type: String, required: true } (Ex: "20:40")
     - ordem: { type: Number, required: true }

3. CAMADA DE CONTROLLERS E ROTAS:
   - Para CADA modelo acima, crie o respectivo Controller em `src/controllers/` com:
     - criar (POST)
     - listar (GET) com paginação e filtros simples
     - atualizar (PUT)
     - remover (DELETE)
   - Crie as rotas em `src/routes/` seguindo o padrão de `instituicoes.js`.
   - Inclua documentação Swagger (@swagger) em todas as rotas.

4. INTEGRAÇÃO:
   - Atualize `src/models/index.js` exportando todos os novos modelos.
   - Atualize `server.js` registrando as novas rotas:
     - /api/v1/cursos
     - /api/v1/professores
     - /api/v1/laboratorios
     - /api/v1/disciplinas
     - /api/v1/blocos

Requisitos de Qualidade:
- Use tratamento de erros centralizado (next(error)).
- Mantenha validações de campos obrigatórios.
- As mensagens de erro e sucesso da API devem ser em pt-BR.