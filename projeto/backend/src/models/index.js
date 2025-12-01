/**
 * Exporta todos os modelos do sistema
 * @module Models
 */

const Instituicao = require('./Instituicao');
const Curso = require('./Curso');
const Professor = require('./Professor');
const Laboratorio = require('./Laboratorio');
const Disciplina = require('./Disciplina');
const Bloco = require('./Bloco');
const Aula = require('./Aula');

module.exports = {
  Instituicao,
  Curso,
  Professor,
  Laboratorio,
  Disciplina,
  Bloco,
  Aula
};