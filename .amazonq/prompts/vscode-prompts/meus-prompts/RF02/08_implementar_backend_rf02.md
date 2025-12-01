@workspace @backend

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt, incluindo comentários de código, EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O Backend já possui os cadastros base (RF01) prontos. Agora precisamos implementar o RF02: Cadastro de Aulas (Alocação). Este é o módulo principal do sistema, onde definimos quem dá aula, onde e quando.

Tarefa: Implementar o módulo de "Aulas" no Backend com validação rígida de conflitos de horário.

1. CRIAR MODELO (src/models/Aula.js):
   Crie o Schema Mongoose com os seguintes campos (conforme requisitos):
   - `semestre`: String, required (Ex: "2025-2").
   - `data`: Date, required (Data específica da aula).
   - `diaSemana`: Number, required (0-6, redundante para busca rápida mas útil).
   - `bloco`: { type: mongoose.Schema.Types.ObjectId, ref: 'Bloco', required: true } (Horário).
   - `laboratorio`: { type: mongoose.Schema.Types.ObjectId, ref: 'Laboratorio', required: true }.
   - `disciplina`: { type: mongoose.Schema.Types.ObjectId, ref: 'Disciplina', required: true }.
   - `professor`: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true }.
   - `curso`: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true }.
   - `observacoes`: String.
   - `ativo`: { type: Boolean, default: true }.

2. CRIAR CONTROLLER (src/controllers/aulaController.js):
   Implemente o CRUD padrão, mas com uma LÓGICA DE VALIDAÇÃO CRÍTICA no método `criar` e `atualizar`:
   
   Antes de salvar, o sistema DEVE verificar no banco se existe conflito (Status 409):
   
   **Regra 1 (Conflito de Laboratório):**
   - Existe alguma aula ativa (`ativo: true`) na mesma `data` E mesmo `bloco` E mesmo `laboratorio`?
   - Se sim -> Retornar erro 409: "Conflito: Este laboratório já está ocupado neste horário."
   
   **Regra 2 (Conflito de Professor):**
   - Existe alguma aula ativa (`ativo: true`) na mesma `data` E mesmo `bloco` E mesmo `professor`?
   - Se sim -> Retornar erro 409: "Conflito: Este professor já está ministrando aula em outro local neste horário."

3. CRIAR ROTAS (src/routes/aulas.js):
   - Endpoints:
     - POST /api/v1/aulas (Criar alocação)
     - GET /api/v1/aulas (Listar com filtros: data, laboratório, professor)
     - PUT /api/v1/aulas/:id
     - DELETE /api/v1/aulas/:id
   - Adicione a documentação Swagger completa.

4. INTEGRAÇÃO:
   - Exporte o modelo no `index.js`.
   - Registre a rota no `server.js`.

Requisitos de Qualidade:
- Use o `genericController` se possível, mas sobrescreva o método `create/update` para incluir a validação de conflitos.
- A mensagem de erro deve ser clara para o usuário final.