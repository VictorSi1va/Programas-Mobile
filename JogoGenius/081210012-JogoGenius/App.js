import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Audio } from 'expo-av';

// --- Configurações Iniciais ---
const { width } = Dimensions.get('window');
const GAME_AREA_SIZE = width * 0.9 > 350 ? 350 : width * 0.9; // Limita o tamanho máximo

const BUTTON_COLORS = ['green', 'red', 'yellow', 'blue'];

// Carregando os sons locais da pasta assets
// Certifique-se que o caminho para os sons está correto no seu projeto.
const SOUNDS = {
  red: require('./assets/sounds/vermelho.mp3'),
  green: require('./assets/sounds/verde.mp3'),
  blue: require('./assets/sounds/azul.mp3'),
  yellow: require('./assets/sounds/amarelo.mp3'),
};

const INITIAL_GAME_STATE = {
  sequence: [],
  userSequence: [],
  gameStatus: 'idle', // 'idle', 'computer_turn', 'user_turn', 'lost'
  score: 0,
};

export default function App() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [activeColor, setActiveColor] = useState(null);
  const soundObjects = useRef({});

  // Efeito para carregar os sons quando o app inicia
  useEffect(() => {
    const loadSounds = async () => {
      for (const color of BUTTON_COLORS) {
        try {
          if (SOUNDS[color]) {
            const { sound } = await Audio.Sound.createAsync(SOUNDS[color]);
            soundObjects.current[color] = sound;
          }
        } catch (error) {
          console.error(`Erro ao carregar o som para a cor ${color}:`, error);
        }
      }
    };
    loadSounds();

    // Cleanup: descarregar os sons ao desmontar o componente
    return () => {
      for (const color of BUTTON_COLORS) {
        if (soundObjects.current[color]) {
          soundObjects.current[color].unloadAsync();
        }
      }
    };
  }, []);

  // Efeito principal que controla o fluxo do jogo
  useEffect(() => {
    if (gameState.gameStatus === 'computer_turn') {
      const isFirstRound = gameState.sequence.length === 0;
      const movesToAdd = isFirstRound ? 2 : 1;
      const nextSequence = [...gameState.sequence];

      for (let i = 0; i < movesToAdd; i++) {
        const randomColor = BUTTON_COLORS[Math.floor(Math.random() * BUTTON_COLORS.length)];
        nextSequence.push(randomColor);
      }
      
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          sequence: nextSequence,
          userSequence: [],
        }));
        playSequenceAnimation(nextSequence);
      }, 700);
    }
  }, [gameState.gameStatus, gameState.score]);

  // --- Funções de Lógica do Jogo ---

  const playSound = async (color) => {
    try {
      const sound = soundObjects.current[color];
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error(`Erro ao tocar o som para a cor ${color}:`, error);
    }
  };

  const startGame = () => {
    setGameState({
      ...INITIAL_GAME_STATE,
      gameStatus: 'computer_turn',
    });
  };
  
  const playSequenceAnimation = (sequence) => {
    let delay = 500;
    sequence.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
        playSound(color);
        setTimeout(() => setActiveColor(null), 300);
        
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, gameStatus: 'user_turn' }));
          }, 500);
        }
      }, delay);
      delay += 600;
    });
  };

  const handlePress = (color) => {
    if (gameState.gameStatus !== 'user_turn') return;

    playSound(color);
    const newUserSequence = [...gameState.userSequence, color];
    
    const index = newUserSequence.length - 1;
    if (newUserSequence[index] !== gameState.sequence[index]) {
      endGame();
      return;
    }

    setGameState(prev => ({ ...prev, userSequence: newUserSequence }));

    if (newUserSequence.length === gameState.sequence.length) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        gameStatus: 'computer_turn',
      }));
    }
  };

  const endGame = () => {
    Alert.alert('Fim de Jogo!', `Sua pontuação final foi: ${gameState.score}`);
    setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
  };

  // --- Funções de Renderização ---

  const renderGameArea = () => {
    if (gameState.gameStatus === 'idle' || gameState.gameStatus === 'lost') {
      return (
        <View style={styles.startArea}>
          {gameState.gameStatus === 'lost' && (
             <Text style={styles.scoreText}>Pontuação Final: {gameState.score}</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameState.gameStatus === 'lost' ? 'Tentar Novamente' : 'Começar'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.gameContainer}>
        <Text style={styles.scoreText}>Pontuação: {gameState.score}</Text>
        <View style={styles.geniusCircle}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => handlePress('green')}
              disabled={gameState.gameStatus !== 'user_turn'}
              style={[styles.gameButton, styles.buttongreen, activeColor === 'green' && styles.activeButton]}
            />
            <TouchableOpacity
              onPress={() => handlePress('red')}
              disabled={gameState.gameStatus !== 'user_turn'}
              style={[styles.gameButton, styles.buttonred, activeColor === 'red' && styles.activeButton]}
            />
          </View>
          <View style={styles.row}>
             <TouchableOpacity
              onPress={() => handlePress('yellow')}
              disabled={gameState.gameStatus !== 'user_turn'}
              style={[styles.gameButton, styles.buttonyellow, activeColor === 'yellow' && styles.activeButton]}
            />
            <TouchableOpacity
              onPress={() => handlePress('blue')}
              disabled={gameState.gameStatus !== 'user_turn'}
              style={[styles.gameButton, styles.buttonblue, activeColor === 'blue' && styles.activeButton]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo Genius</Text>
      {renderGameArea()}
      <TouchableOpacity style={styles.restartButton} onPress={startGame}>
        <Text style={styles.restartButtonText}>Reiniciar Jogo</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Estilos para React Native ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  startArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scoreText: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  geniusCircle: {
    width: GAME_AREA_SIZE,
    height: GAME_AREA_SIZE,
    borderRadius: GAME_AREA_SIZE / 2,
    backgroundColor: '#333',
    borderWidth: 10,
    borderColor: '#222',
    elevation: 20,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  gameButton: {
    flex: 1,
    opacity: 0.8,
  },
  buttongreen: {
    backgroundColor: '#2ECC40',
    borderTopLeftRadius: GAME_AREA_SIZE / 2,
  },
  buttonred: {
    backgroundColor: '#FF4136',
    borderTopRightRadius: GAME_AREA_SIZE / 2,
  },
  buttonyellow: {
    backgroundColor: '#FFDC00',
    borderBottomLeftRadius: GAME_AREA_SIZE / 2,
  },
  buttonblue: {
    backgroundColor: '#0074D9',
    borderBottomRightRadius: GAME_AREA_SIZE / 2,
  },
  activeButton: {
    opacity: 1,
    transform: [{ scale: 1.02 }],
    elevation: 25,
  },
  restartButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

