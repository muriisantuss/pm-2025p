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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { laboratoriosService } from '../../services/api';
import { tratarErroAPI } from '../../utils/validation';

const Laboratorios = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    capacidade: '',
    localizacao: '',
    ativo: true,
  });

  const carregarLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar laboratórios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialog = (laboratorio = null) => {
    setErrors({});
    if (laboratorio) {
      setEditingId(laboratorio._id);
      setFormData({
        nome: laboratorio.nome || '',
        capacidade: laboratorio.capacidade || '',
        localizacao: laboratorio.localizacao || '',
        ativo: laboratorio.ativo !== undefined ? laboratorio.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        capacidade: '',
        localizacao: '',
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
    
    if (!formData.capacidade || formData.capacidade <= 0) {
      novosErros.capacidade = 'Capacidade deve ser maior que zero';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarLaboratorio = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await laboratoriosService.atualizar(editingId, formData);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratoriosService.criar(formData);
        mostrarSnackbar('Laboratório criado com sucesso');
      }
      fecharDialog();
      carregarLaboratorios();
    } catch (error) {
      const message = tratarErroAPI(error);
      mostrarSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removerLaboratorio = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este laboratório?')) {
      try {
        await laboratoriosService.remover(id);
        mostrarSnackbar('Laboratório removido com sucesso');
        carregarLaboratorios();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover laboratório';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
    Object.values(laboratorio).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarLaboratorios();
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
            Novo Laboratório
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar laboratórios..."
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
              <TableCell>Capacidade</TableCell>
              <TableCell>Localização</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laboratoriosFiltrados.map((laboratorio) => (
              <TableRow key={laboratorio._id}>
                <TableCell>{laboratorio.nome}</TableCell>
                <TableCell>{laboratorio.capacidade}</TableCell>
                <TableCell>{laboratorio.localizacao}</TableCell>
                <TableCell>
                  <Typography color={laboratorio.ativo ? 'success.main' : 'error.main'}>
                    {laboratorio.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(laboratorio)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerLaboratorio(laboratorio._id)}
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
          {editingId ? 'Editar Laboratório' : 'Novo Laboratório'}
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
              label="Capacidade *"
              type="number"
              value={formData.capacidade}
              onChange={(e) => {
                setFormData({ ...formData, capacidade: e.target.value });
                if (errors.capacidade) setErrors({ ...errors, capacidade: '' });
              }}
              error={!!errors.capacidade}
              helperText={errors.capacidade}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Localização"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              fullWidth
            />
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
            onClick={salvarLaboratorio} 
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

export default Laboratorios;