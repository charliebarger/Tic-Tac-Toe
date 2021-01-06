let gameboard = (function(){
    let turn = 0;
    let currentPlayer
    let nextPlayer
    let filledSquares = []
    const allSquares = [1,2,3,4,5,6,7,8,9];
    const winPatterns = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ]
    let active = true;

    const getFilledSquares = () => {
        return filledSquares;
    }

    const _addSquares = (square) => {
        filledSquares.push(Number(square))
    }

    const _flipActive = () => {
        active ? active = false : active = true;
        console.log(active)
    }

    const getActive = () => {
            console.log(active)
            return active;
    }

    //checks if the items in the Arrays that are within the winPatterns Array are all in another Array(playerSelection)

    const _containsAwinner = (playerSelections) => {
        for (let item of winPatterns){
            let indexArray = item.map(number => {
                return playerSelections.indexOf(number);
            });
            if (indexArray.indexOf(-1) ===-1){
                _lockGameboard()
                displayController.changeColor(playerSelections, indexArray)
                return true
            }
            else{
                indexArray = []
            }
        }
        return false
    }

    const checkForwinner = (player, number) => {
        player.spaces.push(Number(number))
        if(_containsAwinner(player.spaces)){
            return (`${player.name} Wins!`)
        }
        else if(allSquares.length == filledSquares.length){
            return ('Draw!')
        }
    }

    //locks game by filling up filledSquares completely

    const _lockGameboard = () => {
        for (let x = 1; x<10; x++) {
            if (!filledSquares.includes(x)){
                _addSquares(x)
            }
        }
    }

    const resetGame = () => {
        active = true;
        filledSquares= []
        player1.spaces = [];
        player2.spaces = [];
    }

    //creates and returns a random number after evaluating availabe squares to choose from

    function _generateRandom() {
        let availableSquares = []
        allSquares.forEach(square => {
            if (!filledSquares.includes(square)){
                availableSquares.push(square)
            }
        })
        index = Math.floor(availableSquares.length * Math.random());
        _addSquares(availableSquares[index])
        return availableSquares[index];
    }

    function twoPlayerMode(square){
        turn++
        _addSquares(square.id)
        if (turn % 2 == 0 ){
            currentPlayer = player2
            nextPlayer = player1
        }
        else{
            currentPlayer = player1
            nextPlayer = player2
        }
        displayController.appendXorO(currentPlayer.marker, square)
        displayController.decideText(currentPlayer, nextPlayer, square.id)
    }

    function onePlayerMode(square, allSquares) {
        _addSquares(square.id)
        displayController.appendXorO(player1.marker, square)
        displayController.decideText(player1, player2, square.id)
        _flipActive()
        let number = _generateRandom();
        if (!number == []){
            allSquares.forEach(box => {
                if (Number(box.id) == number){
                    square = box
                    return
                }
            })
        setTimeout(function() {
            displayController.appendXorO(player2.marker, square)
            displayController.decideText(player2, player1, square. id)
            _flipActive()
        }, 1000);
        }
    }

    return {getFilledSquares, checkForwinner, resetGame, twoPlayerMode, onePlayerMode, getActive}
})();


let displayController = (function(){
    const allSquares = document.querySelectorAll('.game-square');
    let announcementWrapper = document.querySelector(".announcement")
    let resetButton = document.getElementById('new-game')
    let twoPlayerButton = document.getElementById("two-player");
    let onePlayerButton = document.getElementById("one-player");
    let onePlayerSwitch = true;

    //takes an array holding player spaces, and the Index of the winning numbers in that array in order to make the winning X's or O's change color

    const changeColor = (playerSpaces, winningIndex) => {
        winningIndex.forEach(number => { 
            let space = playerSpaces[number]
            allSquares.forEach(square => {
                if(Number(square.id) == space){
                    square.firstChild.style.color = "red";
                }
            })
        })
    }

    //Removes and appends new text above the gameboard

    function _displayTurn(text, color = 'white'){
        announcementWrapper.removeChild(announcementWrapper.firstElementChild);
        let newText = document.createElement("p")
        newText.textContent = text
        newText.style.color = color;
        announcementWrapper.appendChild(newText)
    }

    //tests if checkForWinner returns true or false and decides text used to call _display turn based on that

    let decideText = (currentPlayer, nextPlayer, space = 0) => {
        if (space > 0){
            let winner = gameboard.checkForwinner(currentPlayer, space)
            if (winner){
                _displayTurn(winner, 'red')
                return
            }
        }
        _displayTurn(`${nextPlayer.name}'s Turn`)
    }

    function appendXorO(marker, square){
        let newSpan = document.createElement('span');
        newSpan.textContent = marker;
        square.appendChild(newSpan)
    }

    let _deleteXorO = () => {
        gameboard.resetGame()
        const gameSquares = document.querySelectorAll('.game-square');
        gameSquares.forEach(square => {
            if(square.firstChild){
                square.removeChild(square.firstElementChild)
            }
        })
        decideText(player1, player1)
    }

    function changeButtonColor(button1, button2) {
        button1.style.background = "white";
        button1.style.color =  "#b89f5d";
        button1.style.border = "white solid 1px"
        button2.style.background = "#b89f5d";
        button2.style.color =  "white";
        button2.style.border = "#b89f5d solid 1px"
    }

    //Event Listners

    twoPlayerButton.addEventListener('click', () => {
        _deleteXorO()
        onePlayerSwitch = false;
        changeButtonColor(twoPlayerButton, onePlayerButton)
    })

     onePlayerButton.addEventListener('click', () => {
         _deleteXorO()
         onePlayerSwitch = true;
         changeButtonColor(onePlayerButton, twoPlayerButton)
     } )

    //decides game mode when first square is clicked

    allSquares.forEach(square => square.addEventListener('click', function(e){
        if (gameboard.getFilledSquares().includes(Number(e.currentTarget.id))|| gameboard.getActive() == false){
            return
        }
        onePlayerSwitch ? gameboard.onePlayerMode(square, allSquares) : gameboard.twoPlayerMode(square);
    }))

    resetButton.addEventListener('click', () => {
        turn = 0;
        _deleteXorO();
    })

    return{changeColor, appendXorO, decideText}

})();

const player = (name, marker) => {
    spaces = []
    return{name, marker, spaces}
}

const player1 = player("Player X", "X")
const player2 = player("Player O", "O")