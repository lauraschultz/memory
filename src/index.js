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
  { 'key': 'bell-pepper' },
  { 'key': 'grapes' },
  { 'key': 'carrot' },
  { 'key': 'eggplant' },
  { 'key': 'onion' },
  { 'key': 'mushroom' },
  { 'key': 'pear' },
  { 'key': 'brocolli' },
  { 'key': 'tomato' },
  { 'key': 'red-pepper' },
  { 'key': 'pineapple' },
  { 'key': 'strawberry' }
]
let current_size = 'small';

function Card(props) {
  const img = props.faceSideUp ? require('./vegetables/' + props.image + '.png') : null;
  // const content = props.faceSideUp ? props.image : null;
  return (
    <div className="card">
      <div
        style={{ backgroundImage: 'url(' + img + ')' }}
        className="card-img"
        onClick={props.onClick}
      >
      </div>
    </div>
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
      currentCard: undefined,
      acceptingClick: true
    };
  }

  handleClick(i) {
    // const currentCard = this.state.cards[i];
    // console.log('currentcard is', currentCard);
    const flipBothOver = () => {
      this.state.flippedCard.flipped = false;
      this.state.currentCard.flipped = false;
      this.setState({
        flippedCard: undefined,
        currentCard: undefined,
        acceptingClick: true
      });
      console.log('done');
    }
    if (!this.state.acceptingClick) {
      //both are set
      flipBothOver();
      return;
    }


    this.setState({
      currentCard: this.state.cards[i]
    }, () => {
      if (this.state.currentCard.flipped) {
        // already turned over
        return;
      }

      if (this.state.flippedCard) {
        this.setState({
          clickedPairs: this.state.clickedPairs + 1
        });
        // another card has been turned over
        this.state.currentCard.flipped = true;
        if (this.state.flippedCard.key === this.state.currentCard.key) {
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
            if (!this.state.acceptingClick) {
              flipBothOver();
            }
          }, 1500);
        }
      } else {
        // no other card has been turned over
        this.setState({ flippedCard: this.state.currentCard });
        this.state.currentCard.flipped = true;
      }


    });
    
  }



  render() {
    return (<div><div className="cardContainer">
      {this.state.cards.map((c, i) => {
        return <Card
          key={i}
          faceSideUp={c.flipped}
          // image={c.key}
          image={c.key}
          onClick={() => this.handleClick(i)}
        />;
      })}</div>
      <p>{this.state.clickedPairs}</p>
      {/* <div
        className="switch-container"
        >
          {Object.entries(sizes)(([s, n]) => {
            return <span
              className="option"
            >
              {s}
            </span>
          })}
        </div> */}
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
