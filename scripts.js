let gameboard = (function(){
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

    return {filledSquares, checkForwinner, resetGame}
})();


let displayController = (function(){
    let turn = 0;
    const allSquares = document.querySelectorAll('.game-square');
    let announcementWrapper = document.querySelector(".announcement")
    let resetButton = document.getElementById('new-game')

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
        turn++
        gameboard.filledSquares.push(Number(e.currentTarget.id))
        let currentPlayer
        let nextPlayer
        if (turn % 2 == 0 ){
            nextPlayer = player1
            currentPlayer = player2
        }
        else{
            nextPlayer = player2
            currentPlayer = player1
        }
        let marker = currentPlayer.marker
        appendXorO(marker, square)
        decideText(currentPlayer, nextPlayer, e.currentTarget.id)
    }))

    resetButton.addEventListener('click', () => {
        turn = 0;
        deleteXorO()
    })

    return{changeColor}

})();

const player = (name, marker) => {
    spaces = []
    return{name, marker, spaces}
}

const player1 = player("Player X", "X")
const player2 = player("Player O", "O")

