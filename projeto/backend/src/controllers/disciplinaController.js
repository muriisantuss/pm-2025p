const Disciplina = require('../models/Disciplina');

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
    const disciplina = await Disciplina.create(req.body);
    const disciplinaPopulada = await Disciplina.findById(disciplina._id)
      .populate('curso', 'nome')
      .populate('professorResponsavel', 'nome email');
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
    const { status, nome, curso, professor, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status !== undefined) {
      filter.status = status === 'true';
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    if (curso) {
      filter.curso = curso;
    }

    if (professor) {
      filter.professorResponsavel = professor;
    }

    const skip = (page - 1) * limit;
    const disciplinas = await Disciplina.find(filter)
      .populate('curso', 'nome')
      .populate('professorResponsavel', 'nome email')
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
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('curso', 'nome')
      .populate('professorResponsavel', 'nome email');

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