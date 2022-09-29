// todos os componentes, classes e assets importados pra a aplicação
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Score from './components/Score';
import Card from './components/Card';

import helpers from './helpers';

// classe da aplicação
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.funcaoTeste = this.funcaoTeste.bind(this);
    this.resetCards = this.resetCards.bind(this);

    // fonte dos ícones
    let sources = {
      fontawesome: FontAwesome,
      ionicons: Ionicons,
    };

    // um array com os ícones a serem exibidos
    let cards = [
      {
        src: 'ionicons',
        name: 'paw',
        color: '#663001',
      },
      {
        src: 'ionicons',
        name: 'ios-magnet',
        color: 'red',
      },
      {
        src: 'ionicons',
        name: 'american-football',
        color: '#663001',
      },
      {
        src: 'ionicons',
        name: 'tennisball',
        color: 'green',
      },
      {
        src: 'fontawesome',
        name: 'leaf',
        color: 'green',
      },
      {
        src: 'fontawesome',
        name: 'beer',
        color: '#E6B500',
      },
      {
        src: 'fontawesome',
        name: 'star',
        color: '#E6B500',
      },
      {
        src: 'fontawesome',
        name: 'plane',
        color: '#008C',
      },
      {
        src: 'ionicons',
        name: 'planet',
        color: '#FF5500',
      },
      {
        src: 'ionicons',
        name: 'wine',
        color: '#EE004C',
      },
      {
        src: 'fontawesome',
        name: 'globe',
        color: '#008C',
      },
      {
        src: 'fontawesome',
        name: 'fire-extinguisher',
        color: 'red',
      },
      {
        src: 'ionicons',
        name: 'basketball',
        color: '#FF5500',
      },
      {
        src: 'fontawesome',
        name: 'heart',
        color: 'red',
      },
      {
        src: 'ionicons',
        name: 'cut',
        color: '#555',
      },
    ];

    // setando os valores originais das propriedades da aplicação
    this.state = {
      current_selection: [],
      selected_pairs: [],
      score: 30,
      cards: cards,
      numCards: 6,
      numRow: 3,
    };

    // responsável por pegar o tanto de cartas que será utilizado
    let filtredCards = cards.slice(0, this.state.numCards);
    // clona o array de cima
    let clone = JSON.parse(JSON.stringify(filtredCards));

    // junta as cartas filtradas com o clone no estado atual das cards
    this.cards = filtredCards.concat(clone);
    this.cards.map((obj) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.src = sources[obj.src];
      obj.is_open = false;
    });

    // usa a função shuffle para misturar a ordem das cartas
    this.cards = this.cards.shuffle();
    this.setState({ cards: this.cards });
  }

  // a renderização da tela no dispositivo do usuário
  render() {
    return (
      <View style={styles.container}>
        {/* botao fácil */}
        <TouchableOpacity
          onPress={() => {
            this.funcaoTeste(6, 3);
          }}
          style={styles.easy_buttom}>
          <Text style={styles.buttom_text}>FACIL</Text>
        </TouchableOpacity>
        {/* botao medio */}
        <TouchableOpacity
          onPress={() => {
            this.funcaoTeste(10, 4);
          }}
          style={styles.medium_buttom}>
          <Text style={styles.buttom_text}>MEDIO</Text>
        </TouchableOpacity>
        {/* botao dificil */}
        <TouchableOpacity
          onPress={() => {
            this.funcaoTeste(15, 5);
          }}
          style={styles.hard_buttom}>
          <Text style={styles.buttom_text}>DIFICIL</Text>
        </TouchableOpacity>
        {/* chamando as linhas */}
        <View style={styles.body}>{this.renderRows.call(this)}</View>
        {/* chamando o componente placar */}
        <Score score={this.state.score} />
        {/* botao resetar aplicacao */}
        <TouchableOpacity style={styles.buttom} onPress={this.resetCards}>
          <Text style={styles.buttomText}>RESETAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // função que reseta as cartas do jogo
  resetCards() {
    let cards = this.cards.map((obj) => {
      obj.is_open = false;
      return obj;
    });

    cards = cards.shuffle();

    this.setState({
      current_selection: [],
      selected_pairs: [],
      cards: cards,
      score: 30,
    });
  }

  // função que renderiza as linhas
  renderRows() {
    let contents = this.getRowContents(this.state.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          {this.renderCards(cards)}
        </View>
      );
    });
  }

  // função que renderiza as cartas
  renderCards(cards) {
    return cards.map((card, index) => {
      return (
        <Card
          key={index}
          src={card.src}
          name={card.name}
          color={card.color}
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.id)}
        />
      );
    });
  }

  // função relativa aos botões de dificuldade,a meta era passar por parametro um numero de cartas e linhas para a aplicação renderizar 
  funcaoTeste(numCards, numRow) {
    this.setState({
      numCards: numCards,
      numRow: numRow,
    });
    this.resetCards();
  }

  // responsavel por setar cartas viradas, combinacoes, desvirar e atualizar o placar com combinações
  clickCard(id) {
    let selected_pairs = this.state.selected_pairs;
    let current_selection = this.state.current_selection;
    let score = this.state.score;

    let index = this.state.cards.findIndex((card) => {
      return card.id == id;
    });

    let cards = this.state.cards;

    if (
      cards[index].is_open == false &&
      selected_pairs.indexOf(cards[index].name) === -1
    ) {
      cards[index].is_open = true;

      current_selection.push({
        index: index,
        name: cards[index].name,
      });

      if (current_selection.length == 2) {
        if (current_selection[0].name == current_selection[1].name) {
          score += 20;
          selected_pairs.push(cards[index].name);
        } else {
          score -= 5;
          cards[current_selection[0].index].is_open = false;

          setTimeout(() => {
            cards[index].is_open = false;
            this.setState({
              cards: cards,
            });
          }, 500);
        }

        current_selection = [];
      }

      this.setState({
        score: score,
        cards: cards,
        current_selection: current_selection,
      });
    }
  }

  // puxa o conteudo das linhas
  getRowContents(cards) {
    let contents_r = [];
    let contents = [];
    let count = 0;
    cards.forEach((item) => {
      count += 1;
      contents.push(item);
      if (count == this.state.numRow) {
        contents_r.push(contents);
        count = 0;
        contents = [];
      }
    });

    return contents_r;
  }
}

//estilos do container, linhas, corpo e botoes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  body: {
    flex: 18,
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20,
  },
  buttom: {
    backgroundColor: '#008C',
    padding: 10,
    textAlign: 'center',
    marginTop: 20,
  },
  buttomText: {
    color: 'white',
    fontWeight: 'bold',
  },
  easy_buttom: {
    backgroundColor: 'green',
    padding: 8,
    textAlign: 'center',
  },
  medium_buttom: {
    backgroundColor: '#E6B500',
    padding: 8,
    textAlign: 'center',
  },
  hard_buttom: {
    backgroundColor: 'red',
    padding: 8,
    textAlign: 'center',
  },
  buttom_text: {
    color: 'white',
    fontWeight: 'bold',
  },
});