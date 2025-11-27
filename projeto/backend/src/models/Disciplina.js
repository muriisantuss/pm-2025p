const mongoose = require('mongoose');

/**
 * Schema para o modelo de Disciplinas
 * @typedef {Object} Disciplina
 * @property {ObjectId} curso - ID do curso
 * @property {string} nome - Nome da disciplina
 * @property {number} cargaHoraria - Carga horária da disciplina
 * @property {ObjectId} professorResponsavel - ID do professor responsável
 * @property {boolean} status - Status ativo/inativo
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Disciplinas
 */
const disciplinaSchema = new mongoose.Schema({
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório']
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  cargaHoraria: {
    type: Number,
    required: [true, 'Carga horária é obrigatória'],
    min: [1, 'Carga horária deve ser maior que zero']
  },
  professorResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor'
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'disciplinas'
});

/**
 * Modelo Mongoose para Disciplinas
 * @class Disciplina
 */
const Disciplina = mongoose.model('Disciplina', disciplinaSchema);

module.exports = Disciplina;