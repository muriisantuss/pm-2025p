@workspace @backend

## INSTRUÇÃO OBRIGATÓRIA:
Responda EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: O script de Seeding automático (`src/services/seeder.js`) está falhando ao tentar popular o banco de dados.

Erro reportado nos logs:
`Error: Instituicao validation failed: sigla: Sigla é obrigatória`

Causa: O modelo de `Instituicao` exige o campo `sigla`, mas o Seeder está tentando criar o registro apenas com `nome`.

Tarefa: Corrigir o serviço de Seeding para incluir o campo obrigatório `sigla`.

1. CORREÇÃO NO SEEDER:
   - Localize a função onde a Instituição é criada (dentro de `seeder.js` ou similar).
   - Adicione o campo `sigla: 'FATEC'` (ou outra sigla apropriada) ao objeto de criação.

2. VERIFICAÇÃO ADICIONAL:
   - Verifique se há outros campos obrigatórios nos modelos (Curso, Professor, etc) que possam ter sido esquecidos no Seeder e corrija-os preventivamente.
   - Garanta que o Seeder trate erros com `console.error` detalhado para facilitar debugging futuro.

Gere o código corrigido do `src/services/seeder.js`.