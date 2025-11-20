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
    "Compliment every person in the group with a different facial expression for each compliment.",
    "Give the person next to you a dramatic, over-the-top handshake.",
    "Whisper the funniest thing you can think of into your friend's ear and keep a straight face.",
    "Use only your mouth (no hands) to unwrap a candy and drop it into a cup.",
    "Lean back and let your friends doodle a tiny symbol on your arm with a pen.",
    "Try to make the funniest sound with just one poke from another player—winner decides the next dare.",
    "Play a song and dance without using your hands for the full duration.",
    "Write a tiny message or doodle on someone's arm using a pen held in your mouth.",
    "Hold eye contact with a friend for one minute, then both try not to laugh for the next minute.",
    "Trade compliments—each one must include a silly rhyme.",
    "Hold an ice cube for as long as you can and make the most dramatic reaction possible.",
    "Give someone a seated dance performance (PG & funny).",
    "Lean in and try to tell someone a joke with something blocking the space between you (like a pillow).",
    "Pass a piece of fruit between two spoons without dropping it.",
    "Blindfolded: guess who tapped your shoulder—if wrong, do a silly pose.",
    "Swap a piece of gum wrapper or paper between mouths by holding it with your teeth (no actual gum).",
    "Do your funniest lip-smacking sound and make everyone rate it.",
    "Have a 1-minute slow-motion dramatic staring contest.",
    "Draw a temporary mark or symbol on someone's arm using face paint.",
    "Pass a mint using only spoons held in your mouths.",
    "Wet your finger with water and draw a shape on someone’s hand—they must guess the shape.",
    "Kiss someone's hand… but only with an exaggerated blowing kiss gesture from afar.",
    "Demonstrate your best ‘food-eating technique’ on a fruit in a silly, theatrical way.",
    "Give someone your best overly dramatic slow clap and ask them to rate it.",
    "Do your funniest tongue trick (no touching anyone).",
    "Smell a friend's armpit (or elbow!) and rate the scent dramatically from 1 to 10.",
    "Pretend to be a spy and whisper a ‘secret mission’ into someone’s ear.",
    "Get tickled by a friend for one whole minute without fighting back.",
    "Try to make the group laugh using only funny faces or tongue tricks.",
    "Blow a raspberry on your own arm and act like it's the funniest thing ever.",
    "Use only your nose to ‘draw’ a shape in the air and have people guess it.",
    "Point out every freckle or mark on your own hand dramatically like you're a detective.",
    "Do a loud, silly ‘motorboat’ noise with your lips into the air—not on anyone.",
    "Ticklish dare: let the group choose where to poke you (PG only) for 45 seconds.",
    "Draw a tiny smiley near someone’s elbow using a marker.",
    "Lick your own palm (PG silly) and try to guess what snack you last ate.",
    "Touch elbows with someone and do a synchronized tiny dance routine.",
    "Act out a dramatic slow-motion action scene, complete with imaginary sound effects.",
    "Blindfolded: friends touch a random safe body part (hand, shoulder, etc.), and you must guess which.",
    "Compete for the loudest funny kissing sound—loser gets gently poked.",
    "Slow dance with a friend while both keeping completely straight faces.",
    "Give someone a friendly shoulder pat massage for 10 seconds.",
    "Swap an accessory (hat, ring, band) with a friend for 10 minutes.",
    "Blindfolded: let a friend feed you a mystery snack—guess what it is.",
    "Eat a banana or any fruit dramatically like a cartoon character.",
    "Draw a temporary tattoo on someone with a pen or marker.",
    "Do your best celebrity impression and make it hilarious.",
    "Twerk or dance dramatically to the most embarrassing song you can think of.",
    "Give someone a handshake in a way you’ve never done before.",
    "Reenact your first-ever handshake with someone but in slow motion like a movie scene.",
    "Write three nice things about someone using your fingertip on their palm.",
    "Pass a piece of candy between spoons held in your mouths—don’t drop it!",
    "Give someone a back massage using only your elbows (gentle & PG).",
    "Try to balance an ice cube on your arm or forehead for 30 seconds.",
    "Do your best dramatic acting of being ‘freezing cold’ for one minute.",
    "Text someone in the group a random silly message while sitting right next to them.",
    "Play strip rock-paper-scissors… but only with accessories like hats, bracelets, scrunchies.",
    "Whisper your best (PG) pickup line into someone’s ear without laughing.",
    "Serenade someone with the silliest or most dramatic song you can think of.",
    "Try to make a friend blush using only wholesome compliments.",
    "Role-play as strangers meeting for the first time—make it hilarious."
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
