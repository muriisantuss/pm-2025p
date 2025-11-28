/**
 * Controller genérico com funções utilitárias para padronização
 * @module GenericController
 */

/**
 * Sanitiza dados de entrada convertendo status para ativo quando necessário
 * @param {Object} data - Dados de entrada
 * @returns {Object} Dados sanitizados
 */
const sanitizarDados = (data) => {
  const dadosSanitizados = { ...data };
  
  // Converter string "true"/"false" para boolean
  if (typeof dadosSanitizados.ativo === 'string') {
    dadosSanitizados.ativo = dadosSanitizados.ativo === 'true';
  }
  
  if (typeof dadosSanitizados.status === 'string') {
    dadosSanitizados.status = dadosSanitizados.status === 'true';
  }
  
  // Converter status para ativo se necessário (para compatibilidade)
  if (dadosSanitizados.status !== undefined && dadosSanitizados.ativo === undefined) {
    dadosSanitizados.ativo = dadosSanitizados.status;
    delete dadosSanitizados.status;
  }
  
  return dadosSanitizados;
};

/**
 * Sanitiza filtros de consulta
 * @param {Object} query - Query parameters
 * @returns {Object} Filtros sanitizados
 */
const sanitizarFiltros = (query) => {
  const filtros = {};
  
  // Padronizar campo ativo/status
  if (query.ativo !== undefined) {
    filtros.ativo = query.ativo === 'true';
  } else if (query.status !== undefined) {
    filtros.ativo = query.status === 'true';
  }
  
  // Filtros de texto
  if (query.nome) {
    filtros.nome = { $regex: query.nome, $options: 'i' };
  }
  
  if (query.email) {
    filtros.email = { $regex: query.email, $options: 'i' };
  }
  
  return filtros;
};

module.exports = {
  sanitizarDados,
  sanitizarFiltros
};