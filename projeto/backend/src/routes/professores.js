const express = require('express');
const {
  criarProfessor,
  listarProfessores,
  atualizarProfessor,
  removerProfessor
} = require('../controllers/professorController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do professor
 *         email:
 *           type: string
 *           description: Email do professor
 *         telefone:
 *           type: string
 *           description: Telefone do professor
 *         status:
 *           type: boolean
 *           default: true
 *           description: Status ativo/inativo
 */

/**
 * @swagger
 * /api/v1/professores:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já existe
 */
router.post('/', criarProfessor);

/**
 * @swagger
 * /api/v1/professores:
 *   get:
 *     summary: Lista todos os professores
 *     tags: [Professores]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (contém)
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
 *         description: Lista de professores
 */
router.get('/', listarProfessores);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   put:
 *     summary: Atualiza um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       200:
 *         description: Professor atualizado
 *       404:
 *         description: Professor não encontrado
 */
router.put('/:id', atualizarProfessor);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   delete:
 *     summary: Remove um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', removerProfessor);

module.exports = router;