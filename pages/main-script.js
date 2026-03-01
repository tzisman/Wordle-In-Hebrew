const WORD_LENGTH = 5;
const LEVELS_CONFIG = [7, 7, 6, 6, 5, 5];
const HEBREW_LETTER_NUM = 27;
let currentWord;
let numOfLines = 1;
let muvesNumbers;
let className;
let indexInLine = 0;
let isInGame = true;
let level = 1;
let scors = 0;
let scoreToAdd = 5;
let diamond = 0;
let previousHint = [];
let records = [];
let privousHtml;
let isInInto = false;

document.querySelector('.xClick').addEventListener('click', closeMessage);

document.addEventListener('keydown', pressKey);

document.querySelector('.new-game').addEventListener('click', function (event) {
    level = 1;
    scors = 0;
    scoreToAdd = 5;
    diamond = 0;
    startRound(LEVELS_CONFIG[0]);
    restartKeyboard();
    document.querySelector('.score').innerHTML = scors;
    document.querySelector('.keyboard').classList.remove('keyboard-none');
    document.addEventListener('keydown', pressKey);
    document.querySelector('.diamonds').innerHTML = diamond;
});

let letterMap = {};
const keyboard = document.querySelector('.keyboard');

enableButtons();

for (let i = 0; i < HEBREW_LETTER_NUM; i++) {
    const letter = document.createElement('div');
    letter.classList.add('tile');
    letter.classList.add('letter');

    let tav = String.fromCodePoint(1488 + i)

    if (!endLetters.hasOwnProperty(tav)) {
        letter.textContent = tav;
        keyboard.appendChild(letter);
        letterMap[tav] = letter;
    }
}

startRound(LEVELS_CONFIG[0]);



function addLine(className) {
    let line = document.createElement('div');
    line.classList.add('line');

    for (let i = 0; i < WORD_LENGTH; i++) {
        let tile = document.createElement('div');
        tile.classList.add('empty-tile');
        tile.classList.add(className);
        line.appendChild(tile);
    }
    document.querySelector('.tiles').appendChild(line);
}

function changeTileStyle() {
    let tiles = document.querySelectorAll(`.${className}`);
    for (const tile of tiles) {
        tile.classList.add('tile');
        tile.classList.remove('empty-tile');
        tile.classList.add('mid-tile');
    }
}


function startRound(muvesNum) {
    enableButtons();
    document.querySelector('.tiles').textContent = '';
    isInGame = true;
    numOfLines = 1;
    indexInLine = 0;
    currentWord = WORDS_TO_CHOOSE[Math.floor(Math.random() * WORDS_TO_CHOOSE.length)];
    //console.log(currentWord);
    muvesNumbers = muvesNum;
    className = 'line' + numOfLines;
    previousHint = [];
    for (let i = 1; i <= muvesNum; i++) {
        addLine('line' + i);
    }
    changeTileStyle();
}

function pressKey({ key }) {
    closeMessage();
    if (/^[\u0590-\u05FF]$/.test(key)) {
        if (indexInLine < WORD_LENGTH) {
            let tile = document.querySelectorAll('.' + className)[indexInLine++];
            let convertKey = convertEndLetters(key);
            keyboardEffect(letterMap[convertKey]);
            tile.textContent = convertKey;
        }
    } else if (key === 'Enter') {
        if (indexInLine < WORD_LENGTH) {
            showMessage('פעולה לא חוקית', 'המילה לא שלמה.');
        }
        else if (!WORDS.includes(getInputWord())) {
            showMessage('פעולה לא חוקית', 'המילה לא קימת.');
        }
        else {
            check();
            numOfLines++;
            if (isInGame) {
                className = 'line' + numOfLines;
                changeTileStyle();
                indexInLine = 0;
            }
        }
    } else if (key === 'Backspace' || key === 'Delete') {
        if (indexInLine > 0) {
            let tile = document.querySelectorAll('.' + className)[--indexInLine];
            tile.innerHTML = '';
        }
    }
    else {
        showMessage('פעולה לא חוקית', 'התו שהקשת אינו תקין.');
    }
}






function check() {
    let tiles = document.querySelectorAll('.' + className);
    let word = currentWord;
    for (let i = tiles.length - 1; i >= 0; i--) {
        const element = tiles[i];
        const tav = letterMap[element.textContent];
        if (element.textContent == word[i]) {
            element.classList.add('green');
            tav.classList.remove('yellow');
            tav.classList.remove('gray');
            tav.classList.add('green');
        }
    }

    for (let i = 0; i < tiles.length; i++) {
        const element = tiles[i];
        const tav = letterMap[element.textContent];
        if (!element.classList.contains('green')) {
            if (word.includes(element.textContent) && !(element.classList.contains('green')) && (countPaint(tiles, element.textContent) < countChar(word, element.textContent))) {
                tav.classList.remove('gray');
                element.classList.add('yellow');
                tav.classList.add('yellow');

            }
            else {
                tav.classList.add('gray');
                element.classList.add('gray');
            }
        }
    }
    if (currentWord == getInputWord()) {
        isInGame = false;
        winMuve();
    }
    else if (numOfLines == muvesNumbers) {
        isInGame = false;
        endOMuve();
    }

}

function countChar(str, charToCount) {
    return [...str].reduce((acc, char) => char === charToCount ? acc + 1 : acc, 0);
}

function countPaint(arr, char) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i].classList.contains('green') || arr[i].classList.contains('yellow')) && arr[i].innerHTML == char) {
            count++
        }
    }
    return count;
}
function getInputWord() {
    let inputWord = '';
    let tiles = document.querySelectorAll('.' + className);
    for (let i = 0; i < tiles.length; i++) {
        inputWord += tiles[i].innerHTML;
    }
    return inputWord;
}

function endOMuve() {

    document.removeEventListener('keydown', pressKey);
    disableButtons();
    setTimeout(() => {
        document.querySelector('.keyboard').classList.add('keyboard-none');

        tiles = document.querySelector('.tiles');
        tiles.textContent = '';
        message = document.createElement('div');
        message.classList.add('into-message');

        let p = document.createElement('p');
        p.innerHTML = 'המשחק נגמר!';
        p.classList.add('tile-into-message');
        message.appendChild(p);

        let p2 = document.createElement('p');
        p2.innerHTML = 'המילה הנכונה היתה:  ' + currentWord;
        p2.classList.add('content-into-message');
        message.appendChild(p2);

        let p3 = document.createElement('p');
        p3.innerHTML = ' מספר הנקודות שהרווחת בסך הכל:  ' + scors;
        p3.classList.add('content-into-message');
        message.appendChild(p3);

        let p4 = document.createElement('p');
        p4.innerHTML = 'מספר המילים שניחשת: ' + (level - 1);
        p4.classList.add('content-into-message');
        message.appendChild(p4);
        if (isNewRecord()) {
            let div = document.createElement('div');
            div.classList.add('record-container');
            message.appendChild(div);

            let p5 = document.createElement('p');
            p5.innerHTML = 'שיא חדש!';
            p5.classList.add('record-label');
            div.appendChild(p5);

            let input = document.createElement('input');
            input.type = 'text';
            input.classList.add('name-input');
            input.placeholder = 'השם שלך';
            div.appendChild(input);

            let button = document.createElement('button');
            button.classList.add('check-button');
            button.innerHTML = '✔';
            button.addEventListener('click', saveName);
            div.appendChild(button);
        }
        tiles.appendChild(message);

    }, 1500);
}

function winMuve() {
    disableButtons();
    setTimeout(() => {
        document.querySelector('.keyboard').classList.add('keyboard-none');
        tiles = document.querySelector('.tiles');
        tiles.textContent = '';
        message = document.createElement('div');
        message.classList.add('into-message');

        let p = document.createElement('p');
        p.innerHTML = 'ניצחת בסיבוב!';
        p.classList.add('tile-into-message');
        message.appendChild(p);

        let p2 = document.createElement('p');
        p2.innerHTML = 'במילה הנכונה היתה:  ' + currentWord;
        p2.classList.add('content-into-message');
        message.appendChild(p2);

        let p3 = document.createElement('p');
        p3.innerHTML = ' מספר הנקודות שהרווחת:  ' + scoreToAdd;
        p3.classList.add('content-into-message');
        message.appendChild(p3);

        let p4 = document.createElement('p');
        p4.innerHTML = 'מספר היהלומים שהרווחת: ' + (muvesNumbers - numOfLines + 1);
        p4.classList.add('content-into-message');
        message.appendChild(p4);


        let btn = document.createElement('div');
        btn.innerHTML = 'מילה חדשה';
        btn.classList.add('next-muve-button');
        btn.addEventListener('click', nextWordClick)
        message.appendChild(btn);

        tiles.appendChild(message);
        level++;
        scors += scoreToAdd;
        restartKeyboard();
        scoreToAdd *= 2;
        diamond += (muvesNumbers - numOfLines + 1);
    }, 1500);



}

function nextWordClick() {
    document.querySelector('.keyboard').classList.remove('keyboard-none');
    document.querySelector('.score').innerHTML = scors;
    document.querySelector('.diamonds').innerHTML = diamond;
    startRound(level <= (LEVELS_CONFIG.length) ? LEVELS_CONFIG[level - 1] : 4);
}
function restartKeyboard() {
    const keyboard = document.querySelectorAll('.letter');
    keyboard.forEach(key => key.classList.remove('yellow', 'green', 'gray'));

}

function hint() {
    let letters = [];
    if (previousHint.length >= WORD_LENGTH) {
        showMessage('לא ניתן לקנות רמז', ' כבר קנית את כל הרמזים האפשריים');
        diamond += 3;
        document.querySelector('.diamonds').innerHTML = diamond;
        return;
    }
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (!letterMap[currentWord[i]].classList.contains('green') && !letterMap[currentWord[i]].classList.contains('yellow') && !previousHint.includes(i)) {
            letters.push(i);
        }
    }
    if (letters.length == 0) {
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (!letterMap[currentWord[i]].classList.contains('green') && !previousHint.includes(i)) {
                letters.push(i);
            }
        }
    }

    if (letters.length === 0) {
        showMessage('לא ניתן לקנות רמז', 'כל המידע כבר נמצא ברשותך');
        diamond += 3;
        document.querySelector('.diamonds').innerHTML = diamond;
        return;
    }

    let randomIndex = Math.floor(Math.random() * letters.length);
    previousHint.push(letters[randomIndex]);
    for (let i = numOfLines; i <= muvesNumbers; i++) {
        const line = document.querySelectorAll(`.line${i}`);
        line[letters[randomIndex]].innerHTML = currentWord[letters[randomIndex]];
    }

}
function buyHint() {
    if (diamond < 3) {
        showMessage('לא ניתן לקנות רמז', 'אין ברשותך מספיק יהלומים');
        return;
    }
    diamond -= 3;
    document.querySelector('.diamonds').innerHTML = diamond;
    hint();
}

function keyboardEffect(element) {
    element.classList.add('keyboardEffect');
    setTimeout(() => {
        element.classList.remove('keyboardEffect');
    }, 270);
}


function isNewRecord() {
    let scores = JSON.parse(localStorage.getItem('highScores') || '[]');

    if (scores.length < 5) {
        return true;
    }

    let lowest = scores[scores.length - 1];
    return scors > lowest.score;
}


function saveRecords(name) {
    let scores = localStorage.getItem('highScores');
    scores = scores ? JSON.parse(scores) : [];

    scores.push({ name: name, score: scors });


    scores.sort((a, b) => b.score - a.score);

    scores = scores.slice(0, 5);

    localStorage.setItem('highScores', JSON.stringify(scores));
}

function saveName() {
    saveRecords(document.querySelector('.name-input').value);
    document.querySelector('.check-button').removeEventListener('click', saveName);
    window.location.href = "../index.html";
}


function showRecords() {
    document.querySelector('.keyboard').classList.add('keyboard-none');
    tiles = document.querySelector('.tiles');
    if(!isInInto){
        privousHtml = tiles.innerHTML;
    }
    isInInto = true;
    tiles.innerHTML = '';
    message = document.createElement('div');
    message.classList.add('into-message');

    const scores = JSON.parse(localStorage.getItem('highScores') || '[]');
    const container = document.getElementById('scoresContainer');

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['מקום', 'שם', 'ניקוד'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });


    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    scores.forEach((item, index) => {
        const row = document.createElement('tr');

        const placeCell = document.createElement('td');
        placeCell.textContent = `${index + 1}`;
        row.appendChild(placeCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = item.score;
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    message.appendChild(table);

    let btn = document.createElement('div');
    btn.innerHTML = 'חזרה למשחק';
    btn.classList.add('next-muve-button');
    btn.addEventListener('click', gobackGame);
    message.appendChild(btn);


    tiles.appendChild(message);
}



function gobackGame() {
    let tiles = document.querySelector('.tiles');
    tiles.innerHTML = privousHtml;
    document.querySelector('.keyboard').classList.remove('keyboard-none');
    isInInto = false;

}


function showMessage(title, content) {
    closeMessage();
    let message = document.getElementById('message');
    document.querySelector('.massege-title-text').innerHTML = title;
    document.getElementById('messageContent').innerHTML = content;
    setTimeout(() => {
        message.classList.add('showMsg');
    }, 500);
}

function closeMessage() {
    let message = document.getElementById('message');
    setTimeout(() => {
        message.classList.remove('showMsg');
    }, 500);
}


function showIntro() {
    document.querySelector('.keyboard').classList.add('keyboard-none');
    tiles = document.querySelector('.tiles');
    if(!isInInto){
        privousHtml = tiles.innerHTML;
    }
    isInInto = true;
    tiles.innerHTML = '';
    message = document.createElement('div');
    message.classList.add('into-message');

    let title = document.createElement('p');
    title.innerHTML = 'איך משחקים?';
    title.classList.add('tile-into-message');
    message.appendChild(title);

    let p1 = document.createElement('p');
    p1.innerHTML = 'עליך לנחש מילה בת 5 אותיות בעברית. יש לך מספר מוגבל של ניסיונות בכל שלב.';
    p1.classList.add('content-into-message');
    message.appendChild(p1);

    let p2 = document.createElement('p');
    p2.innerHTML = 'אחרי כל ניחוש, צבע האריחים ישתנה בהתאם לדיוק שלך:';
    p2.classList.add('content-into-message');
    message.appendChild(p2);

    let p3 = document.createElement('p');
    p3.innerHTML = '<span class="colors green" font-weight:bold;">ירוק</span> - האות במקום הנכון.<br>' +
        '<span class="colors yellow" font-weight:bold;">צהוב</span> - האות קיימת במילה אך לא במקום הנכון.<br>' +
        '<span class="colors gray" font-weight:bold;">אפור</span> - האות לא נמצאת בכלל במילה.';
    p3.classList.add('content-into-message');
    message.appendChild(p3);

    let p4 = document.createElement('p');
    p4.innerHTML = 'בסיום כל סבב מספר השורות שנשארו לך יתוספו כיהלומים.';
    p4.classList.add('content-into-message');
    message.appendChild(p4);

    let p5 = document.createElement('p');
    p5.innerHTML = 'ניתן לקנות רמזים באמצעות יהלומים שצברת, כל 3 יהלומים- רמז.';
    p5.classList.add('content-into-message');
    message.appendChild(p5);

    let btn = document.createElement('div');
    btn.innerHTML = 'חזרה למשחק';
    btn.classList.add('next-muve-button');
    btn.addEventListener('click', gobackGame);
    message.appendChild(btn);

    tiles.appendChild(message);

}



function enableButtons() {
    document.querySelector('.record').addEventListener('click', showRecords);
    replaceBack(document.querySelector('.record'));
    document.querySelector('.intro').addEventListener('click', showIntro);
    replaceBack(document.querySelector('.intro'));
    document.querySelector('.hint').addEventListener('click', buyHint);
    replaceBack(document.querySelector('.hint'));
}

function disableButtons() {
    document.querySelector('.record').removeEventListener('click', showRecords);
    replace(document.querySelector('.record'));
    document.querySelector('.intro').removeEventListener('click', showIntro);
    replace(document.querySelector('.intro'));
    document.querySelector('.hint').removeEventListener('click', buyHint);
    replace(document.querySelector('.hint'));
}

function replace(element){
    element.classList.remove('icons');
    element.classList.add('disabled');
}

function replaceBack(element){
    element.classList.add('icons');
    element.classList.remove('disabled');
}

