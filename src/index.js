import React from "react";
import ReactDOM from "react-dom";
import logo from "./logo.svg";
import "./App.css";

const sizes = {
  //number of PAIRS
  'small': 8,
  'medium': 10,
  'large': 12,
  'x-large': 14
};

var currentSize = 'small';

const cards = [
  { key: "banana" },
  { key: "apple" },
  { key: "bell-pepper" },
  { key: "grapes" },
  { key: "carrot" },
  { key: "eggplant" },
  { key: "onion" },
  { key: "mushroom" },
  { key: "pear" },
  { key: "brocolli" },
  { key: "tomato" },
  { key: "red-pepper" },
  { key: "pineapple" },
  { key: "strawberry" },
];

function Card(props) {
  const img = props.faceSideUp
    ? require("./vegetables/" + props.image + ".png")
    : require("./topography.png");
  // const content = props.faceSideUp ? props.image : null;
  return (
    <div className="card">
      <div
        style={{ backgroundImage: "url(" + img + ")" }}
        className={"card-img " + (props.faceSideUp ? 'pic' : 'no-pic')}
        onClick={props.onClick}
      ></div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: this.initializeArray(),
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
        acceptingClick: true,
      });
      console.log("done");
    };
    if (!this.state.acceptingClick) {
      //both are set
      flipBothOver();
      return;
    }

    this.setState(
      {
        currentCard: this.state.cards[i],
      },
      () => {
        if (this.state.currentCard.flipped) {
          // already turned over
          return;
        }

        if (this.state.flippedCard) {
          this.setState({
            clickedPairs: this.state.clickedPairs + 1,
          });
          // another card has been turned over
          this.state.currentCard.flipped = true;
          if (this.state.flippedCard.key === this.state.currentCard.key) {
            // match
            this.setState({
              matchedPairs: this.state.matchedPairs + 1,
              flippedCard: undefined,
            }, () => {
              if(this.state.matchedPairs === sizes[currentSize]){
                console.log('woo!!');
                localStorage.setItem(currentSize, this.state.clickedPairs.toString());
              }
            });
          } else {
            // no match
            this.setState({
              acceptingClick: false,
            });
            setTimeout(() => {
              if (!this.state.acceptingClick) {
                flipBothOver();
              }
            }, 2000);
          }
        } else {
          // no other card has been turned over
          this.setState({ flippedCard: this.state.currentCard });
          this.state.currentCard.flipped = true;
        }
      }
    );
    
  }

  initializeArray() {
    console.log('init array');
    const halfArr = cards.slice(0, sizes[currentSize]);
    let arr = halfArr.concat([...halfArr].map((i) => ({ ...i })));
    shuffleArray(arr);
    arr.forEach((card) => {
      card.flipped = false;
    });
    return arr;
  }

  changeSize(size) {
    currentSize = size;
    this.setState({
      cards: this.initializeArray(),
      clickedPairs: 0,
      matchedPairs: 0,
      flippedCard: undefined,
      currentCard: undefined,
      acceptingClick: true
    });
  }

  render() {
    const bestScore = localStorage.getItem(currentSize);
    const bestScoreMsg = (bestScore ? bestScore : 'N/A');
    return (
      <div className="cardContainer">
        <div className="switch-container">
          {Object.entries(sizes).map(([s, n]) => {
            return (
              <span
                key={s}
                className={"option " + (currentSize === s ? "selected" : "")}
                onClick={() => this.changeSize(s)}
              >
                {s}
              </span>
            );
          })}
        </div>
        <div className="score-container">
          <span style={{float:'left'}}>{'Current score: ' + this.state.clickedPairs}</span>
          <span style={{float:'right'}}>{'Best score: ' + bestScoreMsg}</span>
        </div>
        {this.state.cards.map((c, i) => {
          return (
            <Card
              key={i}
              faceSideUp={c.flipped}
              // image={c.key}
              image={c.key}
              onClick={() => this.handleClick(i)}
            />
          );
        })}
      </div>
    );
  }
}



function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
