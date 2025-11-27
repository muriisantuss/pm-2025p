const express = require('express');
const {
  criarBloco,
  listarBlocos,
  atualizarBloco,
  removerBloco
} = require('../controllers/blocoController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Bloco:
 *       type: object
 *       required:
 *         - turno
 *         - diaSemana
 *         - inicio
 *         - fim
 *         - ordem
 *       properties:
 *         turno:
 *           type: string
 *           description: Turno do bloco
 *         diaSemana:
 *           type: number
 *           minimum: 0
 *           maximum: 6
 *           description: Dia da semana (0-6)
 *         inicio:
 *           type: string
 *           pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de início (HH:MM)
 *         fim:
 *           type: string
 *           pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de fim (HH:MM)
 *         ordem:
 *           type: number
 *           minimum: 1
 *           description: Ordem do bloco
 */

/**
 * @swagger
 * /api/v1/blocos:
 *   post:
 *     summary: Cria um novo bloco de horário
 *     tags: [Blocos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bloco'
 *     responses:
 *       201:
 *         description: Bloco criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarBloco);

/**
 * @swagger
 * /api/v1/blocos:
 *   get:
 *     summary: Lista todos os blocos de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *         description: Filtrar por turno (contém)
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 6
 *         description: Filtrar por dia da semana
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
 *         description: Lista de blocos de horário
 */
router.get('/', listarBlocos);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   put:
 *     summary: Atualiza um bloco de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bloco'
 *     responses:
 *       200:
 *         description: Bloco atualizado
 *       404:
 *         description: Bloco não encontrado
 */
router.put('/:id', atualizarBloco);

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   delete:
 *     summary: Remove um bloco de horário
 *     tags: [Blocos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco
 *     responses:
 *       204:
 *         description: Bloco removido
 *       404:
 *         description: Bloco não encontrado
 */
router.delete('/:id', removerBloco);

module.exports = router;