@workspace @backend @mobile

## INSTRUÇÃO OBRIGATÓRIA:
Responda a este prompt EXCLUSIVAMENTE em PORTUGUÊS DO BRASIL (PT-BR).

Contexto: Estamos finalizando o projeto. Precisamos de dados robustos para testar a Grade de Horários (RF03) no mês de Dezembro/2025. Além disso, a tela de Consultas no Mobile está exibindo "undefined - undefined" nos cards, indicando erro de leitura dos dados populados.

Tarefa: Atualizar o Seeder para preencher Dezembro e corrigir a exibição no Mobile.

---

### 1. BACKEND: SUPER SEEDER (src/services/seeder.js)
Atualize a lógica de geração de aulas para preencher **as duas primeiras semanas de Dezembro de 2025** (01/12/2025 a 13/12/2025).

**Regras de População:**
- **Limpeza:** Antes de criar aulas, remova todas as aulas existentes (`Aula.deleteMany({})`) para evitar duplicidade e conflitos antigos.
- **Período:** Itere pelos dias de 01/12/2025 a 13/12/2025 (Segunda a Sábado).
- **Alocação Fixa (Para teste visual):**
  - **Prof. Silva:** Dê aulas de "Algoritmos" no "Lab 1" todas as **Segundas, Quartas e Sextas** (Blocos da Manhã).
  - **Prof. Santos:** Dê aulas de "Banco de Dados" no "Lab 2" todas as **Terças e Quintas** (Blocos da Noite).
  - **Sábados:** Alterne entre eles.
- **Log:** Exiba no console: "Cronograma de Dezembro gerado com sucesso!".

---

### 2. MOBILE: CORREÇÃO "UNDEFINED" (src/components/Consultas/ConsultasScreen.js)
O App está mostrando "undefined - undefined" nos cards da lista de consulta.
**Diagnóstico Provável:** O código está tentando acessar `item.disciplina.nome` ou `item.professor.nome`, mas o objeto está chegando nulo ou desestruturado.

**Correções:**
1.  **Verificação Segura:** No `renderItem` ou componente de Card, use *Optional Chaining* e valores padrão.
    - Ex: `{item.disciplina?.nome || 'Disciplina N/A'} - {item.professor?.nome || 'Prof. N/A'}`.
2.  **Debug:** Adicione um `console.log('Item Aula:', item)` antes do return do renderItem para vermos o que está chegando da API.
3.  **Backend (Garantia):** Verifique no `aulaController.js` (método listar) se o `.populate(['disciplina', 'professor', 'laboratorio', 'bloco', 'curso'])` está sendo aplicado corretamente em todas as chamadas GET.

---

### 3. REVISÃO UX MOBILE
- Garanta que a lista no Mobile mostre:
  - **Horário:** `bloco.inicio` - `bloco.fim`
  - **Título:** Nome da Disciplina
  - **Subtítulo:** Nome do Professor e Laboratório.

Gere o código atualizado do `seeder.js` e do `ConsultasScreen.js`.