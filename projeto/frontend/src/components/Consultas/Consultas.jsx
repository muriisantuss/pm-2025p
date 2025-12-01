import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Tabs,
  Tab,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Today as TodayIcon,
  FilterList as FilterIcon 
} from '@mui/icons-material';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  addWeeks, 
  addMonths, 
  addDays, 
  isSameDay,
  parseISO 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services/api';

const Consultas = () => {
  const [modo, setModo] = useState(1); // 0=Mês, 1=Semana, 2=Dia
  const [dataAtual, setDataAtual] = useState(new Date());
  const [visao, setVisao] = useState('');
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [laboratorios, setLaboratorios] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const modos = ['Mês', 'Semana', 'Dia'];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [labsRes, profsRes, blocosRes] = await Promise.all([
        api.get('/laboratorios'),
        api.get('/professores'),
        api.get('/blocos')
      ]);
      setLaboratorios(labsRes.data);
      setProfessores(profsRes.data);
      setBlocos(blocosRes.data.sort((a, b) => a.ordem - b.ordem));
    } catch (error) {
      setError('Erro ao carregar dados');
    }
  };

  const calcularPeriodo = () => {
    switch (modo) {
      case 0: // Mês
        return {
          inicio: startOfMonth(dataAtual),
          fim: endOfMonth(dataAtual)
        };
      case 1: // Semana
        return {
          inicio: startOfWeek(dataAtual, { weekStartsOn: 1 }),
          fim: endOfWeek(dataAtual, { weekStartsOn: 1 })
        };
      case 2: // Dia
        return {
          inicio: dataAtual,
          fim: dataAtual
        };
      default:
        return { inicio: dataAtual, fim: dataAtual };
    }
  };

  const obterTituloPeriodo = () => {
    switch (modo) {
      case 0:
        return format(dataAtual, 'MMMM yyyy', { locale: ptBR });
      case 1:
        const { inicio, fim } = calcularPeriodo();
        return `${format(inicio, 'dd/MM')} - ${format(fim, 'dd/MM')}`;
      case 2:
        return format(dataAtual, 'dd/MM/yyyy', { locale: ptBR });
      default:
        return '';
    }
  };

  const navegarPeriodo = (direcao) => {
    const novaData = new Date(dataAtual);
    switch (modo) {
      case 0:
        setDataAtual(addMonths(novaData, direcao));
        break;
      case 1:
        setDataAtual(addWeeks(novaData, direcao));
        break;
      case 2:
        setDataAtual(addDays(novaData, direcao));
        break;
    }
  };

  const voltarHoje = () => {
    setDataAtual(new Date());
  };

  const buscarAulas = async () => {
    if (!visao || !itemSelecionado) {
      setError('Selecione um laboratório ou professor primeiro');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { inicio, fim } = calcularPeriodo();
      
      const params = {
        dataInicio: format(inicio, 'yyyy-MM-dd'),
        dataFim: format(fim, 'yyyy-MM-dd'),
        limit: 1000
      };

      if (visao === 'laboratorio') {
        params.laboratorio = itemSelecionado;
      } else {
        params.professor = itemSelecionado;
      }

      const response = await api.get('/aulas', { params });
      setAulas(response.data);
      
      if (response.data.length === 0) {
        setError('Nenhuma aula encontrada para este período/filtro');
      }
    } catch (error) {
      setError('Erro ao buscar aulas');
    } finally {
      setLoading(false);
    }
  };

  // Auto-buscar quando mudar período ou filtros
  useEffect(() => {
    if (visao && itemSelecionado) {
      buscarAulas();
    }
  }, [modo, dataAtual, visao, itemSelecionado]);

  const obterAulaPorDiaBloco = (diaIndex, blocoId) => {
    const { inicio } = calcularPeriodo();
    const dataAlvo = addDays(inicio, diaIndex);
    
    return aulas.find(aula => {
      const dataAula = parseISO(aula.data);
      return isSameDay(dataAula, dataAlvo) && aula.bloco._id === blocoId;
    });
  };

  const renderCelulaGrade = (diaIndex, bloco) => {
    const aula = obterAulaPorDiaBloco(diaIndex, bloco._id);
    
    if (!aula) {
      return (
        <TableCell 
          key={`${diaIndex}-${bloco._id}`} 
          sx={{ 
            border: 1, 
            borderColor: 'grey.300', 
            height: 80, 
            textAlign: 'center',
            color: 'grey.400',
            fontSize: '1.2rem'
          }}
        >
          -
        </TableCell>
      );
    }

    const cores = {
      'Algoritmos': '#e8f5e8',
      'Banco de Dados': '#fff3e0', 
      'Gestão de Projetos': '#f3e5f5',
      default: '#e3f2fd'
    };
    
    const corCard = cores[aula.disciplina?.nome] || cores.default;
    const infoSecundaria = visao === 'laboratorio' 
      ? aula.professor?.nome 
      : aula.laboratorio?.nome;

    return (
      <TableCell key={`${diaIndex}-${bloco._id}`} sx={{ border: 1, borderColor: 'grey.300', p: 0.5 }}>
        <Card sx={{ backgroundColor: corCard, minHeight: 70, boxShadow: 1 }}>
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Typography variant="body2" fontWeight="bold" display="block" noWrap>
              {aula.disciplina?.nome}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {infoSecundaria}
            </Typography>
          </CardContent>
        </Card>
      </TableCell>
    );
  };

  const renderVisaoMes = () => (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Visão mensal - {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
      </Typography>
      {aulas.length === 0 ? (
        <Typography>Nenhuma aula encontrada neste mês</Typography>
      ) : (
        <Grid container spacing={1}>
          {aulas.map(aula => (
            <Grid item xs={12} sm={6} md={4} key={aula._id}>
              <Card sx={{ p: 1 }}>
                <Typography variant="caption" display="block">
                  {format(parseISO(aula.data), 'dd/MM - EEEE', { locale: ptBR })}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {aula.disciplina?.nome}
                </Typography>
                <Typography variant="caption">
                  {aula.bloco.inicio} - {aula.bloco.fim}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderVisaoSemana = () => (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', border: 1, borderColor: 'grey.300' }}>
              Horário
            </TableCell>
            {diasSemana.map(dia => (
              <TableCell key={dia} align="center" sx={{ fontWeight: 'bold', border: 1, borderColor: 'grey.300' }}>
                {dia}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {blocos.map(bloco => (
            <TableRow key={bloco._id}>
              <TableCell sx={{ fontWeight: 'bold', border: 1, borderColor: 'grey.300' }}>
                {bloco.turno} {bloco.ordem}<br />
                <Typography variant="caption">
                  {bloco.inicio} - {bloco.fim}
                </Typography>
              </TableCell>
              {diasSemana.map((_, index) => renderCelulaGrade(index, bloco))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderVisaoDia = () => {
    const aulasDoDia = aulas.filter(aula => 
      isSameDay(parseISO(aula.data), dataAtual)
    ).sort((a, b) => a.bloco.ordem - b.bloco.ordem);

    return (
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {format(dataAtual, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </Typography>
        {aulasDoDia.length === 0 ? (
          <Typography>Nenhuma aula encontrada neste dia</Typography>
        ) : (
          aulasDoDia.map(aula => (
            <Card key={aula._id} sx={{ mb: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{aula.disciplina?.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {visao === 'laboratorio' ? aula.professor?.nome : aula.laboratorio?.nome}
                  </Typography>
                </Box>
                <Chip 
                  label={`${aula.bloco.inicio} - ${aula.bloco.fim}`}
                  color="primary"
                />
              </Box>
            </Card>
          ))
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Consulta de Horários
      </Typography>

      {/* Controles de Navegação */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Tabs value={modo} onChange={(e, newValue) => setModo(newValue)}>
            {modos.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
          
          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            onClick={voltarHoje}
            size="small"
          >
            Hoje
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <IconButton onClick={() => navegarPeriodo(-1)}>
            <ChevronLeft />
          </IconButton>
          
          <Typography variant="h6" sx={{ mx: 3, minWidth: 200, textAlign: 'center' }}>
            {obterTituloPeriodo()}
          </Typography>
          
          <IconButton onClick={() => navegarPeriodo(1)}>
            <ChevronRight />
          </IconButton>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}
      </Paper>

      {/* Filtros de Recurso */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <FilterIcon color="action" />
          <Typography variant="h6">Filtros</Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Recurso</InputLabel>
              <Select
                value={visao}
                onChange={(e) => {
                  setVisao(e.target.value);
                  setItemSelecionado('');
                }}
                label="Tipo de Recurso"
              >
                <MenuItem value="laboratorio">Laboratório</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!visao}>
              <InputLabel>Selecionar Item</InputLabel>
              <Select
                value={itemSelecionado}
                onChange={(e) => setItemSelecionado(e.target.value)}
                label="Selecionar Item"
              >
                {visao === 'laboratorio' && laboratorios.map(lab => (
                  <MenuItem key={lab._id} value={lab._id}>{lab.nome}</MenuItem>
                ))}
                {visao === 'professor' && professores.map(prof => (
                  <MenuItem key={prof._id} value={prof._id}>{prof.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Visualização Adaptativa */}
      {visao && itemSelecionado && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              {visao === 'laboratorio' ? 'Laboratório' : 'Professor'}: {
                visao === 'laboratorio' 
                  ? laboratorios.find(l => l._id === itemSelecionado)?.nome
                  : professores.find(p => p._id === itemSelecionado)?.nome
              }
            </Typography>
            
            {aulas.length > 0 && (
              <Chip 
                label={`${aulas.length} aula${aulas.length !== 1 ? 's' : ''}`} 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>

          {modo === 0 && renderVisaoMes()}
          {modo === 1 && renderVisaoSemana()}
          {modo === 2 && renderVisaoDia()}
        </Paper>
      )}
    </Box>
  );
};

export default Consultas;