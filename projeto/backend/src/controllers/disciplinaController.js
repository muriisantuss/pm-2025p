const Disciplina = require('../models/Disciplina');
const { sanitizarDados, sanitizarFiltros } = require('./genericController');

/**
 * Controller para operações CRUD de disciplinas
 * @module DisciplinaController
 */

/**
 * Cria uma nova disciplina
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarDisciplina = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const disciplina = await Disciplina.create(dadosSanitizados);
    const disciplinaPopulada = await Disciplina.findById(disciplina._id)
      .populate('curso', 'nome')
      .populate('professor', 'nome email');
    res.status(201).json(disciplinaPopulada);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas as disciplinas com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarDisciplinas = async (req, res, next) => {
  try {
    const { curso, professor, page = 1, limit = 20 } = req.query;
    const filter = sanitizarFiltros(req.query);

    if (curso) {
      filter.curso = curso;
    }

    if (professor) {
      filter.professor = professor;
    }

    const skip = (page - 1) * limit;
    const disciplinas = await Disciplina.find(filter)
      .populate('curso', 'nome')
      .populate('professor', 'nome email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(disciplinas);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma disciplina por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarDisciplina = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      dadosSanitizados,
      { new: true, runValidators: true }
    )
      .populate('curso', 'nome')
      .populate('professor', 'nome email');

    if (!disciplina) {
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.json(disciplina);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma disciplina por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerDisciplina = async (req, res, next) => {
  try {
    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);

    if (!disciplina) {
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarDisciplina,
  listarDisciplinas,
  atualizarDisciplina,
  removerDisciplina
};