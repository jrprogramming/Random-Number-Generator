Object.values(document.querySelectorAll('.game-button')).forEach(button => button.addEventListener('click', () => {
    Object.values(document.querySelectorAll('.game-button')).forEach(otherButton => {
        if (otherButton === button || otherButton.classList[0] !== button.classList[0]) {
            return;
        }
        otherButton.classList.remove('button-selected');
    });
    if (button.classList.contains('button-selected') || button.id === 'start-button') {
        return;
    }
    button.classList.add('button-selected');
    const playerOneName = document.querySelector('#player-1-name').value;
    if (button.id === 'two-players-button') {
        document.querySelector('#textfield-div').innerHTML += `<input class="textfield" id="player-2-name" type="text" minlength="4" maxlength="30" placeholder="Player 2 Name"/>`;
        document.querySelector('#player-1-name').value = playerOneName;
        if (playerOneName.trim()) {
            document.querySelector('#player-2-name').focus();
        }
    } else if (button.id === 'one-player-button') {
        document.querySelector('#textfield-div').innerHTML = `<input class="textfield" id="player-1-name" type="text" minlength="4" maxlengh="30" placeholder="Player 1 Name" autofocus/>`;
        document.querySelector('#player-1-name').value = playerOneName;
        document.querySelector('#player-1-name').focus();
    }
}));

document.querySelector('#start-button').addEventListener('click', () => {
    const numPlayers = document.querySelector('.player-button.button-selected').textContent;
    const difficulty = document.querySelector('.difficulty-button.button-selected').textContent;
    const playerNames = Object.values(document.querySelectorAll('.textfield')).map(textfield => textfield.value.trim());

    if (!playerNames.every(player => player)) {
        document.querySelector('#error-message').textContent = 'Every name must be entered';
        return;
    }

    document.querySelector('#error-message').textContent = '';

    if (numPlayers === 'Two') {
        location.href = `game.html?numPlayers=${numPlayers}&difficulty=${difficulty}&playerNames=${playerNames}`;
        return;
    }

    const message = 'The computer is thinking';
    document.querySelector('#pop-up-header').textContent = message;
    document.querySelector('#dark-background').classList.add('display-pop-up');

    for (let i = 1; i <= 4; i ++) {
        let newMessage = message
        for (let j = 1; j <= i % 4; j ++) {
            newMessage += '.';
        }
        setTimeout(() => {
            document.querySelector('#pop-up-header').textContent = newMessage;
            if (i === 4) {
                document.querySelector('#dark-background').classList.remove('display-pop-up');
                location.href = `game.html?numPlayers=${numPlayers}&difficulty=${difficulty}&playerNames=${playerNames}`;
            }
        }, 1000 * i);
    }
});

