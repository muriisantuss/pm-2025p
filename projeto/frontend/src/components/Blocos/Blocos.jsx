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
import { blocosService } from '../../services/api';
import { tratarErroAPI } from '../../utils/validation';

const Blocos = () => {
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    turno: '',
    diaSemana: '',
    inicio: '',
    fim: '',
    ordem: '',
  });

  const turnos = ['Manhã', 'Tarde', 'Noite'];
  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
  ];

  const carregarBlocos = async () => {
    setLoading(true);
    try {
      const response = await blocosService.listar();
      setBlocos(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar blocos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const abrirDialog = (bloco = null) => {
    setErrors({});
    if (bloco) {
      setEditingId(bloco._id);
      setFormData({
        turno: bloco.turno || '',
        diaSemana: bloco.diaSemana !== undefined ? bloco.diaSemana : '',
        inicio: bloco.inicio || '',
        fim: bloco.fim || '',
        ordem: bloco.ordem || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        turno: '',
        diaSemana: '',
        inicio: '',
        fim: '',
        ordem: '',
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
    
    if (!formData.turno) {
      novosErros.turno = 'Turno é obrigatório';
    }
    
    if (formData.diaSemana === '') {
      novosErros.diaSemana = 'Dia da semana é obrigatório';
    }
    
    if (!formData.inicio) {
      novosErros.inicio = 'Horário de início é obrigatório';
    }
    
    if (!formData.fim) {
      novosErros.fim = 'Horário de fim é obrigatório';
    }
    
    if (!formData.ordem || formData.ordem <= 0) {
      novosErros.ordem = 'Ordem deve ser maior que zero';
    }
    
    if (formData.inicio && formData.fim && formData.inicio >= formData.fim) {
      novosErros.fim = 'Horário de fim deve ser posterior ao início';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarBloco = async () => {
    if (!validarFormulario()) {
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await blocosService.atualizar(editingId, formData);
        mostrarSnackbar('Bloco atualizado com sucesso');
      } else {
        await blocosService.criar(formData);
        mostrarSnackbar('Bloco criado com sucesso');
      }
      fecharDialog();
      carregarBlocos();
    } catch (error) {
      const message = tratarErroAPI(error);
      mostrarSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removerBloco = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este bloco?')) {
      try {
        await blocosService.remover(id);
        mostrarSnackbar('Bloco removido com sucesso');
        carregarBlocos();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover bloco';
        mostrarSnackbar(message, 'error');
      }
    }
  };

  const blocosFiltrados = blocos.filter((bloco) =>
    Object.values(bloco).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  const obterNomeDia = (dia) => {
    const diaObj = diasSemana.find(d => d.value === dia);
    return diaObj ? diaObj.label : 'N/A';
  };

  useEffect(() => {
    carregarBlocos();
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
            Novo Bloco
          </Button>
          
          <TextField
            size="small"
            placeholder="Filtrar blocos..."
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
              <TableCell>Turno</TableCell>
              <TableCell>Dia</TableCell>
              <TableCell>Início</TableCell>
              <TableCell>Fim</TableCell>
              <TableCell>Ordem</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocosFiltrados.map((bloco) => (
              <TableRow key={bloco._id}>
                <TableCell>{bloco.turno}</TableCell>
                <TableCell>{obterNomeDia(bloco.diaSemana)}</TableCell>
                <TableCell>{bloco.inicio}</TableCell>
                <TableCell>{bloco.fim}</TableCell>
                <TableCell>{bloco.ordem}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => abrirDialog(bloco)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removerBloco(bloco._id)}
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
          {editingId ? 'Editar Bloco' : 'Novo Bloco'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth required error={!!errors.turno}>
              <InputLabel>Turno *</InputLabel>
              <Select
                value={formData.turno}
                onChange={(e) => {
                  setFormData({ ...formData, turno: e.target.value });
                  if (errors.turno) setErrors({ ...errors, turno: '' });
                }}
                label="Turno *"
              >
                {turnos.map((turno) => (
                  <MenuItem key={turno} value={turno}>
                    {turno}
                  </MenuItem>
                ))}
              </Select>
              {errors.turno && <FormHelperText>{errors.turno}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth required error={!!errors.diaSemana}>
              <InputLabel>Dia da Semana *</InputLabel>
              <Select
                value={formData.diaSemana}
                onChange={(e) => {
                  setFormData({ ...formData, diaSemana: e.target.value });
                  if (errors.diaSemana) setErrors({ ...errors, diaSemana: '' });
                }}
                label="Dia da Semana *"
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia.value} value={dia.value}>
                    {dia.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.diaSemana && <FormHelperText>{errors.diaSemana}</FormHelperText>}
            </FormControl>

            <TextField
              label="Início *"
              type="time"
              value={formData.inicio}
              onChange={(e) => {
                setFormData({ ...formData, inicio: e.target.value });
                if (errors.inicio) setErrors({ ...errors, inicio: '' });
              }}
              error={!!errors.inicio}
              helperText={errors.inicio}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Fim *"
              type="time"
              value={formData.fim}
              onChange={(e) => {
                setFormData({ ...formData, fim: e.target.value });
                if (errors.fim) setErrors({ ...errors, fim: '' });
              }}
              error={!!errors.fim}
              helperText={errors.fim}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              label="Ordem *"
              type="number"
              value={formData.ordem}
              onChange={(e) => {
                setFormData({ ...formData, ordem: e.target.value });
                if (errors.ordem) setErrors({ ...errors, ordem: '' });
              }}
              error={!!errors.ordem}
              helperText={errors.ordem}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog} disabled={saving}>Cancelar</Button>
          <Button 
            onClick={salvarBloco} 
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

export default Blocos;