
// Timer
//https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
// setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

let myTime = setInterval(function(){ setTime() }, 500);
function stopTime() {
    clearInterval(myTime);
}

//canvas sizes from engine.js
let canvasWidth = 505;
let canvasHeight = 606;
// Enemies our player must avoid
let Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};
//to count how many times reached the river
let score = 0;
$('#score').text(score);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // if enemy moves outside of the canvas, we return them to the beginning of the canvas
    if (this.x > canvasWidth) {
        this.x = -100; //or they pop out on the first left cell
        this.speed = Math.floor(Math.random() * 200) + 50; //random spead each appearance
    }

    // Check for collision between player and enemies: fro x add 101*2/3  and for y 80*2/3 half size of the cell
    if (player.x + 80 > this.x &&
        player.x < this.x + 80 &&
        60 + player.y > this.y &&
        player.y < this.y + 60) {
       // random location for new appearance
        player.x = Math.floor(Math.random() * 5)*100;
        player.y = 400;
        score = 0;
        $('#score').text(score);
        // console.log("time is ", myTime);
        // stopTime();

        // toggle the word disaster and background color after player collides with enemy
        $('body').toggleClass('anime')
        $('#announcement').toggleClass('open');
        $('.disaster').toggleClass('open');

        // $('#announcement').animate('shake', '1s');
        setTimeout(function () {
            $('#announcement').toggleClass('open');
            $('.disaster').toggleClass('open');
            $('body').toggleClass('anime');
        }, 400);
        setTimeout(function () {
            totalSeconds = -1; //otherwise counts from the moment of reseting the game so it's 1 when started
        }, 200);
    }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Resources.load([
    'images/char-pink-girl.png',
    'images/char-horn-girl.png',
    'images/char-princess-girl.png',
    'images/char-cat-girl.png',
    'images/Gem Blue.png',
    'images/Gem Orange.png',
    'images/Gem Green.png',
    'images/Heart.png',
    'images/scorpio.png'
]);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    let items = ['images/char-boy.png', 'images/char-pink-girl.png', 'images/char-horn-girl', 'images/char-cat-girl.png'];
    this.sprite = items[Math.floor(Math.random()*(items.length))];
    // this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.update = function() {
    // Prevent player from moving beyond canvas wall boundaries
    if (this.y > canvasHeight*2/3) {
        this.y = canvasHeight*2/3; //606-204
    }
    if (this.x > canvasWidth*4/5) {
        this.x = canvasWidth*4/5; //505-105 otherwise half of the boy is out of canvas
    }
    if (this.x < 0) {
        this.x = 0;
    }

    // If reached the river: score + 1, coming back to new position
    if (this.y < 0) {
        this.x = Math.floor(Math.random() * 5)*100;
        this.y = canvasHeight*4/5;
        score += 1;
        $('#score').text(score); //to print score on the screen
        $('#win').toggleClass('open');
        setTimeout(function () {
            $('#win').toggleClass('open');
        }, 400);
        // console.log('score ', score); // to check score calculation
    }
};

//copy from Enemy
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            this.x -= this.speed + 50; // half of the cell
            break;
        case 'up':
            this.y -= this.speed + 40; //half of the cell
            break;
        case 'right':
            this.x += this.speed + 50;
            break;
        case 'down':
            this.y += this.speed + 40;
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
 let allEnemies = [];

// Position "y" where the enemies will are created
//height = 606, each cell abiut 80 as lowest on is wide, middle of cell + 40 ,between enemies 80
let enemyPosition = [60, 140, 220];

// Place the player object in a variable called player
let player = new Player(200, 380, 50);
let enemy;

//choose randomlu enemy from the position list and add to the array of allEnemies
enemyPosition.forEach(function(enemyPosition) {
    enemy = new Enemy(0, enemyPosition, Math.floor(Math.random() *200) + 100);
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// function restart() {
//   window.location.reload(true);
//   // window.location.href = window.location.href
//   // document.location.reload(true);
//}