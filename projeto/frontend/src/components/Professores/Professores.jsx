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
import { professoresService } from '../../services/api';
import { validarEmail, formatarTelefone, tratarErroAPI } from '../../utils/validation';

const Professores = () => {
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
    email: '',
    telefone: '',
    ativo: true,
  });

  const carregarProfessores = async () => {
    setLoading(true);
    try {
      const response = await professoresService.listar();
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar professores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialog = (professor = null) => {
    setErrors({});
    if (professor) {
      setEditingId(professor._id);
      setFormData({
        nome: professor.nome || '',
        email: professor.email || '',
        telefone: professor.telefone || '',
        ativo: professor.ativo !== undefined ? professor.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
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
    
    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      novosErros.email = 'Email inválido';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarProfessor = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await professoresService.atualizar(editingId, formData);
        mostrarSnackbar('Professor atualizado com sucesso');
      } else {
        await professoresService.criar(formData);
        mostrarSnackbar('Professor criado com sucesso');
      }
      fecharDialog();
      carregarProfessores();
    } catch (error) {
      const message = tratarErroAPI(error);
      mostrarSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removerProfessor = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este professor?')) {
      try {
        await professoresService.remover(id);
        mostrarSnackbar('Professor removido com sucesso');
        carregarProfessores();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover professor';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const professoresFiltrados = professores.filter((professor) =>
    Object.values(professor).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
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
            Novo Professor
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar professores..."
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
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professoresFiltrados.map((professor) => (
              <TableRow key={professor._id}>
                <TableCell>{professor.nome}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.telefone}</TableCell>
                <TableCell>
                  <Typography color={professor.ativo ? 'success.main' : 'error.main'}>
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(professor)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerProfessor(professor._id)}
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
          {editingId ? 'Editar Professor' : 'Novo Professor'}
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
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            <TextField
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => {
                const valorFormatado = formatarTelefone(e.target.value);
                setFormData({ ...formData, telefone: valorFormatado });
              }}
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
            onClick={salvarProfessor} 
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

export default Professores;