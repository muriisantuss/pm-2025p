const Laboratorio = require('../models/Laboratorio');
const { sanitizarDados, sanitizarFiltros } = require('./genericController');

/**
 * Controller para operações CRUD de laboratórios
 * @module LaboratorioController
 */

/**
 * Cria um novo laboratório
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarLaboratorio = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const laboratorio = await Laboratorio.create(dadosSanitizados);
    res.status(201).json(laboratorio);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todos os laboratórios com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarLaboratorios = async (req, res, next) => {
  try {
    const { capacidade, page = 1, limit = 20 } = req.query;
    const filter = sanitizarFiltros(req.query);

    if (capacidade) {
      filter.capacidade = { $gte: parseInt(capacidade) };
    }

    const skip = (page - 1) * limit;
    const laboratorios = await Laboratorio.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(laboratorios);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza um laboratório por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarLaboratorio = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    const laboratorio = await Laboratorio.findByIdAndUpdate(
      req.params.id,
      dadosSanitizados,
      { new: true, runValidators: true }
    );

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
      });
    }

    res.json(laboratorio);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove um laboratório por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerLaboratorio = async (req, res, next) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndDelete(req.params.id);

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarLaboratorio,
  listarLaboratorios,
  atualizarLaboratorio,
  removerLaboratorio
};