// Game state
let gameState = {
    players: {
        girl: { name: '', score: 0 },
        boy: { name: '', score: 0 }
    },
    currentPlayer: 'girl',
    roundCount: 0,
    usedDares: [], // Track used dares with their round numbers
    currentDareIndex: -1, // Track current dare index
    dares: [
        "Kiss every part of your partner's face (lips, cheeks, forehead, chin, nose) while keeping seatbelts on.",
        "Give your partner a lingering hand massage and finish with a kiss on their wrist.",
        "Whisper your wildest fantasy in your partner's ear and seal it with a passionate kiss.",
        "Use only your lips to unwrap a candy and feed it to your partner.",
        "Lie back and let your partner kiss you anywhere they choose, but stay buckled in.",
        "Try to make the sexiest sound with a single touch—winner gets a kiss wherever they want.",
        "Play a song and kiss for the full length, without using your hands.",
        "Write a tiny message on your partner's arm or palm using your tongue.",
        "Hold hands and lock eyes for one minute, then make out for the next minute.",
        "Trade compliments—each must end with a kiss somewhere new.",
        "Suck on an ice cube, then kiss your partner so they feel the coolness.",
        "Give your partner a lap dance (as much as possible from your seat).",
        "Lean in to kiss your partner's neck or ear, with the seat in between.",
        "Pass a piece of fruit between your mouths, no hands allowed.",
        "Blindfold your partner and surprise them with a kissing attack.",
        "Swap chewing gum by passing it mouth-to-mouth.",
        "Lick your partner's lips, then kiss them deeply.",
        "Have a slow French kiss for one minute, focused on saliva play.",
        "Lick your partner's neck or collarbone and leave a hickey.",
        "Pass a mint or hard candy back and forth between your mouths, no dropping it!",
        "Wet your finger in your mouth, then gently trace your partner's lips or jawline.",
        "Kiss your partner's fingers, then take one in your mouth and suck it gently.",
        "Demonstrate your best oral technique on a fruit or snack with your mouth and tongue.",
        "Give your partner a slow, wet kiss and ask them to rate your technique.",
        "Flick your tongue playfully against your partner's teeth and see who laughs first.",
        "Kiss your partner's armpit and rate the scent on a scale of 1 to 10.",
        "Lick your partner's ear and whisper something naughty.",
        "Tickle your partner for one whole minute without stopping.",
        "Try to make your partner laugh using only your tongue (funny face/tongue tricks).",
        "Blow a raspberry on your partner's stomach and keep going until they giggle.",
        "Use only your nose to 'draw' a heart on your partner's neck.",
        "Kiss every freckle, mole, or mark you find on your partner's skin.",
        "Give your partner a 'motorboat' on any body part they choose.",
        "Ticklish dare: Let your partner tickle you anywhere for 45 seconds.",
        "Give your partner a hickey on a funny spot (like near their knee or elbow).",
        "Lick your partner's palm and try to guess what they ate last—with no peeking.",
        "Kiss your partner's elbow and make them do the same to you.",
        "Do a dramatic slow-motion make-out scene, complete with fake movie music.",
        "Blindfold your partner and give them surprise kisses on random body parts—they must guess where.",
        "Take turns who can make the loudest kissing sound—loser gets tickled.",
        "Slow dance with your partner to a romantic song, even if there's no music.",
        "Give your partner a romantic foot massage or back rub.",
        "Swap an item of clothing with your partner and keep it on for 10 minutes.",
        "Blindfold your partner and feed them a mystery snack.",
        "Seductively eat a banana or other fruit while maintaining eye contact.",
        "Draw a temporary tattoo on your partner with a pen or lipstick.",
        "Do your best celebrity impression and make it as flirty as possible.",
        "Twerk to the most embarrassing song on your playlist.",
        "Kiss your partner in a way you've never tried before.",
        "Act out your first kiss together but do it in slow motion or as if in a movie scene.",
        "Write three things you love about your partner on their arm or hand using your fingertip.",
        "Pass a piece of chocolate or candy between your mouths without dropping it.",
        "Give your partner a back massage using only your elbows.",
        "Try to balance an ice cube or cold bottle on your body for 30 seconds while your partner watches.",
        "Text your partner a flirty or naughty message—even if they're right with you.",
        "Play strip rock-paper-scissors: loser removes an accessory or outer layer.",
        "Whisper your favorite pickup line into your partner's ear.",
        "Serenade your partner with a silly or romantic song and end with a kiss.",
        "Make your partner blush: give compliments until they can't take it anymore.",
        "Pretend to be strangers role-playing a first meeting—keep going for five minutes."
    ]
};

// DOM elements
const homePage = document.getElementById('home-page');
const gamePage = document.getElementById('game-page');
const girlNameInput = document.getElementById('girl-name');
const boyNameInput = document.getElementById('boy-name');
const startGameBtn = document.getElementById('start-game');
const currentPlayerEl = document.getElementById('current-player');
const currentDareEl = document.getElementById('current-dare');
const girlScoreNameEl = document.getElementById('girl-score-name');
const boyScoreNameEl = document.getElementById('boy-score-name');
const girlScoreEl = document.getElementById('girl-score');
const boyScoreEl = document.getElementById('boy-score');
const nailedItBtn = document.getElementById('nailed-it');
const massiveFailBtn = document.getElementById('massive-fail');
const endGameBtn = document.getElementById('end-game');

// Initialize game
function initGame() {
    startGameBtn.addEventListener('click', startGame);
    nailedItBtn.addEventListener('click', () => handleAction('success'));
    massiveFailBtn.addEventListener('click', () => handleAction('fail'));
    endGameBtn.addEventListener('click', endGame);

    // Allow Enter key to start game
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && homePage.classList.contains('active')) {
            startGame();
        }
    });
}

function startGame() {
    const girlName = girlNameInput.value.trim();
    const boyName = boyNameInput.value.trim();

    if (!girlName || !boyName) {
        alert('Please enter both names!');
        return;
    }

    // Set player names
    gameState.players.girl.name = girlName;
    gameState.players.boy.name = boyName;

    // Update UI with names
    girlScoreNameEl.textContent = girlName;
    boyScoreNameEl.textContent = boyName;

    // Switch to game page
    homePage.classList.remove('active');
    gamePage.classList.add('active');

    // Start first round
    nextRound();
}

function nextRound() {
    const currentPlayerData = gameState.players[gameState.currentPlayer];

    // Update current player display
    currentPlayerEl.textContent = currentPlayerData.name;

    // Get random dare
    const randomDare = getRandomDare();
    currentDareEl.textContent = randomDare;

    // Update scores
    updateScoreDisplay();
}

function getRandomDare() {
    const COOLDOWN_ROUNDS = 15;
    const currentRound = gameState.roundCount;

    // Get available dares (not used in the last 15 rounds)
    const availableDareIndexes = [];

    for (let i = 0; i < gameState.dares.length; i++) {
        const usedDare = gameState.usedDares.find(used => used.index === i);

        // If dare was never used or was used more than 15 rounds ago
        if (!usedDare || (currentRound - usedDare.round) >= COOLDOWN_ROUNDS) {
            availableDareIndexes.push(i);
        }
    }

    // If no dares are available (shouldn't happen with 60 dares), reset the cooldown
    if (availableDareIndexes.length === 0) {
        gameState.usedDares = [];
        for (let i = 0; i < gameState.dares.length; i++) {
            availableDareIndexes.push(i);
        }
    }

    // Pick a random available dare
    const randomAvailableIndex = Math.floor(Math.random() * availableDareIndexes.length);
    const selectedDareIndex = availableDareIndexes[randomAvailableIndex];

    // Store the current dare index for later tracking
    gameState.currentDareIndex = selectedDareIndex;

    return gameState.dares[selectedDareIndex];
}

function handleAction(action) {
    const currentPlayerData = gameState.players[gameState.currentPlayer];

    if (action === 'success') {
        currentPlayerData.score += 10;
    } else if (action === 'fail') {
        currentPlayerData.score -= 2;
        // Don't let score go below 0
        if (currentPlayerData.score < 0) {
            currentPlayerData.score = 0;
        }
    }

    // Mark the current dare as used
    if (gameState.currentDareIndex !== -1) {
        // Remove any existing entry for this dare index
        gameState.usedDares = gameState.usedDares.filter(used => used.index !== gameState.currentDareIndex);

        // Add the dare with current round number
        gameState.usedDares.push({
            index: gameState.currentDareIndex,
            round: gameState.roundCount
        });
    }

    // Increment round count
    gameState.roundCount++;

    // Switch to next player
    gameState.currentPlayer = gameState.currentPlayer === 'girl' ? 'boy' : 'girl';

    // Start next round
    setTimeout(() => {
        nextRound();
    }, 500);
}

function updateScoreDisplay() {
    girlScoreEl.textContent = gameState.players.girl.score;
    boyScoreEl.textContent = gameState.players.boy.score;
}

function endGame() {
    // Reset game state
    gameState.players.girl.score = 0;
    gameState.players.boy.score = 0;
    gameState.currentPlayer = 'girl';
    gameState.roundCount = 0;
    gameState.usedDares = [];
    gameState.currentDareIndex = -1;

    // Clear input fields
    girlNameInput.value = '';
    boyNameInput.value = '';

    // Switch back to home page
    gamePage.classList.remove('active');
    homePage.classList.add('active');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
