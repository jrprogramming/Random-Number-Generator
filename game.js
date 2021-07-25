let RAND_NUMBER;
let MAX_NUMBER;
let GUESS_COUNT;
let GUESS_NUMBER;
let GAME_OVER;
let PLAYERS;
let PLAYER_ONE_PLAYED = false;


const enterRandNum = () => {
    document.querySelector('#pop-up-header').textContent = `Enter a number player ${PLAYER_ONE_PLAYED ? 1 : 2}`;
    document.querySelector('#pop-up-body').innerHTML = '';
    document.querySelector('#pop-up-body').innerHTML += `
        <p id="pop-up-error-message"><p/>
    `;
    document.querySelector('#pop-up-body').innerHTML += `
        <input class="textfield" id="magic-num-textfield" type="number" min="1" max="${MAX_NUMBER}" placeholder="" autofocus/>
    `;
    const button = document.createElement('button');
    button.id = 'submit-magic-num';
    button.className = 'game-button submit-button';
    button.textContent = 'Submit';
    button.addEventListener('click', () => {
        const num = parseInt(document.querySelector('#magic-num-textfield').value);
        if (parseInt(num) && num > 0 && num <= MAX_NUMBER) {
            RAND_NUMBER = num;
            document.querySelector('#pop-up-header').textContent = '';
            document.querySelector('#pop-up-body').innerHTML = '';
            document.querySelector('#dark-background').classList.remove('display-pop-up');
        } else if (isNaN(num)) {
            document.querySelector('#pop-up-error-message').textContent = 'A number must be entered.';
            return;
        } else if (num < 1) {
            document.querySelector('#pop-up-error-message').textContent = 'The number cannot be below 1';
            return;
        } else if (num > MAX_NUMBER) {
            document.querySelector('#pop-up-error-message').textContent = `The number cannot be greater than ${MAX_NUMBER}`;
            return;
        }
    });
    document.querySelector('#pop-up-body').appendChild(button);
}

const displayPopUp = () => {
    document.querySelector('#dark-background').classList.add('display-pop-up');
    document.querySelector('#pop-up-header').textContent = PLAYER_ONE_PLAYED ? 'Confirm Player 2 is not looking' : 'Confirm Player 1 is not looking';
    const button = document.createElement('button');
    button.id = 'not-looking';
    button.className = 'game-button submit-button';
    button.textContent = 'Not Looking!';
    button.addEventListener('click', enterRandNum);
    document.querySelector('#pop-up-body').appendChild(button);
}

const newGame = (switchPlayers) => {
    const params = new URLSearchParams(window.location.search);
    const numPlayers = params.get('numPlayers');
    const difficulty = params.get('difficulty');
    const playerNames = params.get('playerNames').split(',');

    GUESS_COUNT = 0;
    GUESS_NUMBER = null;
    MAX_NUMBER = parseInt(difficulty.split(' ')[1]);
    GAME_OVER = false;

    if (!!switchPlayers) {
        PLAYER_ONE_PLAYED = !PLAYER_ONE_PLAYED;
    }

    document.querySelector('#dark-background').classList.remove('display-pop-up');
    document.querySelector('#pop-up-header').textContent = '';
    document.querySelector('#pop-up-body').innerHTML = '';
    document.querySelector('#enter-a-number').textContent = 'Enter a number';
    document.querySelector('#error-message').textContent = '';
    document.querySelector('#guesses').textContent = '0';
    document.querySelector('#enter-number-textfield').value = '';

    document.querySelector('#range').textContent = `Range: 1 - ${MAX_NUMBER}`;
    RAND_NUMBER = Math.floor(Math.random() * (MAX_NUMBER)) + 1;
    PLAYERS = playerNames;
    updateLeaderboard();

    if (numPlayers === 'Two') {
        displayPopUp();
    }
}

const gameOver = () => {
    document.querySelector('#dark-background').classList.add('display-pop-up');
    document.querySelector('#pop-up-header').textContent = 'Game Over'
    if (PLAYERS.length === 1) {
        document.querySelector('#pop-up-body').innerHTML += `
            <p>Congratulations!</p>
            <p>${RAND_NUMBER} was the secret number</p>
            <button id="play-again-button" class="game-button submit-button" onclick="newGame()">New Game</button>
            <a href="./index.html" id="quit-button" class="game-button submit-button">Quit</a>
        `;
    } else {
        document.querySelector('#pop-up-body').innerHTML += ` 
            <p>Congratulations!</p>
            <p>${RAND_NUMBER} was the secret number</p>
            <button id="play-again-button" class="game-button submit-button" onclick="newGame(true)">Switch turns</button>
            <a href="./index.html" id="quit-button" class="game-button submit-button">Quit</a>
        `;
    }
}

window.onload = () => newGame();


document.querySelector('#submit-button').addEventListener('click', () => {
    if (GAME_OVER) {
        return;
    }
    const guessNumber = parseInt(document.querySelector('#enter-number-textfield').value);
    
    if (document.querySelector('#error-message').classList.contains('help-message')) {
        document.querySelector('#error-message').classList.remove('help-message');
    }
    if (isNaN(guessNumber)) {
        document.querySelector('#error-message').textContent = 'A number must be entered.';
        return;
    } else if (guessNumber < 1) {
        document.querySelector('#error-message').textContent = 'The number cannot be below 1';
        return;
    } else if (guessNumber > MAX_NUMBER) {
        document.querySelector('#error-message').textContent = `The number cannot be greater than ${MAX_NUMBER}`;
        return;
    }

    document.querySelector('#error-message').textContent = '';
    GUESS_COUNT ++;

    document.querySelector('#guesses').textContent = GUESS_COUNT;
    document.querySelector('#enter-number-textfield').value = '';

    if (guessNumber === RAND_NUMBER) {
        document.querySelector('#enter-a-number').textContent = 'You got it!';
        GAME_OVER = true;
        updateLeaderboard();
        gameOver();
        return;
    }
    GUESS_NUMBER = guessNumber;
    document.querySelector('#enter-a-number').textContent = guessNumber > RAND_NUMBER ? 'Too High. Try Again' : 'Too Low. Try Again';
    document.querySelector('#enter-number-textfield').focus();
    updateLeaderboard();
});

document.querySelector("#help-button").addEventListener('click', () => {
    if (GAME_OVER) {
        return;
    }
    document.querySelector('#error-message').classList.add('help-message');
    if (!GUESS_NUMBER) {
        document.querySelector('#error-message').textContent = 'Enter a number before you get help';
        return;
    }

    let withinRange = Math.abs(GUESS_NUMBER - RAND_NUMBER);
    while (true) {
        if (Math.floor(withinRange / 100) === withinRange / 100 || withinRange + GUESS_NUMBER === MAX_NUMBER) {
            break;
        }
        withinRange ++;
    }

    document.querySelector('#error-message').textContent = `Your last guess was within ${withinRange} numbers`;
});

document.querySelector('#restart-button').addEventListener('click', newGame);

const updateLeaderboard = () => {
    const playerIndex = PLAYER_ONE_PLAYED ? 1 : 0; 

    const jsonLeaders = JSON.parse(localStorage.getItem('leaders'));

    let leaders;

    if (jsonLeaders) {
        leaders = jsonLeaders.filter(leader => leader.name && (leader.bestScore > 0 || leader.name === PLAYERS[playerIndex]));
    } else {
        leaders = [{
            name: PLAYERS[playerIndex],
            guesses: GUESS_COUNT,
            bestScore: 0,
            firstTime: true
        }];
    }

    const user = leaders.find(leader => leader.name === PLAYERS[playerIndex]) ?? {
        name: PLAYERS[playerIndex],
        guesses: GUESS_COUNT,
        bestScore: 0,
        firstTime: true
    };

    if (!leaders.find(leader => leader.name === user.name)) {
        leaders.push(user);
    }

    if ((user.bestScore + 1 === GUESS_COUNT && user.firstTime) || (GAME_OVER && user.bestScore > GUESS_COUNT)) {
        user.bestScore = GUESS_COUNT;
    }

    if (GAME_OVER && user.firstTime) {
        user.firstTime = false;
    }

    user.guesses = GUESS_COUNT;

    leaders.sort((a, b) => {
        return a.bestScore - b.bestScore;
    });

    document.querySelector('#ranking-div').innerHTML = '';
    leaders.forEach(leader => {
        document.querySelector('#ranking-div').innerHTML += `
            <div class="leader">
                <h1 class="scoreboard-player">${leader.name}</h1>
                <h1 class="guess-count">${leader.bestScore}</h1>
            </div>
        `;
    });

    localStorage.setItem('leaders', JSON.stringify(leaders));
}

