const mongoose = require('mongoose');

/**
 * Schema para o modelo de Blocos de Horário
 * @typedef {Object} Bloco
 * @property {string} turno - Turno do bloco
 * @property {number} diaSemana - Dia da semana (0-6)
 * @property {string} inicio - Horário de início
 * @property {string} fim - Horário de fim
 * @property {number} ordem - Ordem do bloco
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Blocos de Horário
 */
const blocoSchema = new mongoose.Schema({
  turno: {
    type: String,
    required: [true, 'Turno é obrigatório'],
    trim: true
  },
  diaSemana: {
    type: Number,
    required: [true, 'Dia da semana é obrigatório'],
    min: [0, 'Dia da semana deve ser entre 0 e 6'],
    max: [6, 'Dia da semana deve ser entre 0 e 6']
  },
  inicio: {
    type: String,
    required: [true, 'Horário de início é obrigatório'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de início deve estar no formato HH:MM']
  },
  fim: {
    type: String,
    required: [true, 'Horário de fim é obrigatório'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário de fim deve estar no formato HH:MM']
  },
  ordem: {
    type: Number,
    required: [true, 'Ordem é obrigatória'],
    min: [1, 'Ordem deve ser maior que zero']
  }
}, {
  timestamps: true,
  collection: 'blocos'
});

/**
 * Modelo Mongoose para Blocos de Horário
 * @class Bloco
 */
const Bloco = mongoose.model('Bloco', blocoSchema);

module.exports = Bloco;