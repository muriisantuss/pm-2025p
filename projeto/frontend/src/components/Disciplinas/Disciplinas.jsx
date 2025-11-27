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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { disciplinasService, cursosService, professoresService } from '../../services/api';
import { tratarErroAPI } from '../../utils/validation';

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    cargaHoraria: '',
    curso: '',
    professorResponsavel: '',
    ativo: true,
  });

  const carregarDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinasService.listar();
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar disciplinas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarCursos = async () => {
    try {
      const response = await cursosService.listar();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const carregarProfessores = async () => {
    try {
      const response = await professoresService.listar();
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialog = (disciplina = null) => {
    setErrors({});
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        cargaHoraria: disciplina.cargaHoraria || '',
        curso: disciplina.curso?._id || '',
        professorResponsavel: disciplina.professorResponsavel?._id || '',
        ativo: disciplina.ativo !== undefined ? disciplina.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        cargaHoraria: '',
        curso: '',
        professorResponsavel: '',
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
    
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cargaHoraria || formData.cargaHoraria <= 0) {
      novosErros.cargaHoraria = 'Carga horária deve ser maior que zero';
    }
    
    if (!formData.curso) {
      novosErros.curso = 'Curso é obrigatório';
    }
    
    if (!formData.professorResponsavel) {
      novosErros.professorResponsavel = 'Professor responsável é obrigatório';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarDisciplina = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await disciplinasService.atualizar(editingId, formData);
        mostrarSnackbar('Disciplina atualizada com sucesso');
      } else {
        await disciplinasService.criar(formData);
        mostrarSnackbar('Disciplina criada com sucesso');
      }
      fecharDialog();
      carregarDisciplinas();
    } catch (error) {
      const message = tratarErroAPI(error);
      mostrarSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removerDisciplina = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta disciplina?')) {
      try {
        await disciplinasService.remover(id);
        mostrarSnackbar('Disciplina removida com sucesso');
        carregarDisciplinas();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover disciplina';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const disciplinasFiltradas = disciplinas.filter((disciplina) =>
    Object.values(disciplina).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarDisciplinas();
    carregarCursos();
    carregarProfessores();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirDialog()}
          >
            Nova Disciplina
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar disciplinas..."
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
              <TableCell>Nome</TableCell>
              <TableCell>Carga Horária</TableCell>
              <TableCell>Curso</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplinasFiltradas.map((disciplina) => (
              <TableRow key={disciplina._id}>
                <TableCell>{disciplina.nome}</TableCell>
                <TableCell>{disciplina.cargaHoraria}h</TableCell>
                <TableCell>{disciplina.curso?.nome || 'N/A'}</TableCell>
                <TableCell>{disciplina.professorResponsavel?.nome || 'N/A'}</TableCell>
                <TableCell>
                  <Typography color={disciplina.ativo ? 'success.main' : 'error.main'}>
                    {disciplina.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(disciplina)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerDisciplina(disciplina._id)}
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
          {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome *"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) setErrors({ ...errors, nome: '' });
              }}
              error={!!errors.nome}
              helperText={errors.nome}
              fullWidth
              required
            />
            <TextField
              label="Carga Horária *"
              type="number"
              value={formData.cargaHoraria}
              onChange={(e) => {
                setFormData({ ...formData, cargaHoraria: e.target.value });
                if (errors.cargaHoraria) setErrors({ ...errors, cargaHoraria: '' });
              }}
              error={!!errors.cargaHoraria}
              helperText={errors.cargaHoraria}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            
            <FormControl fullWidth required error={!!errors.curso}>
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

            <FormControl fullWidth required error={!!errors.professorResponsavel}>
              <InputLabel>Professor Responsável *</InputLabel>
              <Select
                value={formData.professorResponsavel}
                onChange={(e) => {
                  setFormData({ ...formData, professorResponsavel: e.target.value });
                  if (errors.professorResponsavel) setErrors({ ...errors, professorResponsavel: '' });
                }}
                label="Professor Responsável *"
              >
                {professores.map((professor) => (
                  <MenuItem key={professor._id} value={professor._id}>
                    {professor.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.professorResponsavel && <FormHelperText>{errors.professorResponsavel}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.value })}
                label="Status"
              >
                <MenuItem value={true}>Ativo</MenuItem>
                <MenuItem value={false}>Inativo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog} disabled={saving}>Cancelar</Button>
          <Button 
            onClick={salvarDisciplina} 
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

export default Disciplinas;