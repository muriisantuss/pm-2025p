@workspace @backend @frontend @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: As telas de Consulta (RF03) foram implementadas. Agora precisamos de uma massa de dados automática (Seeding) para validar o funcionamento da Grade Horária e dos Filtros sem precisar cadastrar tudo manualmente.

Tarefa: Criar script de população de banco e garantir que as telas de consulta consumam esses dados corretamente.

### 1. BACKEND: DATA SEEDER AUTOMÁTICO
Crie o serviço `src/services/seeder.js` e configure para rodar no `server.js` ao iniciar, se o banco estiver vazio.

**Lógica de População:**
- Verifique se a collection `Instituicoes` está vazia. Se sim, execute:
  1. Criar Instituição: "FATEC SJC".
  2. Criar Cursos: "Análise de Sistemas" (Manhã/Noite) e "Gestão Empresarial" (Manhã).
  3. Criar Laboratórios: "Lab 1 (30 pcs)" e "Lab 2 (20 pcs)".
  4. Criar Professores: "Prof. Silva" e "Prof. Santos".
  5. Criar Disciplinas: "Algoritmos", "Banco de Dados", "Gestão de Projetos".
  6. Criar Blocos de Horário Padrão:
     - Manhã 1 (07:40 - 09:20)
     - Manhã 2 (09:30 - 11:10)
     - Noite 1 (19:00 - 20:40)
     - Noite 2 (20:50 - 22:30)
  7. **Gerar Aulas (Alocação):** Crie pelo menos 5 aulas distribuídas na **próxima semana** (calcule as datas dinamicamente usando `new Date()`) para que a grade não apareça vazia nos testes.

### 2. REVISÃO: INTEGRAÇÃO DA GRADE (Frontend/Mobile)
Verifique se as telas de Consulta (`Consultas.jsx` e `ConsultasScreen.js`) estão preparadas para exibir esses dados:
- **Web:** Garanta que a tabela cruza corretamente `Dia da Semana` x `Bloco` para posicionar os cards.
- **Mobile:** Garanta que a lista agrupa corretamente as aulas por `Data` ou `Dia da Semana`.

### 3. ROTA DE RESET (Opcional mas útil)
Crie um endpoint `POST /api/v1/reset-dados` (apenas em ambiente de desenvolvimento) que limpa o banco e roda o seeder novamente, para facilitar os testes do professor.

Requisitos:
- Use mensagens de log no console do Backend para indicar: "Banco vazio detectado. Populando dados..." e "Seeding concluído!".