const Instituicao = require('../models/Instituicao');
const { sanitizarDados, sanitizarFiltros } = require('./genericController');

/**
 * Controller para operações CRUD de instituições
 * @module InstituicaoController
 */

/**
 * Cria uma nova instituição
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarInstituicao = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const instituicao = await Instituicao.create(dadosSanitizados);
    res.status(201).json(instituicao);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas as instituições com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarInstituicoes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = sanitizarFiltros(req.query);

    const skip = (page - 1) * limit;
    const instituicoes = await Instituicao.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(instituicoes);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarInstituicao = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const instituicao = await Instituicao.findByIdAndUpdate(
      req.params.id,
      dadosSanitizados,
      { new: true, runValidators: true }
    );

    if (!instituicao) {
      return res.status(404).json({
        message: 'Instituição não encontrada'
      });
    }

    res.json(instituicao);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma instituição por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerInstituicao = async (req, res, next) => {
  try {
    const instituicao = await Instituicao.findByIdAndDelete(req.params.id);

    if (!instituicao) {
      return res.status(404).json({
        message: 'Instituição não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarInstituicao,
  listarInstituicoes,
  atualizarInstituicao,
  removerInstituicao
};