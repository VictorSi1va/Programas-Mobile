// Importa os componentes e APIs necessários do React, React Native e Expo
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define o estado inicial do tabuleiro. É um array de 9 posições, todas nulas.
// Cada posição do array representa uma célula do jogo.
const INITIAL_BOARD = Array(9).fill(null);

// Usa a API Dimensions para obter a largura da tela do dispositivo.
const { width } = Dimensions.get('window');

// Define o tamanho do tabuleiro como 80% da largura da tela. Isso garante que
// o tabuleiro seja responsivo e se ajuste a diferentes tamanhos de tela.
const boardSize = width * 0.8;

// Calcula o tamanho de cada célula do tabuleiro, dividindo a largura total por 3.
const cellSize = boardSize / 3;

// Componente principal do aplicativo.
export default function App() {
  // === Gerenciamento de Estado com 'useState' ===
  // O 'useState' permite que o componente gerencie e atualize seus dados.
  // 'board': armazena o estado atual do tabuleiro (X, O, ou null).
  // 'player': armazena o jogador atual ('X' ou 'O').
  // 'winner': armazena o vencedor ('X', 'O', ou 'Empate').
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  // === Efeitos de Lado com 'useEffect' ===
  // Este 'useEffect' executa a função 'checkWinner' toda vez que o 'board' (tabuleiro)
  // é atualizado. É assim que o jogo verifica se alguém venceu a cada jogada.
  useEffect(() => {
    checkWinner();
  }, [board]);

  // === Lógica do Jogo ===
  
  // Função chamada quando uma célula do tabuleiro é pressionada.
  const handlePress = (index) => {
    // Se a célula já estiver preenchida ou se já houver um vencedor, a função é encerrada.
    if (board[index] || winner) {
      return;
    }
    // Cria uma cópia do tabuleiro para não modificar o estado diretamente.
    const newBoard = [...board];
    // Preenche a célula clicada com a marca do jogador atual.
    newBoard[index] = player;
    // Atualiza o estado do tabuleiro.
    setBoard(newBoard);
    // Alterna o jogador para o próximo turno.
    setPlayer(player === 'X' ? 'O' : 'X');
  };

  // Função para checar se há um vencedor ou se o jogo empatou.
  const checkWinner = () => {
    // As 'lines' são todas as combinações vencedoras (horizontais, verticais e diagonais).
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Percorre todas as combinações vencedoras.
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      // Se a célula não for nula e todas as três forem iguais, temos um vencedor.
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return; // Encerra a função assim que um vencedor é encontrado.
      }
    }

    // Se todas as células estiverem preenchidas e não houver um vencedor, o jogo é um empate.
    if (board.every(cell => cell !== null)) {
      setWinner('Empate');
    }
  };

  // Função para reiniciar o jogo.
  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setPlayer('X');
    setWinner(null);
  };

  // Outro 'useEffect' que é acionado sempre que o 'winner' (vencedor) muda.
  // Ele exibe um alerta informando o resultado do jogo.
  useEffect(() => {
    if (winner) {
      const message = winner === 'Empate' ? 'O jogo terminou em Empate!' : `O jogador ${winner} venceu!`;
      // 'Alert.alert' exibe a mensagem de fim de jogo e o botão 'OK' que chama 'resetGame'.
      Alert.alert('Fim de Jogo', message, [{ text: 'OK', onPress: resetGame }]);
    }
  }, [winner]);

  // === Renderização dos Componentes ===

  // Função que renderiza uma única célula do tabuleiro.
  const renderCell = (index) => {
    // Lógica para determinar se a célula está na última coluna ou última linha,
    // para não desenhar bordas desnecessárias e manter o layout limpo.
    const isLastColumn = (index + 1) % 3 === 0;
    const isLastRow = index >= 6;

    return (
      <TouchableOpacity
        key={index}
        // Aplica os estilos da célula e adiciona bordas condicionalmente.
        style={[
          styles.cell,
          !isLastColumn && styles.cellBorderRight,
          !isLastRow && styles.cellBorderBottom,
        ]}
        // O evento 'onPress' chama a função 'handlePress' com o índice da célula.
        onPress={() => handlePress(index)}
      >
        <Text style={styles.cellText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  // Retorna a estrutura visual do aplicativo (o que o usuário vê na tela).
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Velha</Text>
      <Text style={styles.statusText}>
        {/* Exibe o resultado do jogo ou o próximo jogador. */}
        {winner ? `Resultado: ${winner}` : `Próximo: ${player}`}
      </Text>
      {/* O container 'board' que contém as células. */}
      <View style={styles.board}>
        {/* Mapeia o array 'board' para renderizar 9 células. */}
        {board.map((cell, index) => renderCell(index))}
      </View>
      {/* Botão para reiniciar o jogo. */}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Novo Jogo</Text>
      </TouchableOpacity>
      {/* 'StatusBar' do Expo, para controlar a barra de status do celular. */}
      <StatusBar style="auto" />
    </View>
  );
}

// === Estilos dos Componentes com 'StyleSheet' ===
// O StyleSheet.create é uma forma otimizada de criar estilos em React Native.
// Ele é similar ao CSS, mas os nomes das propriedades são em camelCase.
const styles = StyleSheet.create({
  container: {
    // 'flex: 1' faz com que o container ocupe todo o espaço disponível na tela.
    flex: 1, 
    // Define a cor de fundo da tela inteira como branco (#fff).
    backgroundColor: '#fff',
    // 'alignItems' centraliza os elementos filhos horizontalmente dentro do container.
    alignItems: 'center', 
    // 'justifyContent' centraliza os elementos filhos verticalmente.
    justifyContent: 'center', 
  },
  title: {
    // Define o tamanho da fonte do título 'Jogo da Velha'.
    fontSize: 40,
    // Deixa o texto em negrito.
    fontWeight: 'bold',
    // Adiciona um espaço de 20 pixels abaixo do título.
    marginBottom: 20,
    // Define a cor do texto do título como um cinza escuro.
    color: '#333',
  },
  statusText: {
    // Define o tamanho da fonte do texto de status ('Próximo: X' ou 'Resultado: X').
    fontSize: 24,
    // Adiciona um espaço de 20 pixels abaixo do texto de status.
    marginBottom: 20,
    // Define a cor do texto de status como um cinza médio.
    color: '#555',
  },
  board: {
    // 'flexDirection: 'row'' organiza as células do tabuleiro em uma linha.
    flexDirection: 'row',
    // 'flexWrap: 'wrap'' faz com que as células quebrem para a próxima linha
    // quando a linha atual estiver cheia (criando as 3 linhas do tabuleiro).
    flexWrap: 'wrap',
    // Define a largura do tabuleiro, que é calculada no código principal.
    width: boardSize,
    // Define a altura do tabuleiro, para que seja um quadrado perfeito.
    height: boardSize,
  },
  cell: {
    // Define a largura de cada célula como 1/3 do tamanho do tabuleiro.
    width: cellSize,
    // Define a altura de cada célula como 1/3 do tamanho do tabuleiro.
    height: cellSize,
    // Centraliza o conteúdo (o 'X' ou 'O') horizontalmente.
    alignItems: 'center',
    // Centraliza o conteúdo (o 'X' ou 'O') verticalmente.
    justifyContent: 'center',
  },
  cellBorderRight: {
    // Adiciona uma borda à direita com 3 pixels de espessura.
    borderRightWidth: 3,
    // Define a cor da borda direita.
    borderRightColor: '#333',
  },
  cellBorderBottom: {
    // Adiciona uma borda inferior com 3 pixels de espessura.
    borderBottomWidth: 3,
    // Define a cor da borda inferior.
    borderBottomColor: '#333',
  },
  cellText: {
    // Define o tamanho da fonte dos marcadores 'X' e 'O'.
    fontSize: 60,
    // Deixa o texto em negrito.
    fontWeight: 'bold',
    // Define a cor do texto.
    color: '#333',
  },
  resetButton: {
    // Define a cor de fundo do botão 'Novo Jogo' como um verde.
    backgroundColor: '#4CAF50',
    // Adiciona um preenchimento interno de 15 pixels ao redor do texto do botão.
    padding: 15,
    // Arredonda os cantos do botão.
    borderRadius: 8,
    // Adiciona um espaço de 30 pixels acima do botão para separá-lo do tabuleiro.
    marginTop: 30,
  },
  resetButtonText: {
    // Define a cor do texto do botão como branco.
    color: '#fff',
    // Define o tamanho da fonte do texto do botão.
    fontSize: 18,
    // Deixa o texto em negrito.
    fontWeight: 'bold',
  },
});