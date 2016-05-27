import React from 'react';
import Firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBwnWgG2gur-t-JjiMQhxRi2eiWM7Dbfj4",
    authDomain: "towers-42c7a.firebaseapp.com",
    databaseURL: "https://towers-42c7a.firebaseio.com",
    storageBucket: "towers-42c7a.appspot.com",
  };
Firebase.initializeApp(config);

export default class Dashboard extends React.Component {
  
  componentWillMount() {
    this.props.loadGames(Firebase.database());
  }
  
  render() {
    return <div class="dashboard"><ul class="dashboard__list">Deine aktuellen Spiele:<li>Spiel gegen Tobi</li></ul><div class="dashboard__start-button">Neues Spiel Starten</div></div>;
  }
}