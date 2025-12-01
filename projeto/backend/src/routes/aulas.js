const express = require('express');
const {
  criarAula,
  listarAulas,
  atualizarAula,
  removerAula
} = require('../controllers/aulaController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Aula:
 *       type: object
 *       required:
 *         - semestre
 *         - data
 *         - diaSemana
 *         - bloco
 *         - laboratorio
 *         - disciplina
 *         - professor
 *         - curso
 *       properties:
 *         semestre:
 *           type: string
 *           description: Semestre da aula (ex. "2025-2")
 *         data:
 *           type: string
 *           format: date
 *           description: Data específica da aula
 *         diaSemana:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *           description: Dia da semana (0=Domingo, 6=Sábado)
 *         bloco:
 *           type: string
 *           description: ID do bloco de horário
 *         laboratorio:
 *           type: string
 *           description: ID do laboratório
 *         disciplina:
 *           type: string
 *           description: ID da disciplina
 *         professor:
 *           type: string
 *           description: ID do professor
 *         curso:
 *           type: string
 *           description: ID do curso
 *         observacoes:
 *           type: string
 *           description: Observações sobre a aula
 *         ativo:
 *           type: boolean
 *           description: Status ativo/inativo
 *           default: true
 */

/**
 * @swagger
 * /api/v1/aulas:
 *   post:
 *     summary: Cria uma nova aula (alocação)
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *     responses:
 *       201:
 *         description: Aula criada com sucesso
 *       409:
 *         description: Conflito de horário (laboratório ou professor ocupado)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conflito: Este laboratório já está ocupado neste horário."
 *                 tipo:
 *                   type: string
 *                   enum: [laboratorio, professor]
 */
router.post('/', criarAula);

/**
 * @swagger
 * /api/v1/aulas:
 *   get:
 *     summary: Lista todas as aulas
 *     tags: [Aulas]
 *     parameters:
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data específica
 *       - in: query
 *         name: laboratorio
 *         schema:
 *           type: string
 *         description: Filtrar por laboratório
 *       - in: query
 *         name: professor
 *         schema:
 *           type: string
 *         description: Filtrar por professor
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de aulas
 */
router.get('/', listarAulas);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   put:
 *     summary: Atualiza uma aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *     responses:
 *       200:
 *         description: Aula atualizada
 *       404:
 *         description: Aula não encontrada
 *       409:
 *         description: Conflito de horário
 */
router.put('/:id', atualizarAula);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   delete:
 *     summary: Remove uma aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       204:
 *         description: Aula removida
 *       404:
 *         description: Aula não encontrada
 */
router.delete('/:id', removerAula);

module.exports = router;