var view = {//view对象
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};
//view.displayMessage("Tap tap, is this thing on?");
//view.displayMiss("00");
//view.displayHit("34");
//view.displayMiss("55");
//view.displayHit("12");
//view.displayMiss("25");
//view.displayHit("26");
//view.displayMessage("Tap tap,is this thing on?");
//var ship1 ={locations:["10","20","30"],hits:["","",""]};
//var ship2 ={locations:["32","33","34"],hits:["","",""]};
//var ship3 ={locations:["63","64","65"],hits:["","","hit"]};
var model = {
  boardSize: 7,//网格大小 属性
  numShips: 3,//游戏包含的战舰数
  shipLength: 3,//每艘战舰占据多少的单元格
  shipsSunk: 0,//有多少艘战舰已被击沉
  ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
  { locations: ["0", "0", "0"], hits: ["", "", ""] },
  { locations: ["0", "0", "0"], hits: ["", "", ""] },//将位置数组的元素初始化为0
  ],
  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];

      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("you sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("you missed");
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {//循环次数要与其生成的位置的战舰数相同
      do {//这里使用了do while循环
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }//生成可行位置后，将其赋给数组model,ships中相应的战舰的属性locations
  },
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));//水平
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));//将前一页的数字3替换成了this.shipLength,让代码更通用
      col = Math.floor(Math.random() * this.boardSize);//垂直
    }
    
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));//这里使用圆括号确保先将i 和col相加，再将结果转换成字符串 row是字符串
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }//生成战舰位置
    return newShipLocations;//使用战舰的位置填充这个数组后，将其返回给调用方法generateShipLocations
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {//使用indexof为检查位置是否被既有战舰占据，
          //如果返回的索引大于或等于0说明这个位置有战舰
          return true;
        }
      }
    }
    return false;
  }
}
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops,please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);//A
    var row = alphabet.indexOf(firstChar);//0
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops,that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops,that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}
var controGuess = {
  guesses: 0,
  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in" + this.guesses + "guesses");
      }
    }
  }
};
var controller = {
  guesses: 0,
  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("you sank all my battleships, in " + this.guesses + " guesses");
      }
    }
  }
};
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeypress;

  model.generateShipLocations();
}//在函数init中调用generateShipLocations，以便在网页加载完毕后修改数组
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);

  guessInput.value = "";
}
function handleKeypress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
window.onload = init;//网页加载完毕以后执行函数init