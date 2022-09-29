// todos modules importados para criação do placar
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// componente do placar
export default class Score extends React.Component {
  render() {
    return (
      <View style={styles.score_container}>
        <Text style={styles.score}>{this.props.score}</Text>
      </View>
    );
  }
}

// estilos do componente
const styles = StyleSheet.create({
  score_container: {
    flex: 1,
    alignItems: 'center',
    padding: 0,
    marginBottom: 25,
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
