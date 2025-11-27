const mongoose = require('mongoose');

/**
 * Schema para o modelo de Cursos
 * @typedef {Object} Curso
 * @property {ObjectId} instituicao - ID da instituição
 * @property {string} nome - Nome do curso
 * @property {string[]} turnos - Turnos disponíveis
 * @property {string} status - Status do curso
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Cursos
 */
const cursoSchema = new mongoose.Schema({
  instituicao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: [true, 'Instituição é obrigatória']
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  turnos: {
    type: [String],
    required: [true, 'Turnos são obrigatórios'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Pelo menos um turno deve ser informado'
    }
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo'],
    default: 'ativo'
  }
}, {
  timestamps: true,
  collection: 'cursos'
});

/**
 * Modelo Mongoose para Cursos
 * @class Curso
 */
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;