import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';

// Importação das telas
import HomeScreen from './src/components/HomeScreen';
import InstituicoesScreen from './src/components/Instituicoes/InstituicoesScreen';
import CursosScreen from './src/components/Cursos/CursosScreen';
import ProfessoresScreen from './src/components/Professores/ProfessoresScreen';
import LaboratoriosScreen from './src/components/Laboratorios/LaboratoriosScreen';
import DisciplinasScreen from './src/components/Disciplinas/DisciplinasScreen';
import BlocosScreen from './src/components/Blocos/BlocosScreen';

const Stack = createStackNavigator();

/**
 * Tema customizado para espelhar o Frontend Web
 */
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976d2',
    background: '#f5f5f5',
  },
};

/**
 * Componente principal do aplicativo
 * Configura a navegação entre as telas do sistema
 */
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#1976d2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'Sistema de Laboratórios',
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="Instituicoes" 
            component={InstituicoesScreen}
            options={{ title: 'Instituições' }}
          />
          <Stack.Screen 
            name="Cursos" 
            component={CursosScreen}
            options={{ title: 'Cursos' }}
          />
          <Stack.Screen 
            name="Professores" 
            component={ProfessoresScreen}
            options={{ title: 'Professores' }}
          />
          <Stack.Screen 
            name="Laboratorios" 
            component={LaboratoriosScreen}
            options={{ title: 'Laboratórios' }}
          />
          <Stack.Screen 
            name="Disciplinas" 
            component={DisciplinasScreen}
            options={{ title: 'Disciplinas' }}
          />
          <Stack.Screen 
            name="Blocos" 
            component={BlocosScreen}
            options={{ title: 'Blocos de Horário' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </PaperProvider>
  );
}
