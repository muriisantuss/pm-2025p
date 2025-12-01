import React from 'react';
import { View, ScrollView, StatusBar, Platform } from 'react-native';
import { Card, Title, Paragraph, List, Appbar } from 'react-native-paper';

/**
 * Tela principal do aplicativo com navegação para os CRUDs
 */
const HomeScreen = ({ navigation }) => {
  const menuItems = [
    {
      title: 'Instituições',
      description: 'Gerenciar instituições de ensino',
      icon: 'school',
      route: 'Instituicoes',
    },
    {
      title: 'Cursos',
      description: 'Gerenciar cursos oferecidos',
      icon: 'book-open-variant',
      route: 'Cursos',
    },
    {
      title: 'Professores',
      description: 'Gerenciar corpo docente',
      icon: 'account-tie',
      route: 'Professores',
    },
    {
      title: 'Laboratórios',
      description: 'Gerenciar laboratórios e salas',
      icon: 'flask',
      route: 'Laboratorios',
    },
    {
      title: 'Disciplinas',
      description: 'Gerenciar disciplinas do curso',
      icon: 'book-multiple',
      route: 'Disciplinas',
    },
    {
      title: 'Blocos de Horário',
      description: 'Gerenciar horários das aulas',
      icon: 'clock-outline',
      route: 'Blocos',
    },
    {
      title: 'Agendamento de Aulas',
      description: 'Agendar e gerenciar aulas nos laboratórios',
      icon: 'calendar-check',
      route: 'Aulas',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar backgroundColor="#1976d2" barStyle="light-content" />
      <Appbar.Header style={{ backgroundColor: '#1976d2' }}>
        <Appbar.Content title="Sistema de Laboratórios" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
      >
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Title>Bem-vindo!</Title>
            <Paragraph>
              Sistema de gerenciamento de laboratórios e recursos acadêmicos.
              Selecione uma opção abaixo para começar.
            </Paragraph>
          </Card.Content>
        </Card>

        {menuItems.map((item, index) => (
          <List.Item
            key={index}
            title={item.title}
            description={item.description}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate(item.route)}
            style={{
              backgroundColor: '#fff',
              marginBottom: 8,
              borderRadius: 8,
              elevation: 2,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;