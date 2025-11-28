const Professor = require('../models/Professor');
const { sanitizarDados, sanitizarFiltros } = require('./genericController');

/**
 * Controller para operações CRUD de professores
 * @module ProfessorController
 */

/**
 * Cria um novo professor
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarProfessor = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const professor = await Professor.create(dadosSanitizados);
    res.status(201).json(professor);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os professores com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarProfessores = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = sanitizarFiltros(req.query);

    const skip = (page - 1) * limit;
    const professores = await Professor.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(professores);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um professor por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarProfessor = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      dadosSanitizados,
      { new: true, runValidators: true }
    );

    if (!professor) {
      return res.status(404).json({
        message: 'Professor não encontrado'
      });
    }

    res.json(professor);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um professor por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerProfessor = async (req, res, next) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);

    if (!professor) {
      return res.status(404).json({
        message: 'Professor não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarProfessor,
  listarProfessores,
  atualizarProfessor,
  removerProfessor
};