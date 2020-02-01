// const util = {
//     createTextElement: function(textUpperPart) {
        
//     }
// }

const randomWordLists = {
    easy: ['Airplane', 'Ears', 'Piano', 'Angry', 'Elephant', 'Pinch', 'Baby', 'Fish', 'Reach', 'Ball', 'Flick', 'Remote', 'Baseball', 'Football', 'Roll', 'Basketball', 'Fork', 'Sad', 'Bounce', 'Giggle', 'Scissors', 'Cat', 'Golf', 'Skip', 'Chicken', 'Guitar', 'Sneeze', 'Chimpanzee', 'Hammer', 'Spin', 'Clap', 'Happy', 'Spoon', 'Cough', 'Horns', 'Stomp', 'Cry', 'Joke', 'Stop', 'Dog', 'Mime', 'Tail', 'Drink', 'Penguin', 'Toothbrush', 'Drums', 'Phone', 'Wiggle', 'Deer', 'Duck', 'Bump', 'Kite', ],
    
    medium: ['Birthday', 'Hedgehog', 'Pizza', 'Blanket', 'Helicopter', 'President', 'Bright', 'Hurricane', 'Rainbow', 'Rollercoaster', 'Christmas', 'Light', 'Shadow', 'Coffee', 'Magic', 'Shopping', 'Cradle', 'Makeup', 'Shuffle', 'Marriage', 'Slice', 'Drool', 'Mash', 'Slip n’ slide', 'Electric', 'Measure', 'Smear', 'Excitement', 'Mirror', 'Spider', 'Monster', 'Firefighter', 'Motorcycle', 'Trampoline', 'Flashlight', 'Nightmare', 'Waterfall', 'Garden', 'Nosey', 'Window', 'Giraffe', 'Overwhelmed', 'Heavy', 'Pancakes', 'Photographer', ],
    
    hard: ['Hippopotamus', 'Awkward', 'Bagpipes', 'Banjo', 'Croquet', 'Crypt', 'Dwarves', 'Fishhook', 'Fjord', 'Gazebo', 'Gypsy', 'Haiku', 'Haphazard', 'Hyphen', 'Ivory', 'Jazzy', 'Jiffy', 'Jinx', 'Jukebox', 'Kayak', 'Kiosk', 'Klutz', 'Memento', 'Mystify', 'Numbskull', 'Ostracize', 'Oxygen', 'Pajama', 'Phlegm', 'Pixel', 'Polka', 'Quad', 'Quip', 'Rhythmic', 'Rogue', 'Sphinx', 'Squawk', 'Swivel', 'Toady', 'Twelfth', 'Unzip', 'Waxy', 'Yacht', 'Zealous', 'Zigzag', 'Zippy', 'Zombie',],
}

const localState = {
    randomWord: '',
    incorrectCount: 0,
    winningCondition: 0,
}

// Gets random word from array and adds it to local state
const getRandomWord = (difficulty) => {
    const newRandomWord = randomWordLists[difficulty][Math.floor(Math.random() * randomWordLists[difficulty].length)];

    localState.randomWord === newRandomWord
        ? getRandomWord(difficulty)
        : localState.randomWord = newRandomWord;
}

// Initiates a new game
const startGame = (ifRetry) => {
    // Hides the modal that gets shown at the end of the game (only relevant when starting game n+1)
    document.querySelector('.modalWrapper').style.display = 'none';

    const difficultyLevel = document.querySelector('.difficultySelector').value;
    // If user won last round, or this is first game, generate new word. If user lost last game, keep old word, so that the user can retry.
    ifRetry === 'retry'
        ? null
        : getRandomWord(difficultyLevel);

    // Set winningCondition in local state equal to length of word. Will be reduced by 1 for every letter correctly guessed
    localState.winningCondition = localState.randomWord.length;

    // Select div Element containing button to start game
    const textUpperPart = document.querySelector('.wordDisplay')
    
    // Select div element that will contain user input field and submit button
    const userInputWrapper = document.querySelector('.userInput')
    

    if (textUpperPart.querySelector('button')) {
        // Removing eventListener from Start button
        textUpperPart.querySelector('.startGame').removeEventListener('click', startGame)
        // Removing the 'Start" button
        textUpperPart.querySelector('button').remove()
    }

    // Add fields for the letters
    for (let i = 0; i < localState.randomWord.length; i++) {
        const textField = document.createElement('p');
        textField.classList.add('textField');
        textField.textContent = ` `;
        textField.setAttribute('key', `${localState.randomWord[i]}`);
        textUpperPart.insertAdjacentElement('beforeend', textField)
    }

    // Creating input field accepting input of length 1 and adding it to the DOM
    const createUserInput = document.createElement('input');
    createUserInput.setAttribute('type', 'text');
    createUserInput.setAttribute('placeholder', 'Please guess a letter.');
    createUserInput.setAttribute('maxlength', 1);
    createUserInput.classList.add('inputField')
    userInputWrapper.insertAdjacentElement('beforeend', createUserInput)

    // Creating submit button and adding it to the DOM
    const createInputSubmit = document.createElement('button');
    createInputSubmit.setAttribute('type', 'button');
    createInputSubmit.classList.add('submitUserInput');
    createInputSubmit.textContent = 'Submit';
    userInputWrapper.insertAdjacentElement('beforeend', createInputSubmit)

    // Add event listener to the submit button for user input
    userInputWrapper.querySelector('.submitUserInput').addEventListener('click', onUserInput);

    // Add event listener to input field for 'enter' key
    const userInputField = document.querySelector('.inputField');
    userInputField.addEventListener('keydown', (event) => event.key === 'Enter' ? onUserInput() : null)
}

const onUserInput = () => {
    const userInput = document.querySelector('input').value.toLowerCase();
    
    // For each incorrect answer, the incorrectCount state is incremeneted
    const incorrectAnswer = () => {
        localState.incorrectCount = localState.incorrectCount + 1;
        revealHangman();
    }
    
    localState.randomWord.toLowerCase().includes(userInput)
    ? revealLetter(userInput) // Upon correct answer the function is run, passing the users input as an argument
    : incorrectAnswer(); // Upon incorrect answer, the function above is called
    
    // Clears the input field so that user can immediately enter next guess without having to delete previous input
    document.querySelector('input').value = '';
}

const revealLetter = (letter) => {
    const targetWord = document.querySelectorAll('.textField')  // select all <p> elements with class 'textfield' (this consist of the individual letters of the word to be guessed)
    targetWord.forEach(item => {       // take each inidivual <p> elements and loop over them
        if (item.attributes.key.nodeValue.toLowerCase() === letter) {   
            if (item.innerHTML !== letter.toUpperCase()) {
                item.innerHTML = `${letter.toUpperCase()}`
                localState.winningCondition = localState.winningCondition - 1;
            }
        }
    })
    // Winning condition for game. If winningCondition reaches 0, player wins
    localState.winningCondition === 0
    ? onGameEnd('win')
    : null;
}

// Depending on the value of the incorrectCount, the hangman parts are revealed
const revealHangman = () => {
    const hangman = document.querySelector('.hangman');

    switch (localState.incorrectCount) {
        case 1:
            hangman.querySelector('.head').removeAttribute('hidden');
            break;
        case 2:
            hangman.querySelector('.body').removeAttribute('hidden');
            break;
        case 3:
            hangman.querySelector('.left-arm').removeAttribute('hidden');
            break;
        case 4:
            hangman.querySelector('.right-arm').removeAttribute('hidden');
            break;
        case 5:
            hangman.querySelector('.left-leg').removeAttribute('hidden');
            break;
        case 6:
            hangman.querySelector('.right-leg').removeAttribute('hidden');
            onGameEnd('lose');
            break;
        default:
            break;
    }
}

// When the user guesses the word or the hangman is revealed completely, a modal appears
const onGameEnd = (result) => {
    const modal = document.querySelector('.modalWrapper')
    const modalText = modal.querySelector('.modalText');
    
    result === 'lose'
    ? modalText.innerHTML = `Too bad, you didn't manage to solve it this time. Would you like to retry?`
    : modalText.innerHTML = `Hurray, you solved it, go you! Would you like to play again?`

    modal.style.display = 'block'; // default style is 'display: none' to hide the modal
}

// Resets the game after the user has WON, depending on user choice on modal
const resetGame = (ifRetry) => {
    const textfields = document.querySelectorAll('.textField');
    const hangman = document.querySelectorAll('.bodyPart');
    const userInputWrapper = document.querySelector('.userInput');

    // Remove all the <p> elements containing the individual letters of the word to be guessed
    textfields.forEach(item => {
        item.remove();
    })

    // Hide the parts of the hangman again
    hangman.forEach(item => {
        item.setAttribute('hidden', '')
    })

    // Remove all event listeners in order to keep background processes to a minimum
    userInputWrapper.removeEventListener('click', onUserInput);

    while (userInputWrapper.firstChild) {
        userInputWrapper.removeChild(userInputWrapper.firstChild)
    }

    // Reset the incorrectCount
    localState.incorrectCount = 0;

    startGame(ifRetry)
}

// Add various event listeners
const addListenerStartBtn = () => {
    document.querySelector('.startGame').addEventListener('click', startGame);
}

const handleModalBtn = (event) => {
    const modalText = document.querySelector('.modalText').innerHTML

    // If user didn't guess word, let them retry using the same word. If they won, generate new word
    if (modalText.includes('retry')) {
        event.target.innerHTML === 'Yes'
            ? resetGame('retry')
            : location.reload()
    } else {
        event.target.innerHTML === 'Yes'
            ? resetGame()
            : location.reload()
    }
}

const addListenerModal = () => {
    const closeBtn = document.querySelectorAll('.close')
    
    closeBtn.forEach(item => {
        item.addEventListener('click', handleModalBtn)
    })
}

addListenerModal();
document.querySelector('.startNewGame').addEventListener('click', resetGame);
