import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Score from './components/Score';
import Card from './components/Card';

import helpers from './helpers';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.funcaoTeste = this.funcaoTeste.bind(this);
    this.resetCards = this.resetCards.bind(this);

    let sources = {
      fontawesome: FontAwesome,
      ionicons: Ionicons,
    };

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

    this.state = {
      current_selection: [],
      selected_pairs: [],
      score: 30,
      cards: cards,
      numCards: 6,
      numRow: 3,
    };

    let filtredCards = cards.slice(0, this.state.numCards);

    let clone = JSON.parse(JSON.stringify(filtredCards));

    this.cards = filtredCards.concat(clone);
    console.log(this.cards);
    this.cards.map((obj) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.src = sources[obj.src];
      obj.is_open = false;
    });

    this.cards = this.cards.shuffle();
    this.setState({ cards: this.cards });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.funcaoTeste(6, 3);
          }}
          style={styles.easy_buttom}>
          <Text style={styles.buttom_text}>FACIL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.funcaoTeste(10, 4);
          }}
          style={styles.medium_buttom}>
          <Text style={styles.buttom_text}>MEDIO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.funcaoTeste(15, 5);
          }}
          style={styles.hard_buttom}>
          <Text style={styles.buttom_text}>DIFICIL</Text>
        </TouchableOpacity>
        <View style={styles.body}>{this.renderRows.call(this)}</View>
        <Score score={this.state.score} />
        <TouchableOpacity style={styles.buttom} onPress={this.resetCards}>
          <Text style={styles.buttomText}>RESETAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  funcaoTeste(numCards, numRow) {
    this.setState({
      numCards: numCards,
      numRow: numRow,
    });
    this.resetCards();
  }

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