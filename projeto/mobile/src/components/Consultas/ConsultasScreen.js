import React, { useState, useEffect } from 'react';
import { View, Alert, SectionList, Modal } from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Snackbar,
  ActivityIndicator,
  Text,
  IconButton,
  Portal,
  Dialog,
  RadioButton,
  Divider,
  Chip,
  FAB
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';

const ConsultasScreen = ({ navigation }) => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [filtrarPor, setFiltrarPor] = useState('');
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [laboratorios, setLaboratorios] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);

  const diasSemana = {
    1: 'SEGUNDA-FEIRA',
    2: 'TERÇA-FEIRA', 
    3: 'QUARTA-FEIRA',
    4: 'QUINTA-FEIRA',
    5: 'SEXTA-FEIRA',
    6: 'SÁBADO'
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Auto-buscar quando mudar período ou filtros
  useEffect(() => {
    if (filtrarPor && itemSelecionado) {
      buscarAulas();
    }
  }, [dataAtual, filtrarPor, itemSelecionado]);

  const carregarDados = async () => {
    try {
      const [labsRes, profsRes] = await Promise.all([
        api.get('/laboratorios'),
        api.get('/professores')
      ]);
      setLaboratorios(labsRes.data);
      setProfessores(profsRes.data);
    } catch (error) {
      mostrarSnackbar('Erro ao carregar dados');
    }
  };

  const mostrarSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const calcularSemanaAtual = () => {
    const inicioSemana = new Date(dataAtual);
    const diaSemana = inicioSemana.getDay();
    const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
    inicioSemana.setDate(inicioSemana.getDate() + diasParaSegunda);
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 5);
    
    return { inicioSemana, fimSemana };
  };

  const obterTituloSemana = () => {
    const { inicioSemana, fimSemana } = calcularSemanaAtual();
    return `${inicioSemana.toLocaleDateString('pt-BR')} - ${fimSemana.toLocaleDateString('pt-BR')}`;
  };

  const navegarSemana = (direcao) => {
    const novaData = new Date(dataAtual);
    novaData.setDate(novaData.getDate() + (direcao * 7));
    setDataAtual(novaData);
  };

  const voltarHoje = () => {
    setDataAtual(new Date());
  };

  const buscarAulas = async () => {
    if (!filtrarPor || !itemSelecionado) {
      return;
    }

    setLoading(true);
    
    try {
      const { inicioSemana, fimSemana } = calcularSemanaAtual();
      
      const params = {
        dataInicio: inicioSemana.toISOString().split('T')[0],
        dataFim: fimSemana.toISOString().split('T')[0],
        limit: 1000
      };

      if (filtrarPor === 'laboratorio') {
        params.laboratorio = itemSelecionado;
      } else {
        params.professor = itemSelecionado;
      }

      const response = await api.get('/aulas', { params });
      setAulas(response.data);
      
      if (response.data.length === 0) {
        mostrarSnackbar('Nenhuma aula encontrada para esta semana');
      }
    } catch (error) {
      mostrarSnackbar('Erro ao buscar aulas');
    } finally {
      setLoading(false);
    }
  };

  const prepararDadosParaSectionList = () => {
    const aulasAgrupadas = {};
    
    aulas.forEach(aula => {
      const dataAula = new Date(aula.data);
      const diaSemana = dataAula.getDay();
      
      if (diaSemana >= 1 && diaSemana <= 6) {
        if (!aulasAgrupadas[diaSemana]) {
          aulasAgrupadas[diaSemana] = [];
        }
        aulasAgrupadas[diaSemana].push(aula);
      }
    });

    // Ordenar aulas por horário dentro de cada dia
    Object.keys(aulasAgrupadas).forEach(dia => {
      aulasAgrupadas[dia].sort((a, b) => a.bloco.ordem - b.bloco.ordem);
    });

    // Converter para formato do SectionList
    return Object.keys(aulasAgrupadas)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(dia => {
        const dataExemplo = aulas.find(a => new Date(a.data).getDay() === parseInt(dia))?.data;
        const dataFormatada = dataExemplo ? new Date(dataExemplo).toLocaleDateString('pt-BR') : '';
        
        return {
          title: `${diasSemana[dia]} - ${dataFormatada}`,
          data: aulasAgrupadas[dia]
        };
      });
  };

  const formatarHorario = (bloco) => {
    if (!bloco) return 'Horário N/A';
    return `${bloco.inicio || 'N/A'} - ${bloco.fim || 'N/A'}`;
  };

  const renderAulaCard = ({ item: aula }) => {
    // Debug: Log do item para diagnóstico
    console.log('Item Aula:', aula);
    
    const infoSecundaria = filtrarPor === 'laboratorio' 
      ? aula.professor?.nome || 'Professor N/A'
      : aula.laboratorio?.nome || 'Laboratório N/A';

    return (
      <Card style={{ marginBottom: 8, marginHorizontal: 4, backgroundColor: '#f8f9fa' }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Title style={{ fontSize: 18, fontWeight: 'bold', color: '#1976d2' }}>
                {formatarHorario(aula.bloco)}
              </Title>
              <Title style={{ fontSize: 16, marginTop: 4 }}>
                {aula.disciplina?.nome || 'Disciplina N/A'}
              </Title>
              <Paragraph style={{ color: '#666', marginTop: 2 }}>
                {infoSecundaria}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={{ backgroundColor: '#e3f2fd', padding: 12, marginTop: 8 }}>
      <Title style={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold' }}>
        {title}
      </Title>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={{ padding: 40, alignItems: 'center' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📅</Text>
      <Title style={{ textAlign: 'center', color: '#666' }}>
        Nenhuma aula encontrada
      </Title>
      <Paragraph style={{ textAlign: 'center', color: '#999', marginTop: 8 }}>
        Tente ajustar os filtros ou navegar para outra semana
      </Paragraph>
    </View>
  );

  const renderModalFiltro = () => (
    <Portal>
      <Dialog visible={modalFiltroVisible} onDismiss={() => setModalFiltroVisible(false)}>
        <Dialog.Title>Filtros de Consulta</Dialog.Title>
        <Dialog.Content>
          <View style={{ marginVertical: 8 }}>
            <Paragraph>Filtrar por:</Paragraph>
            <RadioButton.Group 
              onValueChange={value => {
                setFiltrarPor(value);
                setItemSelecionado('');
              }} 
              value={filtrarPor}
            >
              <RadioButton.Item label="Laboratório" value="laboratorio" />
              <RadioButton.Item label="Professor" value="professor" />
            </RadioButton.Group>
          </View>

          {filtrarPor && (
            <View style={{ marginVertical: 8 }}>
              <Paragraph>Selecionar {filtrarPor === 'laboratorio' ? 'Laboratório' : 'Professor'}:</Paragraph>
              <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginTop: 8 }}>
                <Picker
                  selectedValue={itemSelecionado}
                  onValueChange={setItemSelecionado}
                >
                  <Picker.Item label="Selecione..." value="" />
                  {filtrarPor === 'laboratorio' && laboratorios.map(lab => (
                    <Picker.Item key={lab._id} label={lab.nome} value={lab._id} />
                  ))}
                  {filtrarPor === 'professor' && professores.map(prof => (
                    <Picker.Item key={prof._id} label={prof.nome} value={prof._id} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setModalFiltroVisible(false)}>Fechar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const secoesDados = prepararDadosParaSectionList();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Consulta de Horários" />
        <Appbar.Action 
          icon="filter" 
          onPress={() => setModalFiltroVisible(true)} 
        />
      </Appbar.Header>

      {/* Cabeçalho de Navegação */}
      <Card style={{ margin: 16, marginBottom: 8 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <IconButton 
              icon="chevron-left" 
              onPress={() => navegarSemana(-1)}
              mode="contained"
            />
            
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Title style={{ fontSize: 16, textAlign: 'center' }}>
                {obterTituloSemana()}
              </Title>
            </View>
            
            <IconButton 
              icon="chevron-right" 
              onPress={() => navegarSemana(1)}
              mode="contained"
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              mode="outlined" 
              onPress={voltarHoje}
              icon="calendar-today"
              compact
            >
              Hoje
            </Button>

            {filtrarPor && itemSelecionado && (
              <Chip mode="outlined">
                {filtrarPor === 'laboratorio' ? 'Lab: ' : 'Prof: '}
                {filtrarPor === 'laboratorio' 
                  ? laboratorios.find(l => l._id === itemSelecionado)?.nome
                  : professores.find(p => p._id === itemSelecionado)?.nome
                }
              </Chip>
            )}
          </View>

          {loading && (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator size="small" />
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Lista de Resultados */}
      {filtrarPor && itemSelecionado ? (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <SectionList
            sections={secoesDados}
            keyExtractor={(item) => item._id}
            renderItem={renderAulaCard}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
          <Title style={{ textAlign: 'center', color: '#666', marginBottom: 8 }}>
            Configure os Filtros
          </Title>
          <Paragraph style={{ textAlign: 'center', color: '#999', marginBottom: 24 }}>
            Toque no ícone de filtro no topo para selecionar um laboratório ou professor
          </Paragraph>
          <Button 
            mode="contained" 
            onPress={() => setModalFiltroVisible(true)}
            icon="filter"
          >
            Abrir Filtros
          </Button>
        </View>
      )}

      {renderModalFiltro()}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default ConsultasScreen;