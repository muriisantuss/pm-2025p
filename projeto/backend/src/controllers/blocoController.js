const Bloco = require('../models/Bloco');
const { sanitizarDados } = require('./genericController');

/**
 * Controller para operações CRUD de blocos de horário
 * @module BlocoController
 */

/**
 * Cria um novo bloco de horário
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarBloco = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const bloco = await Bloco.create(dadosSanitizados);
    res.status(201).json(bloco);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os blocos de horário com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarBlocos = async (req, res, next) => {
  try {
    const { turno, diaSemana, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (turno) {
      filter.turno = { $regex: turno, $options: 'i' };
    }

    if (diaSemana !== undefined) {
      filter.diaSemana = parseInt(diaSemana);
    }

    const skip = (page - 1) * limit;
    const blocos = await Bloco.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ diaSemana: 1, ordem: 1 });

    res.json(blocos);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um bloco de horário por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarBloco = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const bloco = await Bloco.findByIdAndUpdate(
      req.params.id,
      dadosSanitizados,
      { new: true, runValidators: true }
    );

    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco de horário não encontrado'
      });
    }

    res.json(bloco);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um bloco de horário por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerBloco = async (req, res, next) => {
  try {
    const bloco = await Bloco.findByIdAndDelete(req.params.id);

    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco de horário não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarBloco,
  listarBlocos,
  atualizarBloco,
  removerBloco
};