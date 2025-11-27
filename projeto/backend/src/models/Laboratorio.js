const mongoose = require('mongoose');

/**
 * Schema para o modelo de Laboratórios
 * @typedef {Object} Laboratorio
 * @property {string} nome - Nome/identificador do laboratório
 * @property {number} capacidade - Capacidade do laboratório
 * @property {string} localizacao - Localização do laboratório
 * @property {boolean} status - Status ativo/inativo
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Laboratórios
 */
const laboratorioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [50, 'Nome deve ter no máximo 50 caracteres']
  },
  capacidade: {
    type: Number,
    required: [true, 'Capacidade é obrigatória'],
    min: [1, 'Capacidade deve ser maior que zero']
  },
  localizacao: {
    type: String,
    trim: true,
    maxlength: [100, 'Localização deve ter no máximo 100 caracteres']
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'laboratorios'
});

/**
 * Modelo Mongoose para Laboratórios
 * @class Laboratorio
 */
const Laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = Laboratorio;