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
  Text,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { disciplinasService, cursosService, professoresService } from '../../services/api';

/**
 * Tela de gerenciamento de disciplinas
 */
const DisciplinasScreen = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
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
    cargaHoraria: '',
    curso: '',
    professor: '',
  });

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [disciplinasResponse, cursosResponse, professoresResponse] = await Promise.all([
        disciplinasService.listar(),
        cursosService.listar(),
        professoresService.listar()
      ]);
      setDisciplinas(disciplinasResponse.data);
      setCursos(cursosResponse.data);
      setProfessores(professoresResponse.data);
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
    
    if (!formData.cargaHoraria.trim() || isNaN(parseInt(formData.cargaHoraria))) {
      novosErros.cargaHoraria = true;
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const abrirDialog = (disciplina = null) => {
    setErrors({});
    if (disciplina) {
      setEditingId(disciplina._id);
      setFormData({
        nome: disciplina.nome || '',
        cargaHoraria: String(disciplina.cargaHoraria || ''),
        curso: disciplina.curso?._id || '',
        professor: disciplina.professor?._id || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        cargaHoraria: '',
        curso: '',
        professor: '',
      });
    }
    setDialogVisible(true);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
  };

  const salvarDisciplina = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
      return;
    }
    
    setSaving(true);
    try {
      const dados = {
        nome: formData.nome,
        cargaHoraria: parseInt(formData.cargaHoraria),
        curso: formData.curso || null,
        professor: formData.professor || null,
      };
      
      if (editingId) {
        await disciplinasService.atualizar(editingId, dados);
        mostrarSnackbar('Disciplina atualizada com sucesso');
      } else {
        await disciplinasService.criar(dados);
        mostrarSnackbar('Disciplina criada com sucesso');
      }
      fecharDialog();
      carregarDados();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar disciplina';
      mostrarSnackbar(message);
    } finally {
      setSaving(false);
    }
  };

  const removerDisciplina = (id) => {
    const confirmarRemocao = async () => {
      try {
        await disciplinasService.remover(id);
        mostrarSnackbar('Disciplina removida com sucesso');
        await carregarDados();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover disciplina';
        mostrarSnackbar(message);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja remover esta disciplina?')) {
        confirmarRemocao();
      }
    } else {
      Alert.alert(
        'Confirmar Remoção',
        'Tem certeza que deseja remover esta disciplina?',
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

  const disciplinasFiltradas = disciplinas.filter((disciplina) =>
    Object.values(disciplina).some((value) =>
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
          placeholder="Filtrar disciplinas..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {disciplinasFiltradas.map((disciplina) => (
          <Card key={disciplina._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{disciplina.nome}</Title>
                  <Paragraph>Carga Horária: {disciplina.cargaHoraria}h</Paragraph>
                  <Paragraph>Curso: {disciplina.curso?.nome || 'N/A'}</Paragraph>
                  <Paragraph>Professor: {disciplina.professor?.nome || 'N/A'}</Paragraph>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(disciplina)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerDisciplina(disciplina._id)}
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
            {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
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
              <TextInput
                label="Carga Horária *"
                value={formData.cargaHoraria}
                onChangeText={(text) => {
                  setFormData({ ...formData, cargaHoraria: text });
                  if (errors.cargaHoraria) setErrors({ ...errors, cargaHoraria: false });
                }}
                mode="outlined"
                error={errors.cargaHoraria}
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
                placeholder="Horas"
              />
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, color: '#666' }}>Curso</Text>
                <Picker
                  selectedValue={formData.curso}
                  onValueChange={(value) => setFormData({ ...formData, curso: value })}
                  style={{ backgroundColor: '#f5f5f5', borderRadius: 4 }}
                >
                  <Picker.Item label="Selecione um curso" value="" />
                  {cursos.map((curso) => (
                    <Picker.Item key={curso._id} label={curso.nome} value={curso._id} />
                  ))}
                </Picker>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, color: '#666' }}>Professor</Text>
                <Picker
                  selectedValue={formData.professor}
                  onValueChange={(value) => setFormData({ ...formData, professor: value })}
                  style={{ backgroundColor: '#f5f5f5', borderRadius: 4 }}
                >
                  <Picker.Item label="Selecione um professor" value="" />
                  {professores.map((prof) => (
                    <Picker.Item key={prof._id} label={prof.nome} value={prof._id} />
                  ))}
                </Picker>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog} disabled={saving}>Cancelar</Button>
            <Button 
              onPress={salvarDisciplina} 
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

export default DisciplinasScreen;