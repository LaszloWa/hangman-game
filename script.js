// const util = {
//     createTextElement: function(textUpperPart) {
        
//     }
// }



const randomWordList = ['Hippopotamus', 'Awkward', 'Bagpipes', 'Banjo', 'Croquet', 'Crypt', 'Dwarves', 'Fishhook', 'Fjord', 'Gazebo', 'Gypsy', 'Haiku', 'Haphazard', 'Hyphen', 'Ivory', 'Jazzy', 'Jiffy', 'Jinx', 'Jukebox', 'Kayak', 'Kiosk', 'Klutz', 'Memento', 'Mystify', 'Numbskull', 'Ostracize', 'Oxygen', 'Pajama', 'Phlegm', 'Pixel', 'Polka', 'Quad', 'Quip', 'Rhythmic', 'Rogue', 'Sphinx', 'Squawk', 'Swivel', 'Toady', 'Twelfth', 'Unzip', 'Waxy', 'Yacht', 'Zealous', 'Zigzag', 'Zippy', 'Zombie',]

const localState = {
    randomWord: '',
    incorrectCount: 0
}


const getRandomWord = () => {
    localState.randomWord = randomWordList[Math.floor(Math.random() * randomWordList.length)]
}


const startGame = () => {
    document.querySelector('.modalWrapper').style.display = 'none';

    //Generate random word
    getRandomWord();

    // Select div Element containing button   
    const textUpperPart = document.querySelector('.wordDisplay')
    
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
        console.log(textField)
        textField.classList.add('textField');
        textField.textContent = ` `;
        textField.setAttribute('key', `${localState.randomWord[i]}`);
        textUpperPart.insertAdjacentElement('beforeend', textField)
    }

    // Input field accepting input of length 1
    const userInput = document.createElement('input');
    userInput.setAttribute('type', 'text');
    userInput.setAttribute('placeholder', 'Please guess a letter.');
    userInput.setAttribute('maxlength', 1);
    userInput.classList.add('inputField')
    userInputWrapper.insertAdjacentElement('beforeend', userInput)

    // Submit button
    const inputSubmit = document.createElement('button');
    inputSubmit.setAttribute('type', 'button');
    inputSubmit.classList.add('submitUserInput');
    inputSubmit.textContent = 'Submit';
    userInputWrapper.insertAdjacentElement('beforeend', inputSubmit)

    // Add event listener to the input fields
    userInputWrapper.querySelector('.submitUserInput').addEventListener('click', onUserInput);
}


const resetGame = () => {
    const textfields = document.querySelectorAll('.textField');
    const hangman = document.querySelectorAll('.bodyPart');
    const userInputWrapper = document.querySelector('.userInput');

    console.log('resetGame', hangman)
    textfields.forEach(item => {
        item.remove();
    })

    hangman.forEach(item => {
        item.setAttribute('hidden', '')
    })

    userInputWrapper.removeEventListener('click', onUserInput);

    while (userInputWrapper.firstChild) {
        userInputWrapper.removeChild(userInputWrapper.firstChild)
    }

    startGame()
}

const onUserInput = (event) => {
    const userInput = document.querySelector('input').value.toLowerCase();

    const incorrectAnswer = () => {
        localState.incorrectCount = localState.incorrectCount + 1;
        revealHangman();
    }
    
    localState.randomWord.toLowerCase().includes(userInput)
        ? revealLetter(userInput)
        : incorrectAnswer()
}

const revealLetter = (letter) => {
    const targetWord = document.querySelectorAll('.textField')
    console.log(targetWord)
    targetWord.forEach(item => {
        if (item.attributes.key.nodeValue.toLowerCase() === letter) {
            item.innerHTML = `${letter.toUpperCase()}`
        }
    })
}

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

const onGameEnd = (result) => {
    const modal = document.querySelector('.modalWrapper')
    const modalText = modal.querySelector('.modalText');
    
    result === 'lose'
    ? modalText.innerHTML = `Too bad, you didn't manage to solve it this time. Would you like to try again?`
    : `Hurray, you solved it, go you! Would you like to try again?`

    modal.style.display = 'block';
}

const addListenerStartBtn = () => {
    document.querySelector('.startGame').addEventListener('click', startGame);
}

const handleModalBtn = (event) => {
    event.target.innerHTML === 'Yes'
        ? resetGame()
        : location.reload()
}


const addListenerModal = () => {
    const closeBtn = document.querySelectorAll('.close')
    
    closeBtn.forEach(item => {
        item.addEventListener('click', handleModalBtn)
    })
}

addListenerStartBtn();
addListenerModal();
