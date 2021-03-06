/*
    * Code By PhuongNguyen
    * Gmail: nhphuong.code@gmail.com
    * Based on https://www.codingnepalweb.com/2021/01/tic-tac-toe-game-using-javascript.html
*/

(function () {
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const $sections = $$('#app > section')
    const $startSection = $('#start');
    const $playSection = $('#play');
    const $resultSection = $('#result');

    const $cells = $playSection.querySelectorAll('.board > div');
    const $resultText = $resultSection.querySelector('.result-text');
    const $turn = $playSection.querySelector('.players');
    const $resultBtn = $resultSection.querySelectorAll('.btn');
    const $choseModeBtn = $$('.chose-mode .btn');
    
    let isXTurn = true;
    let isActiveBot;
    let winner;
    const combinationsWin = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    let xPos = [];
    let oPos = [];

    function transferToSection($cell) {
        $sections.forEach($section => $section.classList.add('hide'));
        $cell.classList.remove('hide');
    }

    function handleResult() {
        transferToSection($resultSection);
        const text = winner ? `Player <span>${winner}</span> won!` : `Math has been drawn`;
        $resultText.innerHTML = text;
    }

    function handleWinner() {
        combinationsWin.map(moves => {
            const isXWin = moves.every(move => xPos.includes(move));
            const isOWin = moves.every(move => oPos.includes(move));

            if (isXWin) winner = 'x';
            if (isOWin) winner = 'o';
        });

        const isFull = xPos.length > 4;
        if ( winner || isFull) return handleResult();
    }

    function botMove() { 
        function botOneMoveWin() { 
            // 1 move bot wins
            let moves = combinationsWin.map(moves => moves.filter(move => !oPos.includes(move))).filter(moves => moves.length == 1);

            if(moves != '') moves = moves.reduce((moves,move) => [...moves,...move]).filter(move => !xPos.includes(move));
            if(moves == '') return false;

            return moves;
        }
        
        function botMovePreventPlayerWin() { 
            // 1 move player wins
            let moves = combinationsWin.map(moves => moves.filter(move => !xPos.includes(move))).filter(moves => moves.length == 1);

            if(moves != '') moves = moves.reduce((moves,move) => [...moves,...move]).filter(move => !oPos.includes(move));
            if(moves == '') return false;

            return moves;
        }
        
        function botMoveRandom() { 
            const boxPos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            // 2 move bot wins
            let moves = combinationsWin.map(moves => moves.filter(move => !oPos.includes(move))).filter(moves => moves.length == 2);

            if(moves != '') moves = moves.reduce((moves,move) => [...moves,...move]).filter(move => !xPos.includes(move));
            // move random
            if (moves == '') moves = boxPos.filter(Pos => !xPos.includes(Pos) && !oPos.includes(Pos));

            return moves;
        }
       
        const movesArr = botOneMoveWin() || botMovePreventPlayerWin() || botMoveRandom();
        const randomNum = Math.floor(Math.random() * movesArr.length);
        const movePos = movesArr[randomNum] + 1;

        return movePos;
    }
    function bot() {
        $playSection.classList.add('bot-turn');
        setTimeout(function () {
            const movePos = botMove();
            
            let $selectBox;
            if(movePos) $selectBox = $playSection.querySelector(`.board > div:nth-child(${movePos})`);
            if ($selectBox) handleMove($selectBox);
            
            $playSection.classList.remove('bot-turn');
        }, 500)
    }

    function handleMove($cell) {
        const boxClass = isXTurn ? 'x' : 'o';
        $cell.classList = boxClass;
        
        if (isXTurn) $turn.classList.add('x');
        else $turn.classList.remove('x'); 

        xPos = [];
        oPos = [];
        $cells.forEach(($cell, Pos) => {
            if ($cell.classList == 'x') xPos.push(Pos);
            if ($cell.classList == 'o') oPos.push(Pos);
        })
        isXTurn = !isXTurn;

        handleWinner();
    }

    function handleMode() {
        const option = this.value;
        isActiveBot = false;
        if (option == 1) isActiveBot = true;

        transferToSection($playSection);
    }

    function resetGame() {
        isXTurn = true;
        winner = '';
        $turn.classList.remove('x');
        $playSection.classList.remove('bot-turn');
        $cells.forEach($cell => $cell.classList = '')
        transferToSection($playSection);
    }

    function handleEvent() {
        $resultBtn.forEach(btn => btn.addEventListener('click', resetGame));
        $choseModeBtn.forEach(btn => btn.addEventListener('click', handleMode));
        $cells.forEach(box => box.onclick = function () {
            handleMove(this);
            if (isActiveBot) bot();
        })
    }

    (function start() {
        transferToSection($startSection);
        handleEvent();
    })()
})();