let gameboard = (function(){
    let filledSquares = []

    let moveSquares = (square) => {
        filledSquares.push(square)
    }

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

    const allSquares = [1,2,3,4,5,6,7,8,9];

    const contains = (second) => {
        for (let item of winPatterns){
            let indexArray = item.map(number => {
                return second.indexOf(number);
            });
                if (indexArray.indexOf(-1) === -1){
                    return true
                }
                else{
                    indexArray = []
                }
            }
        return false
    }

    const lockGameboard = () => {
        for (let x = 1; x<10; x++) {
            if (!filledSquares.includes(x)){
                filledSquares.push(x)
            }
        }
    }

    return {moveSquares, filledSquares, contains, lockGameboard, allSquares}
})();

let displayController = (function(){
    let turn = 0;
    const _incrimentTurn = () => {
        return(++turn)
    }

    let checkForwinner = (player, number) => {
        player.spaces.push(Number(number))
        if(gameboard.contains(player.spaces)){
            console.log(`Winner Winner!! ${player.name} Wins!!!`)
            gameboard.lockGameboard()
        }
        else if(gameboard.allSquares.length == gameboard.filledSquares.length){
            console.log('Tie!')
        }

    }

    const allSquares = document.querySelectorAll('.game-square');
    allSquares.forEach(square => square.addEventListener('click', function(e){
         if (gameboard.filledSquares.includes(Number(e.currentTarget.id))){
             return
         }
        _incrimentTurn()
        gameboard.moveSquares(Number(e.currentTarget.id))
        let newSpan = document.createElement('span');
        if (turn % 2 == 0 ){
            newSpan.textContent = 'O';
            checkForwinner(player2, e.currentTarget.id)
        }
        else{
            newSpan.textContent = 'X'
            checkForwinner(player1, e.currentTarget.id)
        }
        square.appendChild(newSpan)
    }))
    
    // return {contains}
})();

const player = (name, marker) => {
    spaces = []
    return{name, marker, spaces}
}

const player1 = player("Player 1", "X")
const player2 = player("PLayer2", "O")

