import axios from 'axios';

/**
 * Configuração da API
 * @module API
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviços para operações com instituições
 */
export const instituicoesService = {
  /**
   * Lista todas as instituições
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise} Promise com dados das instituições
   */
  listar: (params = {}) => api.get('/instituicoes', { params }),

  /**
   * Cria uma nova instituição
   * @param {Object} data - Dados da instituição
   * @returns {Promise} Promise com dados da instituição criada
   */
  criar: (data) => api.post('/instituicoes', data),

  /**
   * Atualiza uma instituição
   * @param {string} id - ID da instituição
   * @param {Object} data - Dados para atualização
   * @returns {Promise} Promise com dados da instituição atualizada
   */
  atualizar: (id, data) => api.put(`/instituicoes/${id}`, data),

  /**
   * Remove uma instituição
   * @param {string} id - ID da instituição
   * @returns {Promise} Promise da operação
   */
  remover: (id) => api.delete(`/instituicoes/${id}`),
};

/**
 * Serviços para operações com cursos
 */
export const cursosService = {
  listar: (params = {}) => api.get('/cursos', { params }),
  criar: (data) => api.post('/cursos', data),
  atualizar: (id, data) => api.put(`/cursos/${id}`, data),
  remover: (id) => api.delete(`/cursos/${id}`),
};

/**
 * Serviços para operações com professores
 */
export const professoresService = {
  listar: (params = {}) => api.get('/professores', { params }),
  criar: (data) => api.post('/professores', data),
  atualizar: (id, data) => api.put(`/professores/${id}`, data),
  remover: (id) => api.delete(`/professores/${id}`),
};

/**
 * Serviços para operações com laboratórios
 */
export const laboratoriosService = {
  listar: (params = {}) => api.get('/laboratorios', { params }),
  criar: (data) => api.post('/laboratorios', data),
  atualizar: (id, data) => api.put(`/laboratorios/${id}`, data),
  remover: (id) => api.delete(`/laboratorios/${id}`),
};

/**
 * Serviços para operações com disciplinas
 */
export const disciplinasService = {
  listar: (params = {}) => api.get('/disciplinas', { params }),
  criar: (data) => api.post('/disciplinas', data),
  atualizar: (id, data) => api.put(`/disciplinas/${id}`, data),
  remover: (id) => api.delete(`/disciplinas/${id}`),
};

/**
 * Serviços para operações com blocos de horário
 */
export const blocosService = {
  listar: (params = {}) => api.get('/blocos', { params }),
  criar: (data) => api.post('/blocos', data),
  atualizar: (id, data) => api.put(`/blocos/${id}`, data),
  remover: (id) => api.delete(`/blocos/${id}`),
};

/**
 * Serviços para operações com aulas
 */
export const aulasService = {
  listar: (params = {}) => api.get('/aulas', { params }),
  criar: (data) => api.post('/aulas', data),
  atualizar: (id, data) => api.put(`/aulas/${id}`, data),
  remover: (id) => api.delete(`/aulas/${id}`),
};

export default api;