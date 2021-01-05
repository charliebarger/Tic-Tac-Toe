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


    const _contains = (second) => {
        for (let item of winPatterns){
            let indexArray = item.map(number => {
                return second.indexOf(number);
            });
                if (indexArray.indexOf(-1) === -1){
                    _lockGameboard()
                    displayController.changeColor(second, indexArray)
                    return true
                }
                else{
                    indexArray = []
                }
            }
        return false
    }

    const _lockGameboard = () => {
        for (let x = 1; x<10; x++) {
            if (!filledSquares.includes(x)){
                filledSquares.push(x)
            }
        }
    }

    const checkForwinner = (player, number) => {
        player.spaces.push(Number(number))
        if(_contains(player.spaces)){
            return (`${player.name} Wins!`)
        }
        else if(allSquares.length == filledSquares.length){
            return ('Draw!')
        }
    }

    const resetGame = () => {
        gameboard.filledSquares = filledSquares = []
        player1.spaces = [];
        player2.spaces = [];
    }

     function twoPlayerMode(square){
        turn++
        filledSquares.push(Number(square.id))
        if (turn % 2 == 0 ){
            nextPlayer = player1
            currentPlayer = player2
        }
        else{
            nextPlayer = player2
            currentPlayer = player1
        }
        displayController.appendXorO(currentPlayer.marker, square)
        displayController.decideText(currentPlayer, nextPlayer, square.id)
    }

    function generateRandom() {
        let availableSquares = []
        console.log(filledSquares)
        allSquares.forEach(square => {
            if (!filledSquares.includes(square)){
                availableSquares.push(square)
            }
        })
        index = Math.floor(availableSquares.length * Math.random());
        filledSquares.push(availableSquares[index])
        return availableSquares[index];

    }

    function onePlayerMode(square, allSquares) {
        filledSquares.push(Number(square.id))
        currentPlayer = player1
        nextPlayer = player2
        displayController.appendXorO(currentPlayer.marker, square)
        displayController.decideText(currentPlayer, nextPlayer, square.id)
        currentPlayer = player2
        nextPlayer = player1
        let number = generateRandom();
        if (!number == []){
            console.log(number)
            allSquares.forEach(box => {
                if (Number(box.id) == number){
                    square = box
                    return
                }
            })
        setTimeout(function() {
            displayController.appendXorO(currentPlayer.marker, square)
            displayController.decideText(currentPlayer, nextPlayer, square. id)
        }, 1000);
        }

    }

    return {filledSquares, checkForwinner, resetGame, twoPlayerMode, onePlayerMode}
})();


let displayController = (function(){
    const allSquares = document.querySelectorAll('.game-square');
    let announcementWrapper = document.querySelector(".announcement")
    let resetButton = document.getElementById('new-game')
    let twoPlayer = document.getElementById("2-player");
    let onePlayer = document.getElementById("1-player");
    let onePlayerSwitch = true;

    twoPlayer.addEventListener('click', () => {
        onePlayerSwitch = false;
    })

     onePlayer.addEventListener('click', () => {
         onePlayerSwitch = true;
     } )

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

    function displayTurn(text, color = 'white'){
        announcementWrapper.removeChild(announcementWrapper.firstElementChild);
        let newText = document.createElement("p")
        newText.textContent = text
        newText.style.color = color;
        announcementWrapper.appendChild(newText)
    }


    let decideText = (currentPlayer, nextPlayer, space = 0) => {
            if (space > 0){
                let winner = gameboard.checkForwinner(currentPlayer, space)
                if (winner){
                    displayTurn(winner, 'red')
                    return
                }
            }
            displayTurn(`${nextPlayer.name}'s Turn`)
    }

    function appendXorO(marker, square){
        let newSpan = document.createElement('span');
        newSpan.textContent = marker;
        square.appendChild(newSpan)
    }

    let deleteXorO = () => {
    gameboard.resetGame()
    const gameSquares = document.querySelectorAll('.game-square');
    gameSquares.forEach(square => {
            if(square.firstChild){
                square.removeChild(square.firstElementChild)
            }
        })
    decideText(player1, player1)
    }


    allSquares.forEach(square => square.addEventListener('click', function(e){
         if (gameboard.filledSquares.includes(Number(e.currentTarget.id))){
             return
         }

         onePlayerSwitch ? gameboard.onePlayerMode(square, allSquares) : gameboard.twoPlayerMode(square);
    }))

    resetButton.addEventListener('click', () => {
        turn = 0;
        deleteXorO()
    })

    return{changeColor, appendXorO, decideText}

})();

const player = (name, marker) => {
    spaces = []
    return{name, marker, spaces}
}

const player1 = player("Player X", "X")
const player2 = player("Player O", "O")