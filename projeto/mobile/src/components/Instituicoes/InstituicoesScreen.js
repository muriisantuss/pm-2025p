import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
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
import { instituicoesService } from '../../services/api';

/**
 * Tela de gerenciamento de instituições
 */
const InstituicoesScreen = () => {
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
    sigla: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    ativo: true,
  });

  const carregarInstituicoes = async () => {
    setLoading(true);
    try {
      const response = await instituicoesService.listar();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar:', error);
      mostrarSnackbar('Erro ao carregar instituições');
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
    
    if (!formData.sigla.trim()) {
      novosErros.sigla = true;
    }
    
    if (!formData.cnpj.trim()) {
      novosErros.cnpj = true;
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const abrirDialog = (instituicao = null) => {
    setErrors({});
    if (instituicao) {
      setEditingId(instituicao._id);
      setFormData({
        nome: instituicao.nome || '',
        sigla: instituicao.sigla || '',
        cnpj: instituicao.cnpj || '',
        email: instituicao.email || '',
        telefone: instituicao.telefone || '',
        endereco: instituicao.endereco || '',
        ativo: instituicao.ativo !== undefined ? instituicao.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        sigla: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
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

  const salvarInstituicao = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await instituicoesService.atualizar(editingId, formData);
        mostrarSnackbar('Instituição atualizada com sucesso');
      } else {
        await instituicoesService.criar(formData);
        mostrarSnackbar('Instituição criada com sucesso');
      }
      fecharDialog();
      carregarInstituicoes();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar instituição';
      mostrarSnackbar(message);
    } finally {
      setSaving(false);
    }
  };

  const removerInstituicao = (id) => {
    const confirmarRemocao = async () => {
      try {
        await instituicoesService.remover(id);
        mostrarSnackbar('Instituição removida com sucesso');
        await carregarInstituicoes();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover instituição';
        mostrarSnackbar(message);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja remover esta instituição?')) {
        confirmarRemocao();
      }
    } else {
      Alert.alert(
        'Confirmar Remoção',
        'Tem certeza que deseja remover esta instituição?',
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

  const instituicoesFiltradas = instituicoes.filter((instituicao) =>
    Object.values(instituicao).some((value) =>
      String(value).toLowerCase().includes(filtro.toLowerCase())
    )
  );

  useEffect(() => {
    carregarInstituicoes();
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
          placeholder="Filtrar instituições..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {instituicoesFiltradas.map((instituicao) => (
          <Card key={instituicao._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{instituicao.nome}</Title>
                  <Paragraph>Sigla: {instituicao.sigla}</Paragraph>
                  <Paragraph>CNPJ: {instituicao.cnpj}</Paragraph>
                  <Paragraph>Email: {instituicao.email}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 8,
                      backgroundColor: instituicao.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {instituicao.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(instituicao)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerInstituicao(instituicao._id)}
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
            {editingId ? 'Editar Instituição' : 'Nova Instituição'}
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
                label="Sigla *"
                value={formData.sigla}
                onChangeText={(text) => {
                  setFormData({ ...formData, sigla: text.toUpperCase() });
                  if (errors.sigla) setErrors({ ...errors, sigla: false });
                }}
                mode="outlined"
                error={errors.sigla}
                maxLength={10}
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="CNPJ *"
                value={formData.cnpj}
                onChangeText={(text) => {
                  setFormData({ ...formData, cnpj: text });
                  if (errors.cnpj) setErrors({ ...errors, cnpj: false });
                }}
                mode="outlined"
                error={errors.cnpj}
                style={{ marginBottom: 12 }}
              />
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                mode="outlined"
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
              <TextInput
                label="Endereço"
                value={formData.endereco}
                onChangeText={(text) => setFormData({ ...formData, endereco: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
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
              onPress={salvarInstituicao} 
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

export default InstituicoesScreen;