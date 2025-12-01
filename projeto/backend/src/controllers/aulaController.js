const Aula = require('../models/Aula');
const { sanitizarDados, sanitizarFiltros } = require('./genericController');

/**
 * Controller para operações CRUD de aulas com validação de conflitos
 * @module AulaController
 */

/**
 * Normaliza data para início do dia (00:00:00.000Z)
 * @param {String|Date} data - Data a ser normalizada
 * @returns {Date} Data normalizada
 */
const normalizarData = (data) => {
  const dataObj = new Date(data);
  dataObj.setUTCHours(0, 0, 0, 0);
  return dataObj;
};

/**
 * Verifica conflitos de horário antes de criar/atualizar aula
 * @param {Object} dadosAula - Dados da aula
 * @param {String} aulaId - ID da aula (para atualização)
 * @returns {Object|null} Conflito encontrado ou null
 */
const verificarConflitos = async (dadosAula, aulaId = null) => {
  const { data, bloco, laboratorio, professor } = dadosAula;
  
  // Normalizar data para evitar falsos negativos
  const dataNormalizada = normalizarData(data);
  
  // Query base para buscar conflitos
  const queryBase = {
    data: dataNormalizada,
    bloco,
    ativo: true
  };
  
  // Excluir a própria aula em caso de atualização
  if (aulaId) {
    queryBase._id = { $ne: aulaId };
  }
  
  // Verificar conflito de laboratório
  const conflitoLaboratorio = await Aula.findOne({
    ...queryBase,
    laboratorio
  });
  
  if (conflitoLaboratorio) {
    return {
      tipo: 'laboratorio',
      message: 'Conflito: Este laboratório já está ocupado neste horário.'
    };
  }
  
  // Verificar conflito de professor
  const conflitoProfessor = await Aula.findOne({
    ...queryBase,
    professor
  });
  
  if (conflitoProfessor) {
    return {
      tipo: 'professor',
      message: 'Conflito: Este professor já está ministrando aula em outro local neste horário.'
    };
  }
  
  return null;
};

/**
 * Cria uma nova aula com validação de conflitos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const criarAula = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    
    // Normalizar data antes de salvar
    if (dadosSanitizados.data) {
      dadosSanitizados.data = normalizarData(dadosSanitizados.data);
    }
    
    // Verificar conflitos antes de criar
    const conflito = await verificarConflitos(dadosSanitizados);
    if (conflito) {
      return res.status(409).json({
        message: conflito.message,
        tipo: conflito.tipo
      });
    }
    
    const aula = await Aula.create(dadosSanitizados);
    const aulaPopulada = await Aula.findById(aula._id)
      .populate('bloco')
      .populate('laboratorio')
      .populate('disciplina')
      .populate('professor')
      .populate('curso');
    
    res.status(201).json(aulaPopulada);
  } catch (error) {
    next(error);
  }
};

/**
 * Lista todas as aulas com filtros opcionais
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const listarAulas = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, data, laboratorio, professor } = req.query;
    const filter = sanitizarFiltros(req.query);
    
    // Filtros específicos para aulas
    if (data) {
      filter.data = normalizarData(data);
    }
    if (laboratorio) {
      filter.laboratorio = laboratorio;
    }
    if (professor) {
      filter.professor = professor;
    }

    const skip = (page - 1) * limit;
    const aulas = await Aula.find(filter)
      .populate('bloco')
      .populate('laboratorio')
      .populate('disciplina')
      .populate('professor')
      .populate('curso')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ data: 1, 'bloco.ordem': 1 });

    res.json(aulas);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza uma aula por ID com validação de conflitos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const atualizarAula = async (req, res, next) => {
  try {
    const dadosSanitizados = sanitizarDados(req.body);
    
    // Normalizar data antes de atualizar
    if (dadosSanitizados.data) {
      dadosSanitizados.data = normalizarData(dadosSanitizados.data);
    }
    
    // Verificar conflitos antes de atualizar
    const conflito = await verificarConflitos(dadosSanitizados, req.params.id);
    if (conflito) {
      return res.status(409).json({
        message: conflito.message,
        tipo: conflito.tipo
      });
    }
    
    const aula = await Aula.findByIdAndUpdate(
      req.params.id,
      dadosSanitizados,
      { new: true, runValidators: true }
    )
    .populate('bloco')
    .populate('laboratorio')
    .populate('disciplina')
    .populate('professor')
    .populate('curso');

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada'
      });
    }

    res.json(aula);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove uma aula por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const removerAula = async (req, res, next) => {
  try {
    const aula = await Aula.findByIdAndDelete(req.params.id);

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  criarAula,
  listarAulas,
  atualizarAula,
  removerAula
};