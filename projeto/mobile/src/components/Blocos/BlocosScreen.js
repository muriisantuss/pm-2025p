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
import { blocosService } from '../../services/api';

/**
 * Tela de gerenciamento de blocos de horário
 */
const BlocosScreen = () => {
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    turno: '',
    diaSemana: '',
    inicio: '',
    fim: '',
    ordem: '',
  });

  const turnos = [
    { label: 'Manhã', value: 'Manhã' },
    { label: 'Tarde', value: 'Tarde' },
    { label: 'Noite', value: 'Noite' },
  ];

  const diasSemana = [
    { label: 'Domingo', value: 0 },
    { label: 'Segunda-feira', value: 1 },
    { label: 'Terça-feira', value: 2 },
    { label: 'Quarta-feira', value: 3 },
    { label: 'Quinta-feira', value: 4 },
    { label: 'Sexta-feira', value: 5 },
    { label: 'Sábado', value: 6 },
  ];

  const carregarBlocos = async () => {
    setLoading(true);
    try {
      const response = await blocosService.listar();
      setBlocos(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar blocos');
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
    
    if (!formData.turno) {
      novosErros.turno = true;
    }
    
    if (formData.diaSemana === '') {
      novosErros.diaSemana = true;
    }
    
    if (!formData.inicio.trim()) {
      novosErros.inicio = true;
    }
    
    if (!formData.fim.trim()) {
      novosErros.fim = true;
    }
    
    if (!formData.ordem.trim()) {
      novosErros.ordem = true;
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
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
        ordem: String(bloco.ordem || ''),
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
    setDialogVisible(true);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
  };

  const salvarBloco = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
      return;
    }
    
    setSaving(true);
    try {
      const dados = {
        turno: formData.turno,
        diaSemana: parseInt(formData.diaSemana),
        inicio: formData.inicio,
        fim: formData.fim,
        ordem: parseInt(formData.ordem),
      };
      
      if (editingId) {
        await blocosService.atualizar(editingId, dados);
        mostrarSnackbar('Bloco atualizado com sucesso');
      } else {
        await blocosService.criar(dados);
        mostrarSnackbar('Bloco criado com sucesso');
      }
      fecharDialog();
      carregarBlocos();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar bloco';
      mostrarSnackbar(message);
    } finally {
      setSaving(false);
    }
  };

  const removerBloco = (id) => {
    const confirmarRemocao = async () => {
      try {
        await blocosService.remover(id);
        mostrarSnackbar('Bloco removido com sucesso');
        await carregarBlocos();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover bloco';
        mostrarSnackbar(message);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja remover este bloco?')) {
        confirmarRemocao();
      }
    } else {
      Alert.alert(
        'Confirmar Remoção',
        'Tem certeza que deseja remover este bloco?',
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

  const getDiaSemanaTexto = (diaSemana) => {
    const dia = diasSemana.find(d => d.value === diaSemana);
    return dia ? dia.label : 'N/A';
  };

  const blocosFiltrados = blocos.filter((bloco) =>
    Object.values(bloco).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarBlocos();
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
          placeholder="Filtrar blocos..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {blocosFiltrados.map((bloco) => (
          <Card key={bloco._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{bloco.turno} - {getDiaSemanaTexto(bloco.diaSemana)}</Title>
                  <Paragraph>Horário: {bloco.inicio} às {bloco.fim}</Paragraph>
                  <Paragraph>Ordem: {bloco.ordem}</Paragraph>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(bloco)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerBloco(bloco._id)}
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
            {editingId ? 'Editar Bloco' : 'Novo Bloco'}
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, color: errors.turno ? '#d32f2f' : '#666' }}>Turno *</Text>
                <Picker
                  selectedValue={formData.turno}
                  onValueChange={(value) => {
                    setFormData({ ...formData, turno: value });
                    if (errors.turno) setErrors({ ...errors, turno: false });
                  }}
                  style={{ 
                    backgroundColor: errors.turno ? '#ffebee' : '#f5f5f5', 
                    borderRadius: 4,
                    borderWidth: errors.turno ? 1 : 0,
                    borderColor: '#d32f2f'
                  }}
                >
                  <Picker.Item label="Selecione um turno" value="" />
                  {turnos.map((turno) => (
                    <Picker.Item key={turno.value} label={turno.label} value={turno.value} />
                  ))}
                </Picker>
              </View>
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 8, color: errors.diaSemana ? '#d32f2f' : '#666' }}>Dia da Semana *</Text>
                <Picker
                  selectedValue={formData.diaSemana}
                  onValueChange={(value) => {
                    setFormData({ ...formData, diaSemana: value });
                    if (errors.diaSemana) setErrors({ ...errors, diaSemana: false });
                  }}
                  style={{ 
                    backgroundColor: errors.diaSemana ? '#ffebee' : '#f5f5f5', 
                    borderRadius: 4,
                    borderWidth: errors.diaSemana ? 1 : 0,
                    borderColor: '#d32f2f'
                  }}
                >
                  <Picker.Item label="Selecione um dia" value="" />
                  {diasSemana.map((dia) => (
                    <Picker.Item key={dia.value} label={dia.label} value={dia.value} />
                  ))}
                </Picker>
              </View>
              
              <TextInput
                label="Início *"
                value={formData.inicio}
                onChangeText={(text) => {
                  setFormData({ ...formData, inicio: text });
                  if (errors.inicio) setErrors({ ...errors, inicio: false });
                }}
                mode="outlined"
                error={errors.inicio}
                style={{ marginBottom: 12 }}
                placeholder="Ex: 08:00"
              />
              <TextInput
                label="Fim *"
                value={formData.fim}
                onChangeText={(text) => {
                  setFormData({ ...formData, fim: text });
                  if (errors.fim) setErrors({ ...errors, fim: false });
                }}
                mode="outlined"
                error={errors.fim}
                style={{ marginBottom: 12 }}
                placeholder="Ex: 10:00"
              />
              <TextInput
                label="Ordem *"
                value={formData.ordem}
                onChangeText={(text) => {
                  setFormData({ ...formData, ordem: text });
                  if (errors.ordem) setErrors({ ...errors, ordem: false });
                }}
                mode="outlined"
                error={errors.ordem}
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
                placeholder="1, 2, 3..."
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog} disabled={saving}>Cancelar</Button>
            <Button 
              onPress={salvarBloco} 
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

export default BlocosScreen;