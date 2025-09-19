import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importe todas as telas
import Home from './telas/Home';
import Tela1 from './telas/Tela1';
import Tela2 from './telas/Tela2';
import Tela3 from './telas/Tela3';

// 2. Crie o "empilhador" de telas
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 3. O NavigationContainer gerencia toda a árvore de navegação
    <NavigationContainer>
      {/* 4. O Stack.Navigator controla a pilha de telas. initialRouteName define qual tela aparece primeiro */}
      <Stack.Navigator initialRouteName="Home">
        
        {/* 5. Cada Stack.Screen representa uma tela na pilha de navegação */}
        
        {/* Tela Home: Botão de voltar do sistema (Android) fica visível, mas não o do cabeçalho. */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerBackVisible: false }} 
        />
        
        {/* Tela 1: Oculta completamente o cabeçalho. */}
        <Stack.Screen 
          name="Tela1" 
          component={Tela1} 
          options={{ headerShown: false }} 
        />
        
        {/* Tela 2: Garante que o botão de voltar no cabeçalho apareça e define uma animação. */}
        <Stack.Screen 
          name="Tela2" 
          component={Tela2} 
          options={{ headerBackVisible: true, animation: 'slide_from_bottom' }} 
        />
        
        {/* Tela 3: Esconde o botão voltar, customiza o título e define uma animação de fade. */}
        <Stack.Screen 
          name="Tela3" 
          component={Tela3} 
          options={{ 
            headerBackVisible: false, 
            title: 'Esta é a Tela 3', 
            animation: 'fade' 
          }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}