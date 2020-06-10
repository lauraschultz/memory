import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

const sizes = {
  //number of PAIRS
  'small': 8,
  'medium': 10,
  'large': 12
}
const cards = [
  { 'key': 'banana' },
  { 'key': 'apple' },
  { 'key': 'pineapple' },
  { 'key': 'grapes' },
  { 'key': 'red-pepper' },
  { 'key': 'eggplant' },
  { 'key': 'onion' },
  { 'key': 'mushroom' },
  { 'key': 'pear' },
  { 'key': 'brocolli' },
  { 'key': 'tomato' },
  { 'key': 'carrot' }
]
let current_size = 'small';

function Card(props) {
  const content = props.faceSideUp ? props.image : null;
  return (
    <button
      className="card"
      onClick={props.onClick}
    >
      {content}
    </button>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: makeArray(),
      clickedPairs: 0,
      matchedPairs: 0,
      flippedCard: undefined,
      acceptingClick: true
    };
  }

  handleClick(i) {
    const currentCard = this.state.cards[i];
    // console.log('currentCard is ', currentCard);
    // console.log('flippedCard is ', this.state.flippedCard);

    if (currentCard.flipped || !this.state.acceptingClick) {
      // already turned over or can't click right now
      return;
    }
    // console.log(this.state.flippedCard);
    if (this.state.flippedCard) {
      this.setState({
        clickedPairs: this.state.clickedPairs + 1
      });
      // another card has been turned over
      currentCard.flipped = true;
      if (this.state.flippedCard.key === currentCard.key) {
        // match
        console.log('KEY MATCHES');
        this.setState({
          matchedPairs: this.state.matchedPairs + 1,
          flippedCard: undefined
        });
      } else {
        // no match
        // this.setState({
        //   flippedCard: {
        //     key: this.state.flippedCard.key,
        //     flipped: false
        //   }
        // }); 
        this.setState({
          acceptingClick: false
        });
        setTimeout(() => {
          this.state.flippedCard.flipped = false;
          currentCard.flipped = false;
          this.setState({
            flippedCard: undefined,
            acceptingClick: true
          });
        }, 2000);
      }
    } else {
      // no other card has been turned over
      this.setState({ flippedCard: currentCard });
      currentCard.flipped = true;
    }
  }

  render() {
    return (<div><div className="cardContainer">
      {this.state.cards.map((c, i) => {
        return <Card
          key={i}
          faceSideUp={c.flipped}
          image={c.key}
          onClick={() => this.handleClick(i)}
        />;
      })}</div>
      <p>{this.state.clickedPairs}</p>
      </div>)
  }
}

function makeArray() {
  const halfArr = cards.slice(0, sizes[current_size]);
  let arr = halfArr.concat([...halfArr].map(i => ({ ...i })));
  shuffleArray(arr);
  arr.forEach(card => {
    card.flipped = false;
  })
  return arr;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
