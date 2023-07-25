// Required libraries
const readline = require('readline');

// Function to generate a deck of cards
function generateDeck() {
  const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Function to shuffle the deck of cards using Fisher-Yates algorithm
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Function to deal cards to players
function dealCards(players, deck) {
  const cardsPerPlayer = 3;
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let player of players) {
      player.cards.push(deck.pop());
    }
  }
}

// Function to check if a hand has a Trail (Three of a kind)
function hasTrail(hand) {
  const ranks = hand.map(card => card.rank);
  for (let rank of ranks) {
    if (ranks.filter(r => r === rank).length === 3) {
      return true;
    }
  }
  return false;
}

// Function to check if a hand has a Pure Sequence
function hasPureSequence(hand) {
  const suits = hand.map(card => card.suit);
  const ranks = hand.map(card => card.rank);
  return (
    suits.every(suit => suit === suits[0]) && // All cards have the same suit
    ranks.includes('A') && ranks.includes('K') && ranks.includes('Q')
  );
}

// Function to check if a hand has a Sequence
function hasSequence(hand) {
  const ranks = hand.map(card => card.rank);
  const uniqueRanks = [...new Set(ranks)];
  const sortedRanks = uniqueRanks.sort((a, b) => ranks.indexOf(a) - ranks.indexOf(b));
  return (
    sortedRanks.length === 3 &&
    sortedRanks[0] === 'A' && sortedRanks[1] === 'K' && sortedRanks[2] === 'Q'
  );
}

// Function to check if a hand has a Color (Flush)
function hasColor(hand) {
  const suits = hand.map(card => card.suit);
  return suits.every(suit => suit === suits[0]);
}

// Function to check if a hand has a Pair
function hasPair(hand) {
  const ranks = hand.map(card => card.rank);
  const uniqueRanks = [...new Set(ranks)];
  return uniqueRanks.length === 2;
}

// Function to determine the winner
function determineWinner(players) {
  let winner = players[0];
  let flag = 0;
  for (let i = 1; i < players.length; i++) {
    if (players[i].rank > winner.rank) {
      winner = players[i];
    } else if (players[i].rank === winner.rank) {
      if (players[i].value > winner.value) {
        winner = players[i];
      }
    }
  }
  for (let i=0; i< players.length; i++){
    if (players[i].value === winner.value) {
      flag++;
    }
  }
  if(flag>1){
    return null
  }
  return winner;
}

// Function to display the winner and their cards
function displayWinner(winner) {
  console.log('\x1b[32m%s\x1b[0m', `Winner: ${winner.name}`); // Print winner name in green
  console.log(`Reason: ${winner.reason}`);
  console.log(`Cards: ${winner.cards.map(card => `${card.rank} of ${card.suit}`).join(', ')}`);
}

// Function to display each player's name and cards
function displayPlayers(players) {
  for (let player of players) {
    console.log(`Player: ${player.name}`);
    console.log(`Cards: ${player.cards.map(card => `${card.rank} of ${card.suit}`).join(', ')}`);
    console.log('---------------------------');
  }
}

function arrangeDeck(winner){
  const players = [
    { name: 'Player A', cards: [] },
    { name: 'Player B', cards: [] },
    { name: 'Player C', cards: [] }
  ];

  const deck = shuffle(generateDeck());
  dealCards(players, deck);
  
  for (let player of players) {
    let reason = '';
    let rank = 0;
    let value = 0;

    if (hasTrail(player.cards)) {
      reason = 'Trail';
      rank = 6;
      value = 100;
    } else if (hasPureSequence(player.cards)) {
      reason = 'Pure Sequence';
      rank = 5;
      value = 90;
    } else if (hasSequence(player.cards)) {
      reason = 'Sequence';
      rank = 4;
      value = 80;
    } else if (hasColor(player.cards)) {
      reason = 'Color';
      rank = 3;
      value = 70;
    } else if (hasPair(player.cards)) {
      reason = 'Pair';
      rank = 2;
      value = 60;
    } else {
      reason = 'High Card';
      rank = 1;
      value = calculateHighCardValue(player.cards);
    }

    player.reason = reason;
    player.rank = rank;
    player.value = value;
  }
  return players
}

// Function to start the game
function startGame() {
  const players = [
    { name: 'Player A', cards: [] },
    { name: 'Player B', cards: [] },
    { name: 'Player C', cards: [] }
  ];

  const deck = shuffle(generateDeck());
  dealCards(players, deck);

  for (let player of players) {
    let reason = '';
    let rank = 0;
    let value = 0;

    if (hasTrail(player.cards)) {
      reason = 'Trail';
      rank = 6;
      value = 100;
    } else if (hasPureSequence(player.cards)) {
      reason = 'Pure Sequence';
      rank = 5;
      value = 90;
    } else if (hasSequence(player.cards)) {
      reason = 'Sequence';
      rank = 4;
      value = 80;
    } else if (hasColor(player.cards)) {
      reason = 'Color';
      rank = 3;
      value = 70;
    } else if (hasPair(player.cards)) {
      reason = 'Pair';
      rank = 2;
      value = 60;
    } else {
      reason = 'High Card';
      rank = 1;
      value = calculateHighCardValue(player.cards);
    }

    player.reason = reason;
    player.rank = rank;
    player.value = value;
  }
  displayPlayers(players);

  const winner = determineWinner(players);
  displayWinner(winner);
}

// Function to calculate the value of high cards in the hand
function calculateHighCardValue(hand) {
  const ranks = hand.map(card => card.rank);
  const values = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11
  };

  let value = 0;
  for (let rank of ranks) {
    if (values.hasOwnProperty(rank)) {
      value = Math.max(value, values[rank]);
    } else {
      value = Math.max(value, parseInt(rank));
    }
  }

  return value;
}


function main(selector){
  let winner_a = null;
  let players;
  while(winner_a === null){
    players = arrangeDeck();
    winner_a = determineWinner(players);
  }
  if (winner_a['name'] != selector){
    const indexA = players.findIndex(player => player.name === selector);
    const indexB = players.findIndex(player => player.name === winner_a['name']);

    // Swap the names of Player A and Player B
    const tempName = players[indexA].name;
    players[indexA].name = players[indexB].name;
    players[indexB].name = tempName;
  }

  for (let player of players) {
    let reason = '';
    let rank = 0;
    let value = 0;

    if (hasTrail(player.cards)) {
      reason = 'Trail';
      rank = 6;
      value = 100;
    } else if (hasPureSequence(player.cards)) {
      reason = 'Pure Sequence';
      rank = 5;
      value = 90;
    } else if (hasSequence(player.cards)) {
      reason = 'Sequence';
      rank = 4;
      value = 80;
    } else if (hasColor(player.cards)) {
      reason = 'Color';
      rank = 3;
      value = 70;
    } else if (hasPair(player.cards)) {
      reason = 'Pair';
      rank = 2;
      value = 60;
    } else {
      reason = 'High Card';
      rank = 1;
      value = calculateHighCardValue(player.cards);
    }

    player.reason = reason;
    player.rank = rank;
    player.value = value;
  }
  players.sort((a, b) => a.name.localeCompare(b.name));
  displayPlayers(players)
  const winner = determineWinner(players);

  displayWinner(winner);
}

function askForWinner() {
  rl.question('Please select the winner: A, B, or C... ', (value) => {
    let selector;
    if (value === "A") {
      selector = "Player A";
      main(selector);
      rl.close();
    } else if (value === "B") {
      selector = "Player B";
      main(selector);
      rl.close();
    } else if (value === "C") {
      selector = "Player C";
      main(selector);
      rl.close();
    } else {
      console.log(`Invalid input: ${value}. Please select one of A, B, or C.`);
      askForWinner();
    }
  });
}

// Creating a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Starting the game when the user enters a command
askForWinner();
