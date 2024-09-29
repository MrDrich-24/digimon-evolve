let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
    // [32, 8, 4, 0],
    // [4, 128, 64, 256],
    // [8, 32, 16, 2],
    // [16, 2, 256, 1024],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();

      let num = board[r][c];
      updateTile(tile, num);

      document.getElementById("board").append(tile);
    }
  }

  setTwo();
  setTwo();
}

function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";

  tile.classList.add("tile");

  if (num > 0) {
    tile.innerText = num.toString();

    if (num < 8192) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

function handSlide(e) {
  // e is an object, it is an event handler
  // valid: e.key, e.code
  console.log(e.code);
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
    if (e.code == "ArrowLeft") {
      slideLeft();
      setTwo();
    } else if (e.code == "ArrowRight") {
      slideRight();
      setTwo();
    } else if (e.code == "ArrowUp") {
      slideUp();
      setTwo();
    } else if (e.code == "ArrowDown") {
      slideDown();
      setTwo();
    }
  }

  // change score
  document.getElementById("score").innerText = score;

  setTimeout(() => {
    checkWin();
  }, 100);

  // checkWin();
  if (hasLost() == true) {
    setTimeout(() => {
      alert("Game Over");
      restartGame();
      alert("Click any arrow key to restart");
    }, 100);
  }
}

function filterZero(row) {
  return row.filter((num) => num != 0);
}

function slide(tiles) {
  tiles = filterZero(tiles);

  for (let index = 0; index < tiles.length - 1; index++) {
    if (tiles[index] == tiles[index + 1]) {
      tiles[index] = tiles[index] * 2;
      tiles[index + 1] = 0;

      // add score
      score += tiles[index];
    }
  }

  tiles = filterZero(tiles);

  while (tiles.length < columns) {
    tiles.push(0);
  }

  return tiles;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    row.reverse();

    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    column = slide(column);
    // board[c] = column;

    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];

      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    
    column.reverse();
    column = slide(column);
    column.reverse();
    // board[c] = column;

    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];

      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      } 
    }
  }

  return false;
}

function setTwo() {
  if (hasEmptyTile() == false) {
    return;
  }

  let found = false;

  while (found == false) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] == 0) {
      board[r][c] = 2;

      let tile = document.getElementById(r.toString() + "-" + c.toString());

      // <div class="x2">2</div>
      tile.innerText = "2";
      tile.classList.add("x2");

      found = true;
    }
  }
}

function checkWin() {

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {

      if(board[r][c] == 2048 && is2048Exist == false) {
        alert("You Win! You got the 2048");
        is2048Exist = true;

      } else if (board[r][c] == 4096 && is4096Exist == false) {
        alert("You are unstoppable at 4096! You are fantastically unstoppable!");
        is4096Exist = true;

      } else if (board[r][c] == 8192 && is8192Exist == false) {
        alert("Victory! You have reached 8192! You are incredibly awesome!");
        is8192Exist = true;
      }
    }
  }
}

function hasLost() {
  for (r = 0; r < rows; r++) {
    for (c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return false;
      }

      const currentTile = board[r][c];

      if (
        (r > 0 && board[r - 1][c] === currentTile) || // upper tile
        (r < rows - 1 && board[r + 1][c] === currentTile) || // lower tile
        (c > 0 && board[r][c - 1] === currentTile) || // left tile
        (c < columns - 1 && board[r][c + 1] === currentTile) // right tile
      ) {
        return false;
      }
    }
  }

  // no specific moves
  return true;
}

function restartGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // reset score
  score = 0;
  // setTwo();
  setTwo();
}

function setScore() {
  
}

document.addEventListener("keydown", handSlide);

window.onload = function () {
  setGame();
};

