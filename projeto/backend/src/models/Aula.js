const mongoose = require('mongoose');

/**
 * Schema para aulas (alocação de horários)
 * @module AulaModel
 */
const aulaSchema = new mongoose.Schema({
  semestre: {
    type: String,
    required: [true, 'Semestre é obrigatório'],
    trim: true
  },
  data: {
    type: Date,
    required: [true, 'Data é obrigatória']
  },
  diaSemana: {
    type: Number,
    required: [true, 'Dia da semana é obrigatório'],
    min: [0, 'Dia da semana deve ser entre 0 e 6'],
    max: [6, 'Dia da semana deve ser entre 0 e 6']
  },
  bloco: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bloco',
    required: [true, 'Bloco de horário é obrigatório']
  },
  laboratorio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: [true, 'Laboratório é obrigatório']
  },
  disciplina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: [true, 'Disciplina é obrigatória']
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'Professor é obrigatório']
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório']
  },
  observacoes: {
    type: String,
    trim: true
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para otimizar consultas de conflito
aulaSchema.index({ data: 1, bloco: 1, laboratorio: 1 });
aulaSchema.index({ data: 1, bloco: 1, professor: 1 });

module.exports = mongoose.model('Aula', aulaSchema);