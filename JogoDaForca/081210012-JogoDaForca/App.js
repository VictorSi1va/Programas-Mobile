import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, Keyboard, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const WORDS_AND_HINTS = [
  { word: 'COMPUTADOR', hint: 'Máquina eletrônica para processar dados.' },
  { word: 'PROGRAMACAO', hint: 'Arte de escrever código.' },
  { word: 'JAVASCRIPT', hint: 'Linguagem de script para web.' },
  { word: 'REACT', hint: 'Biblioteca JavaScript para interfaces.' },
  { word: 'DESENVOLVEDOR', hint: 'Profissional que cria software.' },
  { word: 'MOBILE', hint: 'Relacionado a dispositivos portáteis.' },
  { word: 'ALGORITMO', hint: 'Sequência de passos para resolver um problema.' },
  { word: 'BANCO', hint: 'Instituição financeira.' },
  { word: 'MESA', hint: 'Móvel com tampo e pernas.' },
  { word: 'CADEIRA', hint: 'Assento com encosto.' },
];

const HANGMAN_PARTS = [
  'O',   
  '|',   
  '/',   
  '\\',  
  '/',   
  '\\'   
];

const INITIAL_STATE = {
  wordToGuess: '',
  hint: '',
  guessedLetters: [],
  incorrectGuesses: 0,
  gameStatus: 'ongoing',
};

export default function App() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [usedWords, setUsedWords] = useState([]);
  const [letter, setLetter] = useState('');

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    Keyboard.dismiss();
    const availableWords = WORDS_AND_HINTS.filter(item => !usedWords.includes(item.word));
    
    if (availableWords.length === 0) {
      Alert.alert('Fim do Jogo!', 'Você jogou com todas as palavras. Reiniciando a lista...');
      setUsedWords([]);
      startGame();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const newWordData = availableWords[randomIndex];

    setGameState({
      ...INITIAL_STATE,
      wordToGuess: newWordData.word,
      hint: newWordData.hint,
    });
    setUsedWords(prev => [...prev, newWordData.word]);
  };

  const handleGuess = () => {
    if (letter.length !== 1 || !/^[a-zA-Z]$/.test(letter)) {
      Alert.alert('Entrada Inválida', 'Por favor, digite uma única letra.');
      setLetter('');
      return;
    }
    const upperCaseLetter = letter.toUpperCase();

    if (gameState.guessedLetters.includes(upperCaseLetter)) {
      Alert.alert('Aviso', `Você já tentou a letra "${upperCaseLetter}".`);
      setLetter('');
      return;
    }

    const newGuessedLetters = [...gameState.guessedLetters, upperCaseLetter];
    let newIncorrectGuesses = gameState.incorrectGuesses;

    if (!gameState.wordToGuess.includes(upperCaseLetter)) {
      newIncorrectGuesses++;
    }

    setGameState(prev => ({
      ...prev,
      guessedLetters: newGuessedLetters,
      incorrectGuesses: newIncorrectGuesses,
    }));
    setLetter('');

    checkGameStatus(newGuessedLetters, newIncorrectGuesses);
  };

  const checkGameStatus = (guessedLetters, incorrectGuesses) => {
    const wordGuessed = gameState.wordToGuess.split('').every(char => guessedLetters.includes(char));

    if (wordGuessed) {
      setGameState(prev => ({ ...prev, gameStatus: 'won' }));
      Alert.alert('Parabéns!', `Você ganhou! A palavra era: ${gameState.wordToGuess}`);
    } else if (incorrectGuesses >= HANGMAN_PARTS.length) {
      setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
      Alert.alert('Que pena!', `Você perdeu! A palavra era: ${gameState.wordToGuess}`);
    }
  };

  const displayWord = () => {
    return gameState.wordToGuess.split('').map((char, index) => (
      <Text key={index} style={styles.letter}>
        {gameState.guessedLetters.includes(char) ? char : '_'}
      </Text>
    ));
  };
  
  const displayHangman = () => {
    const p = gameState.incorrectGuesses;
    
    const head = p > 0 ? 'O' : ' ';
    const body = p > 1 ? '|' : ' ';
    const armLeft = p > 2 ? '/' : ' ';
    const armRight = p > 3 ? '\\' : ' ';
    const legLeft = p > 4 ? '/' : ' ';
    const legRight = p > 5 ? '\\' : ' ';

    return (
      <View style={styles.hangmanContainer}>
        <Text style={styles.hangmanLine}>  +---+</Text>
        <Text style={styles.hangmanLine}>  |   {head}</Text>
        <Text style={styles.hangmanLine}>  |  {armLeft}{body}{armRight}</Text>
        <Text style={styles.hangmanLine}>  |   {legLeft} {legRight}</Text>
        <Text style={styles.hangmanLine}>  |</Text>
        <Text style={styles.hangmanLine}>======</Text>
      </View>
    );
  };
  
  const isGameOver = gameState.gameStatus !== 'ongoing';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Jogo da Forca</Text>
        
        {displayHangman()}
        
        <Text style={styles.incorrectGuesses}>Erros: {gameState.incorrectGuesses} de {HANGMAN_PARTS.length}</Text>

        <Text style={styles.hint}>Dica: {gameState.hint}</Text>

        <View style={styles.wordContainer}>{displayWord()}</View>

        {!isGameOver ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setLetter}
              value={letter}
              maxLength={1}
              autoCapitalize="characters"
              placeholder="Digite uma letra"
            />
            <TouchableOpacity style={styles.guessButton} onPress={handleGuess}>
              <Text style={styles.guessButtonText}>Adivinhar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.restartButton} onPress={startGame}>
            <Text style={styles.restartButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        )}

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  hangmanContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    minHeight: 150,
  },
  hangmanLine: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    lineHeight: 22,
  },
  incorrectGuesses: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
  hint: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  letter: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  guessButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  guessButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});