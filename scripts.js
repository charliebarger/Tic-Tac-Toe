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
    return {filledSquares, checkForwinner}
})();


let displayController = (function(){
    let turn = 0;
    const allSquares = document.querySelectorAll('.game-square');
    let announcementWrapper = document.querySelector(".announcement")


    function displayTurn(text){
        console.log(announcementWrapper)
        announcementWrapper.removeChild(announcementWrapper.firstElementChild);
    
        let newText = document.createElement("p")
        newText.textContent = text
        announcementWrapper.appendChild(newText)
    }

    function decideText(player, space){
            let winner = gameboard.checkForwinner(player, space)
            if (winner){
                displayTurn(winner)
            }
            else{
                displayTurn(`${player.name}'s Turn`)
            }
    }

    function appendXorO(player, square){
        let newSpan = document.createElement('span');
        newSpan.textContent = player.marker;
        square.appendChild(newSpan)
    }

    allSquares.forEach(square => square.addEventListener('click', function(e){
         if (gameboard.filledSquares.includes(Number(e.currentTarget.id))){
             return
         }
        turn++
        gameboard.filledSquares.push(Number(e.currentTarget.id))
        let newSpan = document.createElement('span');
        let player
        if (turn % 2 == 0 ){
            player = player2
        }
        else{
            player = player1
        }
        decideText(player, e.currentTarget.id)
        appendXorO(player, square)
    }))
})();

const player = (name, marker) => {
    spaces = []
    return{name, marker, spaces}
}

const player1 = player("Player X", "X")
const player2 = player("Player O", "O")

