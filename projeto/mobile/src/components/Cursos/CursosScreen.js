import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import {
  FAB,
  Searchbar,
  Card,
  Title,
  Paragraph,
  IconButton,
  Snackbar,
  Portal,
  Dialog,
  Button,
  TextInput,
  ActivityIndicator,
  Switch,
  Text,
  Chip,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { cursosService, instituicoesService } from '../../services/api';

/**
 * Tela de gerenciamento de cursos
 */
const CursosScreen = () => {
  const [cursos, setCursos] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    turnos: '',
    instituicao: '',
    ativo: true,
  });

  const turnosDisponiveis = [
    'Matutino',
    'Vespertino', 
    'Noturno',
    'Integral'
  ];

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [cursosResponse, instituicoesResponse] = await Promise.all([
        cursosService.listar(),
        instituicoesService.listar()
      ]);
      setCursos(cursosResponse.data);
      setInstituicoes(instituicoesResponse.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.nome.trim()) {
      novosErros.nome = true;
    }
    
    if (!formData.instituicao) {
      novosErros.instituicao = true;
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const abrirDialog = (curso = null) => {
    setErrors({});
    if (curso) {
      setEditingId(curso._id);
      setFormData({
        nome: curso.nome || '',
        turnos: curso.turnos || '',
        instituicao: curso.instituicao?._id || '',
        ativo: curso.ativo !== undefined ? curso.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        turnos: '',
        instituicao: '',
        ativo: true,
      });
    }
    setDialogVisible(true);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
  };

  const salvarCurso = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
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
      carregarDados();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar curso';
      mostrarSnackbar(message);
    } finally {
      setSaving(false);
    }
  };

  const removerCurso = (id) => {
    const confirmarRemocao = async () => {
      try {
        await cursosService.remover(id);
        mostrarSnackbar('Curso removido com sucesso');
        await carregarDados();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover curso';
        mostrarSnackbar(message);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja remover este curso?')) {
        confirmarRemocao();
      }
    } else {
      Alert.alert(
        'Confirmar Remoção',
        'Tem certeza que deseja remover este curso?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: confirmarRemocao,
          },
        ]
      );
    }
  };

  const cursosFiltrados = cursos.filter((curso) =>
    Object.values(curso).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Searchbar
          placeholder="Filtrar cursos..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {cursosFiltrados.map((curso) => (
          <Card key={curso._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{curso.nome}</Title>
                  <Paragraph>Turnos: {curso.turnos}</Paragraph>
                  <Paragraph>Instituição: {curso.instituicao?.nome || 'N/A'}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: curso.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {curso.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(curso)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerCurso(curso._id)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => abrirDialog()}
        animated={Platform.OS !== 'web'}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Curso' : 'Novo Curso'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <TextInput
                label="Nome *"
                value={formData.nome}
                onChangeText={(text) => {
                  setFormData({ ...formData, nome: text });
                  if (errors.nome) setErrors({ ...errors, nome: false });
                }}
                mode="outlined"
                error={errors.nome}
                style={{ marginBottom: 12 }}
              />
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, color: errors.turnos ? '#d32f2f' : '#666' }}>Turnos</Text>
                <Picker
                  selectedValue={formData.turnos}
                  onValueChange={(value) => setFormData({ ...formData, turnos: value })}
                  style={{ backgroundColor: '#f5f5f5', borderRadius: 4 }}
                >
                  <Picker.Item label="Selecione um turno" value="" />
                  {turnosDisponiveis.map((turno) => (
                    <Picker.Item key={turno} label={turno} value={turno} />
                  ))}
                </Picker>
              </View>
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, color: errors.instituicao ? '#d32f2f' : '#666' }}>Instituição *</Text>
                <Picker
                  selectedValue={formData.instituicao}
                  onValueChange={(value) => {
                    setFormData({ ...formData, instituicao: value });
                    if (errors.instituicao) setErrors({ ...errors, instituicao: false });
                  }}
                  style={{ 
                    backgroundColor: errors.instituicao ? '#ffebee' : '#f5f5f5', 
                    borderRadius: 4,
                    borderWidth: errors.instituicao ? 1 : 0,
                    borderColor: '#d32f2f'
                  }}
                >
                  <Picker.Item label="Selecione uma instituição" value="" />
                  {instituicoes.map((inst) => (
                    <Picker.Item key={inst._id} label={inst.nome} value={inst._id} />
                  ))}
                </Picker>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text>Ativo: </Text>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) => setFormData({ ...formData, ativo: value })}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog} disabled={saving}>Cancelar</Button>
            <Button 
              onPress={salvarCurso} 
              mode="contained"
              disabled={saving}
              loading={saving}
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default CursosScreen;