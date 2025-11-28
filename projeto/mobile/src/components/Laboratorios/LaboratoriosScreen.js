import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
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
} from 'react-native-paper';
import { laboratoriosService } from '../../services/api';

/**
 * Tela de gerenciamento de laboratórios
 */
const LaboratoriosScreen = () => {
  const [laboratorios, setLaboratorios] = useState([]);
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
    capacidade: '',
    localizacao: '',
  });

  const carregarLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await laboratoriosService.listar();
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar laboratórios');
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
    
    if (!formData.capacidade.trim() || isNaN(parseInt(formData.capacidade))) {
      novosErros.capacidade = true;
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const abrirDialog = (laboratorio = null) => {
    setErrors({});
    if (laboratorio) {
      setEditingId(laboratorio._id);
      setFormData({
        nome: laboratorio.nome || '',
        capacidade: String(laboratorio.capacidade || ''),
        localizacao: laboratorio.localizacao || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        capacidade: '',
        localizacao: '',
      });
    }
    setDialogVisible(true);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
  };

  const salvarLaboratorio = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
      return;
    }
    
    setSaving(true);
    try {
      const dados = {
        nome: formData.nome,
        capacidade: parseInt(formData.capacidade),
        localizacao: formData.localizacao,
      };
      
      if (editingId) {
        await laboratoriosService.atualizar(editingId, dados);
        mostrarSnackbar('Laboratório atualizado com sucesso');
      } else {
        await laboratoriosService.criar(dados);
        mostrarSnackbar('Laboratório criado com sucesso');
      }
      fecharDialog();
      carregarLaboratorios();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar laboratório';
      mostrarSnackbar(message);
    } finally {
      setSaving(false);
    }
  };

  const removerLaboratorio = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este laboratório?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await laboratoriosService.remover(id);
              mostrarSnackbar('Laboratório removido com sucesso');
              await carregarLaboratorios(); // Aguardar recarregamento
            } catch (error) {
              const message = error.response?.data?.message || 'Erro ao remover laboratório';
              mostrarSnackbar(message);
            }
          },
        },
      ]
    );
  };

  const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
    Object.values(laboratorio).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarLaboratorios();
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
          placeholder="Filtrar laboratórios..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {laboratoriosFiltrados.map((laboratorio) => (
          <Card key={laboratorio._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{laboratorio.nome}</Title>
                  <Paragraph>Capacidade: {laboratorio.capacidade} pessoas</Paragraph>
                  {laboratorio.localizacao && <Paragraph>Localização: {laboratorio.localizacao}</Paragraph>}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(laboratorio)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerLaboratorio(laboratorio._id)}
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
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={fecharDialog}>
          <Dialog.Title>
            {editingId ? 'Editar Laboratório' : 'Novo Laboratório'}
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
                label="Capacidade *"
                value={formData.capacidade}
                onChangeText={(text) => {
                  setFormData({ ...formData, capacidade: text });
                  if (errors.capacidade) setErrors({ ...errors, capacidade: false });
                }}
                mode="outlined"
                error={errors.capacidade}
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
                placeholder="Número de pessoas"
              />
              <TextInput
                label="Localização"
                value={formData.localizacao}
                onChangeText={(text) => setFormData({ ...formData, localizacao: text })}
                mode="outlined"
                style={{ marginBottom: 12 }}
                placeholder="Ex: Bloco A, Sala 101"
              />
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={fecharDialog} disabled={saving}>Cancelar</Button>
            <Button 
              onPress={salvarLaboratorio} 
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

export default LaboratoriosScreen;