const Instituicao = require('../models/Instituicao');
const Curso = require('../models/Curso');
const Laboratorio = require('../models/Laboratorio');
const Professor = require('../models/Professor');
const Disciplina = require('../models/Disciplina');
const Bloco = require('../models/Bloco');
const Aula = require('../models/Aula');

/**
 * Serviço de população automática do banco de dados
 */
class SeederService {
  
  /**
   * Verifica se o banco precisa ser populado
   */
  static async precisaPopular() {
    const count = await Instituicao.countDocuments();
    return count === 0;
  }

  /**
   * Gera datas das duas primeiras semanas de Dezembro 2025
   */
  static gerarDatasDezembroTeste() {
    const datas = [];
    // Período: 01/12/2025 a 13/12/2025 (Segunda a Sábado)
    for (let dia = 1; dia <= 13; dia++) {
      const data = new Date(2025, 11, dia); // Dezembro = mês 11
      const diaSemana = data.getDay();
      // Incluir apenas Segunda(1) a Sábado(6)
      if (diaSemana >= 1 && diaSemana <= 6) {
        datas.push(data);
      }
    }
    return datas;
  }

  /**
   * Executa a população completa do banco
   */
  static async executar() {
    console.log('Iniciando Seeding COMPLETO (Alta Variedade e Lotação Máxima)...');

    try {
      // ---------------------------------------------------------
      // 1. ESTRUTURA BÁSICA
      // ---------------------------------------------------------
      const instituicao = await Instituicao.create({
        nome: 'FATEC SJC',
        sigla: 'FATEC',
        cnpj: '12.345.678/0001-90',
        email: 'contato@fatecsjc.edu.br',
        telefone: '(12) 3901-2050',
        endereco: 'Av. Engenheiro Francisco José Longo, 777',
        ativo: true
      });

      const cursoADS = await Curso.create({
        nome: 'Análise e Desenv. de Sistemas',
        turnos: ['Manhã', 'Noite'],
        instituicao: instituicao._id,
        ativo: true
      });

      const cursoGE = await Curso.create({
        nome: 'Gestão Empresarial',
        turnos: ['Manhã'],
        instituicao: instituicao._id,
        ativo: true
      });

      // ---------------------------------------------------------
      // 2. LABORATÓRIOS
      // ---------------------------------------------------------
      const lab1 = await Laboratorio.create({
        nome: 'Lab 01 (Dev)',
        capacidade: 30,
        localizacao: 'Bloco A - Térreo',
        ativo: true
      });

      const lab2 = await Laboratorio.create({
        nome: 'Lab 02 (Infra/Dados)',
        capacidade: 25,
        localizacao: 'Bloco A - 1º Andar',
        ativo: true
      });

      // ---------------------------------------------------------
      // 3. PROFESSORES (Mais variedade)
      // ---------------------------------------------------------
      const profSilva = await Professor.create({ nome: 'Prof. Silva', email: 'silva@fatec.br', telefone: '1299991111', ativo: true });
      const profSantos = await Professor.create({ nome: 'Prof. Santos', email: 'santos@fatec.br', telefone: '1299992222', ativo: true });
      const profOliveira = await Professor.create({ nome: 'Profa. Oliveira', email: 'oliveira@fatec.br', telefone: '1299993333', ativo: true });
      const profSouza = await Professor.create({ nome: 'Prof. Souza', email: 'souza@fatec.br', telefone: '1299994444', ativo: true });
      const profLima = await Professor.create({ nome: 'Profa. Lima', email: 'lima@fatec.br', telefone: '1299995555', ativo: true });

      // ---------------------------------------------------------
      // 4. BLOCOS DE HORÁRIO
      // ---------------------------------------------------------
      const blocoM1 = await Bloco.create({ turno: 'Manhã', diaSemana: 1, inicio: '07:40', fim: '09:20', ordem: 1 });
      const blocoM2 = await Bloco.create({ turno: 'Manhã', diaSemana: 1, inicio: '09:30', fim: '11:10', ordem: 2 });
      const blocoN1 = await Bloco.create({ turno: 'Noite', diaSemana: 1, inicio: '19:00', fim: '20:40', ordem: 1 });
      const blocoN2 = await Bloco.create({ turno: 'Noite', diaSemana: 1, inicio: '20:50', fim: '22:30', ordem: 2 });

      // ---------------------------------------------------------
      // 5. DISCIPLINAS (Mais variedade)
      // ---------------------------------------------------------
      // Prof. Silva (Lógica/Algoritmos)
      const algoritmos = await Disciplina.create({ nome: 'Algoritmos e Lógica', cargaHoraria: 80, curso: cursoADS._id, professor: profSilva._id, ativo: true });
      const estDados = await Disciplina.create({ nome: 'Estrutura de Dados', cargaHoraria: 80, curso: cursoADS._id, professor: profSilva._id, ativo: true });
      
      // Prof. Santos (Dados)
      const bancoDados = await Disciplina.create({ nome: 'Banco de Dados', cargaHoraria: 80, curso: cursoADS._id, professor: profSantos._id, ativo: true });
      const gestaoProjetos = await Disciplina.create({ nome: 'Gestão de Projetos', cargaHoraria: 40, curso: cursoGE._id, professor: profSantos._id, ativo: true });

      // Profa. Oliveira (Web/Mobile)
      const desenvWeb = await Disciplina.create({ nome: 'Desenv. Web III', cargaHoraria: 80, curso: cursoADS._id, professor: profOliveira._id, ativo: true });
      const mobile = await Disciplina.create({ nome: 'Prog. Dispositivos Móveis', cargaHoraria: 80, curso: cursoADS._id, professor: profOliveira._id, ativo: true });

      // Prof. Souza (Redes/Infra)
      const redes = await Disciplina.create({ nome: 'Redes de Computadores', cargaHoraria: 80, curso: cursoADS._id, professor: profSouza._id, ativo: true });
      const so = await Disciplina.create({ nome: 'Sistemas Operacionais', cargaHoraria: 80, curso: cursoADS._id, professor: profSouza._id, ativo: true });

      // Profa. Lima (Geral/Inglês)
      const ingles = await Disciplina.create({ nome: 'Inglês Técnico', cargaHoraria: 40, curso: cursoADS._id, professor: profLima._id, ativo: true });
      const estatistica = await Disciplina.create({ nome: 'Estatística Aplicada', cargaHoraria: 40, curso: cursoGE._id, professor: profLima._id, ativo: true });


      // ---------------------------------------------------------
      // 6. POPULANDO AULAS (FULL STACKED)
      // ---------------------------------------------------------
      await Aula.deleteMany({});
      
      const datasDezembroTeste = this.gerarDatasDezembroTeste();
      const aulas = [];

      // Função auxiliar para criar par de aulas (1º e 2º horário)
      const criarAulasTurno = (data, blocos, laboratorio, disciplina, curso) => {
        blocos.forEach(bloco => {
          aulas.push({
            semestre: '2025-1',
            data: new Date(data),
            diaSemana: data.getDay(),
            bloco: bloco._id,
            laboratorio: laboratorio._id,
            disciplina: disciplina._id,
            professor: disciplina.professor, // Pega o ID do professor direto da disciplina
            curso: curso._id,
            ativo: true
          });
        });
      };
      
      datasDezembroTeste.forEach(data => {
        const dia = data.getDay(); // 1=Seg, 2=Ter, ..., 6=Sab

        // LÓGICA DE GRADE SEMANAL (Variedade por dia)
        switch(dia) {
          case 1: // SEGUNDA-FEIRA
            // Lab 1 (Dev): Manhã (Algoritmos) | Noite (Web)
            criarAulasTurno(data, [blocoM1, blocoM2], lab1, algoritmos, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab1, desenvWeb, cursoADS);
            // Lab 2 (Infra): Manhã (Redes) | Noite (Banco Dados)
            criarAulasTurno(data, [blocoM1, blocoM2], lab2, redes, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab2, bancoDados, cursoADS);
            break;

          case 2: // TERÇA-FEIRA
            // Lab 1 (Dev): Manhã (Est. Dados) | Noite (Mobile)
            criarAulasTurno(data, [blocoM1, blocoM2], lab1, estDados, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab1, mobile, cursoADS);
            // Lab 2 (Geral): Manhã (Estatística) | Noite (SO)
            criarAulasTurno(data, [blocoM1, blocoM2], lab2, estatistica, cursoGE);
            criarAulasTurno(data, [blocoN1, blocoN2], lab2, so, cursoADS);
            break;

          case 3: // QUARTA-FEIRA
            // Lab 1 (Dev): Manhã (Web) | Noite (Algoritmos)
            criarAulasTurno(data, [blocoM1, blocoM2], lab1, desenvWeb, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab1, algoritmos, cursoADS);
            // Lab 2 (Infra): Manhã (Banco Dados) | Noite (Redes)
            criarAulasTurno(data, [blocoM1, blocoM2], lab2, bancoDados, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab2, redes, cursoADS);
            break;

          case 4: // QUINTA-FEIRA
            // Lab 1 (Dev): Manhã (Mobile) | Noite (Est. Dados)
            criarAulasTurno(data, [blocoM1, blocoM2], lab1, mobile, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab1, estDados, cursoADS);
            // Lab 2 (Geral): Manhã (Inglês) | Noite (Gestão)
            criarAulasTurno(data, [blocoM1, blocoM2], lab2, ingles, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab2, gestaoProjetos, cursoGE);
            break;

          case 5: // SEXTA-FEIRA
            // Lab 1: Manhã (Algoritmos) | Noite (Web)
            criarAulasTurno(data, [blocoM1, blocoM2], lab1, algoritmos, cursoADS);
            criarAulasTurno(data, [blocoN1, blocoN2], lab1, desenvWeb, cursoADS);
            // Lab 2: Manhã (Gestão) | Noite (Inglês)
            criarAulasTurno(data, [blocoM1, blocoM2], lab2, gestaoProjetos, cursoGE);
            criarAulasTurno(data, [blocoN1, blocoN2], lab2, ingles, cursoADS);
            break;

          case 6: // SÁBADO (Dia de Workshops e Reposições)
            // Lab 1: Manhã (Mobile - Oficina)
            criarAulasTurno(data, [blocoM1, blocoM2], lab1, mobile, cursoADS);
            // Lab 2: Manhã (SO - Manutenção)
            criarAulasTurno(data, [blocoM1, blocoM2], lab2, so, cursoADS);
            // Sábado não tem aula a noite na FATEC, mas vamos manter vazio ou preencher se quiser
            break;
        }
      });

      await Aula.insertMany(aulas);
      console.log(`Cronograma gerado! Total de ${aulas.length} aulas criadas.`);
      console.log('Seeding concluído com sucesso!');

    } catch (error) {
      console.error('Erro durante o seeding:', error.message);
      if (error.errors) {
        Object.keys(error.errors).forEach(key => {
          console.error(`- ${key}: ${error.errors[key].message}`);
        });
      }
      throw error;
    }
  }

  /**
   * Limpa todos os dados do banco
   */
  static async limparDados() {
    await Promise.all([
      Aula.deleteMany({}),
      Disciplina.deleteMany({}),
      Bloco.deleteMany({}),
      Professor.deleteMany({}),
      Laboratorio.deleteMany({}),
      Curso.deleteMany({}),
      Instituicao.deleteMany({})
    ]);
    console.log('Dados limpos do banco');
  }
}

module.exports = SeederService;