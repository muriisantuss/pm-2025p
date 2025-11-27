const Curso = require('../models/Curso');

/**
 * Controller para operações CRUD de cursos
 * @module CursoController
 */

/**
 * Cria um novo curso
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.create(req.body);
    const cursoPopulado = await Curso.findById(curso._id).populate('instituicao', 'nome sigla');
    res.status(201).json(cursoPopulado);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os cursos com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarCursos = async (req, res, next) => {
  try {
    const { status, nome, instituicao, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (nome) {
      filter.nome = { $regex: nome, $options: 'i' };
    }

    if (instituicao) {
      filter.instituicao = instituicao;
    }

    const skip = (page - 1) * limit;
    const cursos = await Curso.find(filter)
      .populate('instituicao', 'nome sigla')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(cursos);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um curso por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instituicao', 'nome sigla');

    if (!curso) {
      return res.status(404).json({
        message: 'Curso não encontrado'
      });
    }

    res.json(curso);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um curso por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);

    if (!curso) {
      return res.status(404).json({
        message: 'Curso não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarCurso,
  listarCursos,
  atualizarCurso,
  removerCurso
};