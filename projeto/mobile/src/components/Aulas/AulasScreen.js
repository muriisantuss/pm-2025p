import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
import { Picker } from '@react-native-picker/picker';
import {
  aulasService,
  cursosService,
  professoresService,
  disciplinasService,
  laboratoriosService,
  blocosService
} from '../../services/api';

/**
 * Tela de gerenciamento de aulas (agendamento)
 */
const AulasScreen = () => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Listas auxiliares para os pickers
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const [formData, setFormData] = useState({
    semestre: '',
    data: '',
    diaSemana: 0,
    bloco: '',
    laboratorio: '',
    disciplina: '',
    professor: '',
    curso: '',
    observacoes: '',
    ativo: true,
  });

  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
  ];

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [aulasRes, cursosRes, professoresRes, disciplinasRes, laboratoriosRes, blocosRes] = await Promise.all([
        aulasService.listar(),
        cursosService.listar(),
        professoresService.listar(),
        disciplinasService.listar(),
        laboratoriosService.listar(),
        blocosService.listar(),
      ]);

      setAulas(aulasRes.data);
      setCursos(cursosRes.data);
      setProfessores(professoresRes.data);
      setDisciplinas(disciplinasRes.data);
      setLaboratorios(laboratoriosRes.data);
      setBlocos(blocosRes.data);
      setDadosCarregados(true);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarSnackbar('Erro ao carregar dados de cadastro. Verifique sua conexão.');
      setDadosCarregados(false);
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const obterNomeDiaSemana = (diaSemana) => {
    const dia = diasSemana.find(d => d.value === diaSemana);
    return dia ? dia.label : '';
  };

  const formatarDiaSemana = (numero) => {
    const dia = diasSemana.find(d => d.value === numero);
    return dia ? dia.label : '';
  };

  const formatarDataMascara = (texto) => {
    // Remove caracteres não numéricos
    const numeros = texto.replace(/\D/g, '');

    // Aplica máscara DD/MM/AAAA
    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else {
      return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
    }
  };

  const converterDataParaISO = (dataMascara) => {
    // Converte DD/MM/AAAA para AAAA-MM-DD
    const partes = dataMascara.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
    return dataMascara;
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.semestre.trim()) {
      novosErros.semestre = true;
    }

    if (!formData.data.trim()) {
      novosErros.data = true;
    }

    if (!formData.bloco) {
      novosErros.bloco = true;
    }

    if (!formData.laboratorio) {
      novosErros.laboratorio = true;
    }

    if (!formData.disciplina) {
      novosErros.disciplina = true;
    }

    if (!formData.professor) {
      novosErros.professor = true;
    }

    if (!formData.curso) {
      novosErros.curso = true;
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const abrirDialog = (aula = null) => {
    setErrors({});
    if (aula) {
      setEditingId(aula._id);
      setFormData({
        semestre: aula.semestre || '',
        data: aula.data ? aula.data.split('T')[0] : '',
        diaSemana: aula.diaSemana || 0,
        bloco: aula.bloco?._id || '',
        laboratorio: aula.laboratorio?._id || '',
        disciplina: aula.disciplina?._id || '',
        professor: aula.professor?._id || '',
        curso: aula.curso?._id || '',
        observacoes: aula.observacoes || '',
        ativo: aula.ativo !== undefined ? aula.ativo : true,
      });
    } else {
      setEditingId(null);
      setFormData({
        semestre: '',
        data: '',
        diaSemana: 0,
        bloco: '',
        laboratorio: '',
        disciplina: '',
        professor: '',
        curso: '',
        observacoes: '',
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

  const salvarAula = async () => {
    if (!validarFormulario()) {
      mostrarSnackbar('Preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      // Preparar dados para envio
      const dadosEnvio = { ...formData };

      // Converter data de DD/MM/AAAA para AAAA-MM-DD se necessário
      if (dadosEnvio.data && dadosEnvio.data.includes('/')) {
        dadosEnvio.data = converterDataParaISO(dadosEnvio.data);
      }

      if (editingId) {
        await aulasService.atualizar(editingId, dadosEnvio);
        mostrarSnackbar('Aula atualizada com sucesso');
      } else {
        await aulasService.criar(dadosEnvio);
        mostrarSnackbar('Aula criada com sucesso');
      }
      fecharDialog();
      carregarDados();
    } catch (error) {
      // Tratamento específico para conflitos (erro 409)
      if (error.response?.status === 409) {
        const message = error.response.data?.message || 'Conflito de horário detectado';
        mostrarSnackbar(message);
      } else {
        const message = error.response?.data?.message || 'Erro ao salvar aula';
        mostrarSnackbar(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const removerAula = (id) => {
    const confirmarRemocao = async () => {
      try {
        await aulasService.remover(id);
        mostrarSnackbar('Aula removida com sucesso');
        await carregarDados();
      } catch (error) {
        const message = error.response?.data?.message || 'Erro ao remover aula';
        mostrarSnackbar(message);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja remover esta aula?')) {
        confirmarRemocao();
      }
    } else {
      Alert.alert(
        'Confirmar Remoção',
        'Tem certeza que deseja remover esta aula?',
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

  const aulasFiltradas = aulas.filter((aula) =>
    Object.values(aula).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(subValue =>
          String(subValue).toLowerCase().includes(filtro.toLowerCase())
        );
      }
      return String(value).toLowerCase().includes(filtro.toLowerCase());
    })
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
          placeholder="Filtrar aulas..."
          onChangeText={setFiltro}
          value={filtro}
          style={{ marginBottom: 16 }}
        />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {aulasFiltradas.map((aula) => (
          <Card key={aula._id} style={{ marginBottom: 12, backgroundColor: '#fff' }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Title>{formatarData(aula.data)} - {formatarDiaSemana(aula.diaSemana)}</Title>
                  <Paragraph>
                    Horário: {aula.bloco ? `${aula.bloco.inicio} - ${aula.bloco.fim} (${aula.bloco.turno})` : ''}
                  </Paragraph>
                  <Paragraph>Laboratório: {aula.laboratorio?.nome}</Paragraph>
                  <Paragraph>Disciplina: {aula.disciplina?.nome}</Paragraph>
                  <Paragraph>Professor: {aula.professor?.nome}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: 8,
                      backgroundColor: aula.ativo ? '#e8f5e8' : '#ffeaea'
                    }}
                  >
                    {aula.ativo ? 'Ativo' : 'Inativo'}
                  </Chip>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton
                    icon="pencil"
                    mode="contained"
                    onPress={() => abrirDialog(aula)}
                  />
                  <IconButton
                    icon="delete"
                    mode="contained"
                    iconColor="#d32f2f"
                    onPress={() => removerAula(aula._id)}
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
        disabled={!dadosCarregados}
        animated={Platform.OS !== 'web'}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={fecharDialog} style={{ maxHeight: '80%' }}>
          <Dialog.Title>
            {editingId ? 'Editar Aula' : 'Nova Aula'}
          </Dialog.Title>

          <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10 }}>

              <TextInput
                label="Semestre *"
                value={formData.semestre}
                onChangeText={(text) => {
                  setFormData({ ...formData, semestre: text });
                  if (errors.semestre) setErrors({ ...errors, semestre: false });
                }}
                mode="outlined"
                error={errors.semestre}
                placeholder="Ex: 2025-2"
                style={{ marginBottom: 12 }}
              />

              <TextInput
                label="Data *"
                value={formData.data}
                onChangeText={(text) => {
                  const textoFormatado = formatarDataMascara(text);
                  let diaSemana = formData.diaSemana;
                  if (textoFormatado.length === 10) {
                    const dataISO = converterDataParaISO(textoFormatado);
                    const data = new Date(dataISO + 'T00:00:00');
                    if (!isNaN(data.getTime())) {
                      diaSemana = data.getDay();
                    }
                  }
                  setFormData({
                    ...formData,
                    data: textoFormatado,
                    diaSemana: diaSemana
                  });
                  if (errors.data) setErrors({ ...errors, data: false });
                }}
                mode="outlined"
                error={errors.data}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                style={{ marginBottom: 12 }}
              />

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>Dia da Semana (Automático)</Text>
                <View style={{
                  backgroundColor: '#e0e0e0',
                  padding: 12,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#bdbdbd'
                }}>
                  <Text style={{ fontSize: 16, color: '#424242' }}>{formatarDiaSemana(formData.diaSemana)}</Text>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, fontSize: 14 }}>Bloco de Horário *</Text>
                <View style={{ borderWidth: 1, borderColor: errors.bloco ? '#B00020' : '#999', borderRadius: 4, backgroundColor: '#fff' }}>
                  <Picker
                    selectedValue={formData.bloco}
                    onValueChange={(value) => setFormData({ ...formData, bloco: value })}
                  >
                    <Picker.Item label="Selecione..." value="" color="#999" />
                    {blocos.map((b) => (
                      <Picker.Item key={b._id} label={`${b.inicio} - ${b.fim} (${b.turno})`} value={b._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, fontSize: 14 }}>Laboratório *</Text>
                <View style={{ borderWidth: 1, borderColor: errors.laboratorio ? '#B00020' : '#999', borderRadius: 4, backgroundColor: '#fff' }}>
                  <Picker
                    selectedValue={formData.laboratorio}
                    onValueChange={(value) => setFormData({ ...formData, laboratorio: value })}
                  >
                    <Picker.Item label="Selecione..." value="" color="#999" />
                    {laboratorios.map((l) => (
                      <Picker.Item key={l._id} label={`${l.nome} (Cap: ${l.capacidade})`} value={l._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, fontSize: 14 }}>Curso *</Text>
                <View style={{ borderWidth: 1, borderColor: errors.curso ? '#B00020' : '#999', borderRadius: 4, backgroundColor: '#fff' }}>
                  <Picker
                    selectedValue={formData.curso}
                    onValueChange={(value) => setFormData({ ...formData, curso: value })}
                  >
                    <Picker.Item label="Selecione..." value="" color="#999" />
                    {cursos.map((c) => (
                      <Picker.Item key={c._id} label={c.nome} value={c._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, fontSize: 14 }}>Disciplina *</Text>
                <View style={{ borderWidth: 1, borderColor: errors.disciplina ? '#B00020' : '#999', borderRadius: 4, backgroundColor: '#fff' }}>
                  <Picker
                    selectedValue={formData.disciplina}
                    onValueChange={(value) => setFormData({ ...formData, disciplina: value })}
                  >
                    <Picker.Item label="Selecione..." value="" color="#999" />
                    {disciplinas.map((d) => (
                      <Picker.Item key={d._id} label={d.nome} value={d._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 4, fontSize: 14 }}>Professor *</Text>
                <View style={{ borderWidth: 1, borderColor: errors.professor ? '#B00020' : '#999', borderRadius: 4, backgroundColor: '#fff' }}>
                  <Picker
                    selectedValue={formData.professor}
                    onValueChange={(value) => setFormData({ ...formData, professor: value })}
                  >
                    <Picker.Item label="Selecione..." value="" color="#999" />
                    {professores.map((p) => (
                      <Picker.Item key={p._id} label={p.nome} value={p._id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <TextInput
                label="Observações"
                value={formData.observacoes}
                onChangeText={(text) => setFormData({ ...formData, observacoes: text })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={{ marginBottom: 12 }}
              />

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#ddd',
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 16 }}>Status Ativo</Text>
                <Switch
                  value={formData.ativo}
                  onValueChange={(value) => setFormData({ ...formData, ativo: value })}
                  color="#1976d2"
                />
              </View>

            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions style={{ paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8 }}>
            <Button onPress={fecharDialog} disabled={saving} style={{ marginRight: 10 }}>
              Cancelar
            </Button>
            <Button
              onPress={salvarAula}
              mode="contained"
              loading={saving}
              disabled={saving}
              style={{ minWidth: 100 }}
            >
              {editingId ? 'Salvar' : 'Criar'}
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

export default AulasScreen;