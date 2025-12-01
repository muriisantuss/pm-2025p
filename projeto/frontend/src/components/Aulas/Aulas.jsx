import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { 
  aulasService, 
  cursosService, 
  professoresService, 
  disciplinasService, 
  laboratoriosService, 
  blocosService 
} from '../../services/api';

const Aulas = () => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});

  // Listas auxiliares para os selects
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const [formData, setFormData] = useState({
    semestre: '',
    data: '',
    diaSemana: '',
    bloco: '',
    laboratorio: '',
    disciplina: '',
    professor: '',
    curso: '',
    observacoes: '',
    ativo: true,
  });

  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
  ];

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [aulasRes, cursosRes, professoresRes, disciplinasRes, laboratoriosRes, blocosRes] = await Promise.all([
        aulasService.listar(),
        cursosService.listar(),
        professoresService.listar(),
        disciplinasService.listar(),
        laboratoriosService.listar(),
        blocosService.listar(),
      ]);

      setAulas(aulasRes.data);
      setCursos(cursosRes.data);
      setProfessores(professoresRes.data);
      setDisciplinas(disciplinasRes.data);
      setLaboratorios(laboratoriosRes.data);
      setBlocos(blocosRes.data);
      setDadosCarregados(true);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarSnackbar('Erro ao carregar dados de cadastro. Verifique sua conexão.', 'error');
      setDadosCarregados(false);
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const obterNomeDiaSemana = (diaSemana) => {
    const dia = diasSemana.find(d => d.value === diaSemana);
    return dia ? dia.label : '';
  };

  const abrirDialog = (aula = null) => {
    setErrors({});
    if (aula) {
      setEditingId(aula._id);
      setFormData({
        semestre: aula.semestre || '',
        data: aula.data ? aula.data.split('T')[0] : '',
        diaSemana: aula.diaSemana || '',
        bloco: aula.bloco?._id || '',
        laboratorio: aula.laboratorio?._id || '',
        disciplina: aula.disciplina?._id || '',
        professor: aula.professor?._id || '',
        curso: aula.curso?._id || '',
        observacoes: aula.observacoes || '',
        ativo: aula.ativo !== undefined ? aula.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        semestre: '',
        data: '',
        diaSemana: '',
        bloco: '',
        laboratorio: '',
        disciplina: '',
        professor: '',
        curso: '',
        observacoes: '',
        ativo: true,
      });
    }
    setDialogOpen(true);
  };

  const fecharDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.semestre.trim()) {
      novosErros.semestre = 'Semestre é obrigatório';
    }
    
    if (!formData.data) {
      novosErros.data = 'Data é obrigatória';
    }
    
    if (formData.diaSemana === '') {
      novosErros.diaSemana = 'Dia da semana é obrigatório';
    }
    
    if (!formData.bloco) {
      novosErros.bloco = 'Bloco de horário é obrigatório';
    }
    
    if (!formData.laboratorio) {
      novosErros.laboratorio = 'Laboratório é obrigatório';
    }
    
    if (!formData.disciplina) {
      novosErros.disciplina = 'Disciplina é obrigatória';
    }
    
    if (!formData.professor) {
      novosErros.professor = 'Professor é obrigatório';
    }
    
    if (!formData.curso) {
      novosErros.curso = 'Curso é obrigatório';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarAula = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await aulasService.atualizar(editingId, formData);
        mostrarSnackbar('Aula atualizada com sucesso');
      } else {
        await aulasService.criar(formData);
        mostrarSnackbar('Aula criada com sucesso');
      }
      fecharDialog();
      carregarDados();
    } catch (error) {
      // Tratamento específico para conflitos (erro 409)
      if (error.response?.status === 409) {
        const message = error.response.data?.message || 'Conflito de horário detectado';
        mostrarSnackbar(message, 'error');
      } else {
        const message = error.response?.data?.message || 'Erro ao salvar aula';
        mostrarSnackbar(message, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const removerAula = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta aula?')) {
      try {
        await aulasService.remover(id);
        mostrarSnackbar('Aula removida com sucesso');
        carregarDados();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover aula';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const aulasFiltradas = aulas.filter((aula) =>
    Object.values(aula).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(subValue =>
          String(subValue).toLowerCase().includes(filtro.toLowerCase())
        );
      }
      return String(value).toLowerCase().includes(filtro.toLowerCase());
    })
  );

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirDialog()}
            disabled={!dadosCarregados}
          >
            Nova Aula
          </Button>

          <TextField
            size="small"
            placeholder="Filtrar aulas..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ flexGrow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Dia</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Laboratório</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aulasFiltradas.map((aula) => (
              <TableRow key={aula._id}>
                <TableCell>{formatarData(aula.data)}</TableCell>
                <TableCell>{obterNomeDiaSemana(aula.diaSemana)}</TableCell>
                <TableCell>
                  {aula.bloco ? `${aula.bloco.inicio} - ${aula.bloco.fim} (${aula.bloco.turno})` : ''}
                </TableCell>
                <TableCell>{aula.laboratorio?.nome}</TableCell>
                <TableCell>{aula.disciplina?.nome}</TableCell>
                <TableCell>{aula.professor?.nome}</TableCell>
                <TableCell>
                  <Typography color={aula.ativo ? 'success.main' : 'error.main'}>
                    {aula.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(aula)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerAula(aula._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={fecharDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Aula' : 'Nova Aula'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Semestre *"
              value={formData.semestre}
              onChange={(e) => {
                setFormData({ ...formData, semestre: e.target.value });
                if (errors.semestre) setErrors({ ...errors, semestre: '' });
              }}
              error={!!errors.semestre}
              helperText={errors.semestre}
              fullWidth
              required
              placeholder="Ex: 2025-2"
            />
            
            <TextField
              label="Data *"
              type="date"
              value={formData.data}
              onChange={(e) => {
                const dataValue = e.target.value;
                let diaSemana = formData.diaSemana;
                
                // Calcular dia da semana automaticamente se data válida
                if (dataValue) {
                  const data = new Date(dataValue + 'T00:00:00');
                  diaSemana = data.getDay();
                }
                
                setFormData({ 
                  ...formData, 
                  data: dataValue,
                  diaSemana: diaSemana
                });
                if (errors.data) setErrors({ ...errors, data: '' });
              }}
              error={!!errors.data}
              helperText={errors.data}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth error={!!errors.diaSemana}>
              <InputLabel>Dia da Semana * (Calculado automaticamente)</InputLabel>
              <Select
                value={formData.diaSemana}
                onChange={(e) => {
                  setFormData({ ...formData, diaSemana: e.target.value });
                  if (errors.diaSemana) setErrors({ ...errors, diaSemana: '' });
                }}
                label="Dia da Semana * (Calculado automaticamente)"
                disabled
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia.value} value={dia.value}>
                    {dia.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.diaSemana && <FormHelperText>{errors.diaSemana}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.bloco}>
              <InputLabel>Bloco de Horário *</InputLabel>
              <Select
                value={formData.bloco}
                onChange={(e) => {
                  setFormData({ ...formData, bloco: e.target.value });
                  if (errors.bloco) setErrors({ ...errors, bloco: '' });
                }}
                label="Bloco de Horário *"
              >
                {blocos.map((bloco) => (
                  <MenuItem key={bloco._id} value={bloco._id}>
                    {`${bloco.inicio} - ${bloco.fim} (${bloco.turno})`}
                  </MenuItem>
                ))}
              </Select>
              {errors.bloco && <FormHelperText>{errors.bloco}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.laboratorio}>
              <InputLabel>Laboratório *</InputLabel>
              <Select
                value={formData.laboratorio}
                onChange={(e) => {
                  setFormData({ ...formData, laboratorio: e.target.value });
                  if (errors.laboratorio) setErrors({ ...errors, laboratorio: '' });
                }}
                label="Laboratório *"
              >
                {laboratorios.map((lab) => (
                  <MenuItem key={lab._id} value={lab._id}>
                    {`${lab.nome} (Cap: ${lab.capacidade})`}
                  </MenuItem>
                ))}
              </Select>
              {errors.laboratorio && <FormHelperText>{errors.laboratorio}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.curso}>
              <InputLabel>Curso *</InputLabel>
              <Select
                value={formData.curso}
                onChange={(e) => {
                  setFormData({ ...formData, curso: e.target.value });
                  if (errors.curso) setErrors({ ...errors, curso: '' });
                }}
                label="Curso *"
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.curso && <FormHelperText>{errors.curso}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.disciplina}>
              <InputLabel>Disciplina *</InputLabel>
              <Select
                value={formData.disciplina}
                onChange={(e) => {
                  setFormData({ ...formData, disciplina: e.target.value });
                  if (errors.disciplina) setErrors({ ...errors, disciplina: '' });
                }}
                label="Disciplina *"
              >
                {disciplinas.map((disciplina) => (
                  <MenuItem key={disciplina._id} value={disciplina._id}>
                    {disciplina.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.disciplina && <FormHelperText>{errors.disciplina}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.professor}>
              <InputLabel>Professor *</InputLabel>
              <Select
                value={formData.professor}
                onChange={(e) => {
                  setFormData({ ...formData, professor: e.target.value });
                  if (errors.professor) setErrors({ ...errors, professor: '' });
                }}
                label="Professor *"
              >
                {professores.map((professor) => (
                  <MenuItem key={professor._id} value={professor._id}>
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.professor && <FormHelperText>{errors.professor}</FormHelperText>}
            </FormControl>

            <TextField
              label="Observações"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Status:</Typography>
              <Switch
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                color="primary"
              />
              <Typography color={formData.ativo ? 'success.main' : 'error.main'}>
                {formData.ativo ? 'Ativo' : 'Inativo'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog} disabled={saving}>Cancelar</Button>
          <Button 
            onClick={salvarAula} 
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Salvando...' : (editingId ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Aulas;