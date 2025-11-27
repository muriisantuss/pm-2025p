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
  Chip,
  OutlinedInput,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { cursosService, instituicoesService } from '../../services/api';
import { tratarErroAPI } from '../../utils/validation';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    turnos: [],
    instituicao: '',
    ativo: true,
  });

  const turnosDisponiveis = ['Manhã', 'Tarde', 'Noite'];

  const carregarCursos = async () => {
    setLoading(true);
    try {
      const response = await cursosService.listar();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar cursos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarInstituicoes = async () => {
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialog = (curso = null) => {
    setErrors({});
    if (curso) {
      setEditingId(curso._id);
      setFormData({
        nome: curso.nome || '',
        turnos: curso.turnos || [],
        instituicao: curso.instituicao?._id || '',
        ativo: curso.ativo !== undefined ? curso.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        turnos: [],
        instituicao: '',
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
    
    if (!formData.instituicao) {
      novosErros.instituicao = 'Instituição é obrigatória';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarCurso = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await cursosService.atualizar(editingId, formData);
        mostrarSnackbar('Curso atualizado com sucesso');
      } else {
        await cursosService.criar(formData);
        mostrarSnackbar('Curso criado com sucesso');
      }
      fecharDialog();
      carregarCursos();
    } catch (error) {
      const message = tratarErroAPI(error);
      mostrarSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removerCurso = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este curso?')) {
      try {
        await cursosService.remover(id);
        mostrarSnackbar('Curso removido com sucesso');
        carregarCursos();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover curso';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const cursosFiltrados = cursos.filter((curso) =>
    Object.values(curso).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarCursos();
    carregarInstituicoes();
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
            Novo Curso
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar cursos..."
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
              <TableCell>Instituição</TableCell>
              <TableCell>Turnos</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursosFiltrados.map((curso) => (
              <TableRow key={curso._id}>
                <TableCell>{curso.nome}</TableCell>
                <TableCell>{curso.instituicao?.nome || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {curso.turnos?.map((turno) => (
                      <Chip key={turno} label={turno} size="small" />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color={curso.ativo ? 'success.main' : 'error.main'}>
                    {curso.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(curso)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerCurso(curso._id)}
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
          {editingId ? 'Editar Curso' : 'Novo Curso'}
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
            
            <FormControl fullWidth required error={!!errors.instituicao}>
              <InputLabel>Instituição *</InputLabel>
              <Select
                value={formData.instituicao}
                onChange={(e) => {
                  setFormData({ ...formData, instituicao: e.target.value });
                  if (errors.instituicao) setErrors({ ...errors, instituicao: '' });
                }}
                label="Instituição *"
              >
                {instituicoes.map((instituicao) => (
                  <MenuItem key={instituicao._id} value={instituicao._id}>
                    {instituicao.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.instituicao && <FormHelperText>{errors.instituicao}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Turnos</InputLabel>
              <Select
                multiple
                value={formData.turnos}
                onChange={(e) => setFormData({ ...formData, turnos: e.target.value })}
                input={<OutlinedInput label="Turnos" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {turnosDisponiveis.map((turno) => (
                  <MenuItem key={turno} value={turno}>
                    {turno}
                  </MenuItem>
                ))}
              </Select>
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
            onClick={salvarCurso} 
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

export default Cursos;