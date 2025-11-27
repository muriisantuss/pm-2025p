const express = require('express');
const {
  criarCurso,
  listarCursos,
  atualizarCurso,
  removerCurso
} = require('../controllers/cursoController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - instituicao
 *         - nome
 *         - turnos
 *       properties:
 *         instituicao:
 *           type: string
 *           description: ID da instituição
 *         nome:
 *           type: string
 *           description: Nome do curso
 *         turnos:
 *           type: array
 *           items:
 *             type: string
 *           description: Turnos disponíveis
 *         status:
 *           type: string
 *           enum: [ativo, inativo]
 *           default: ativo
 *           description: Status do curso
 */

/**
 * @swagger
 * /api/v1/cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarCurso);

/**
 * @swagger
 * /api/v1/cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ativo, inativo]
 *         description: Filtrar por status
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
 *       - in: query
 *         name: instituicao
 *         schema:
 *           type: string
 *         description: Filtrar por ID da instituição
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
 *         description: Lista de cursos
 */
router.get('/', listarCursos);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado
 *       404:
 *         description: Curso não encontrado
 */
router.put('/:id', atualizarCurso);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       204:
 *         description: Curso removido
 *       404:
 *         description: Curso não encontrado
 */
router.delete('/:id', removerCurso);

module.exports = router;