let gameboard = (function(square){
    let gameSquares = [1,2,3,4,5,6,7,8,9]

    let deleteSquare = (square) => {
        gameSquares = gameSquares.filter(num => num !== square)
        return(gameSquares)
    }

return {deleteSquare}
    
})();

let displayController = (function(){
    let turn = 0;
    const incrimentTurn = () => {
        return(++turn)
    }
    
    const allSquares = document.querySelectorAll('.game-square');
    allSquares.forEach(square => square.addEventListener('click', function(e){
        incrimentTurn()
        console.log(e.target.id)
        let newSpan = document.createElement('span');
        if (turn % 2 == 0 ){
            newSpan.textContent = 'X'
        }
        else{
            newSpan.textContent = 'O'
        }
        square.appendChild(newSpan)
    }))
    
    return {incrimentTurn}
})();

const player = (name, marker, turn) => {
    return{name, marker, turn}
}

const player1 = player("Player 1", "X", "odd")
const player2 = player("PLayer2", "O", "even")

