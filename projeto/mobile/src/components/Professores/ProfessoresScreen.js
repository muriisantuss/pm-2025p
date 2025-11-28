import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  FAB,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Snackbar,
  Portal,
  Dialog,
  Button,
  TextInput,
  Switch,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { professoresService } from '../../services/api';

/**
 * Tela de gerenciamento de professores
 */
const ProfessoresScreen = () => {
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
      mostrarSnackbar('Erro ao carregar professores');
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
    
    if (!formData.email.trim()) {
      novosErros.email = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = true;
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
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
    setDialogVisible(true);
  };

  const fecharDialog = () => {
    setDialogVisible(false);
    setEditingId(null);
    setErrors({});
  };

  const salvarProfessor = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
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
      const message = error.response?.data?.message || 'Erro ao salvar professor';
      mostrarSnackbar(message);
    } finally {
      setSaving(false);
    }
  };

  const removerProfessor = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este professor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await professoresService.remover(id);
              mostrarSnackbar('Professor removido com sucesso');
              await carregarProfessores(); // Aguardar recarregamento
            } catch (error) {
              const message = error.response?.data?.message || 'Erro ao remover professor';
              mostrarSnackbar(message);
            }
          },
        },
      ]
    );
  };

  const professoresFiltrados = professores.filter((professor) =>
    Object.values(professor).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarProfessores();
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
          placeholder="Filtrar professores..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {professoresFiltrados.map((professor) => (
          <Card key={professor._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{professor.nome}</Title>
                  <Paragraph>Email: {professor.email}</Paragraph>
                  {professor.telefone && <Paragraph>Telefone: {professor.telefone}</Paragraph>}
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: professor.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(professor)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerProfessor(professor._id)}
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
            {editingId ? 'Editar Professor' : 'Novo Professor'}
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
                label="Email *"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
                mode="outlined"
                error={errors.email}
                keyboardType="email-address"
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Telefone"
                value={formData.telefone}
                onChangeText={(text) => setFormData({ ...formData, telefone: text })}
                mode="outlined"
                keyboardType="phone-pad"
                style={{ marginBottom: 12 }}
              />
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
              onPress={salvarProfessor} 
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

export default ProfessoresScreen;