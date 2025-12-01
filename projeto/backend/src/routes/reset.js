const express = require('express');
const SeederService = require('../services/seeder');

const router = express.Router();

/**
 * @swagger
 * /api/v1/reset-dados:
 *   post:
 *     summary: Reset e repopula o banco de dados (apenas desenvolvimento)
 *     tags: [Desenvolvimento]
 *     responses:
 *       200:
 *         description: Dados resetados com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res, next) => {
  try {
    // Verificar se está em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        message: 'Operação não permitida em produção'
      });
    }

    await SeederService.limparDados();
    await SeederService.executar();

    res.json({
      message: 'Dados resetados e repopulados com sucesso'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;