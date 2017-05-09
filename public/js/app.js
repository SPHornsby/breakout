
window.onload = function() {
  const width = 800;
  const height = 600;

  const game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update });
  
  // setup
  let player;
  let ball;
  let bricks;
  let cursors;
  let score = 0;
  let scoreText;
  let values = [9,7,5,3,1]
  let lives = 3
  let livesText
  let pauseKey
  let gameover = false
  let gameoverText
  let countdownText
  let ballIsOut = false
  let ballIsOutTime
  let gameStarted = false
  let hits = 0

  function preload () {
    game.load.spritesheet('bricks', 'bricksSheet.png', 80,30)
  }
  
  function create () {
    // background

    //score
    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#999' });
    livesText = game.add.text(game.width -150, 16, 'Lives: 3', { fontSize: '32px', fill: '#999' })
    // player
    const playerWidth = 60;
    const playerHeight = 10;
    player = game.add.graphics (game.width/2 - playerWidth/2, game.height -20)
    player.beginFill(0xFFFFFF, 1)
    player.drawRect(0,0, playerWidth, playerHeight)
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.data.lives = 3;
    // ball
    ball = game.add.graphics(game.width / 2 , game.height - 300)
    ball.beginFill(0xFFFFFF, 1)
    ball.drawRect(0,0, 15, 15)
    ball.autoCull = true;
    ball.outOfBoundsKill = true;
    ball.enableBody = true;
    game.physics.arcade.enable(ball);
    ball.body.velocity.y = 200;
    // bricks
    bricks = game.add.group()
    bricks.enableBody = true;
    let rows = 5;
    let numberOfBricks = 10
    let brickWidth = game.width / numberOfBricks
    let brickHeight = 30
    let brickOffset = 100
    let colors = [
      "0xCC0000",
      "0xFFAE19",
      "0xEEEE19",
      "0x0000CC",
      "0x009900"
    ]
    for (let i = 0; i < rows; i++ ) {
      for (let f = 0; f < numberOfBricks; f++ ) {
        let brick = game.add.sprite(f * brickWidth, brickOffset + brickHeight * i, 'bricks', i);

        brick.health = 1;
        brick.data.value = values[i];
        bricks.addChild(brick)
        
      }
    }
    game.physics.arcade.enable(bricks)
    // controls
    cursors = game.input.keyboard.createCursorKeys();
    pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    pauseKey.onUp.add(pause)
  }

  function update () {
    if(!gameStarted) {
      game.paused = true;
    }
    // ball collisions
    game.physics.arcade.overlap(ball, player, playerHit)
    game.physics.arcade.overlap(ball, bricks, bricksHit)
    if (ball.body.y <=0) {
      ball.body.velocity.y *= -1;
    }
    if (ball.body.x <=0 || ball.body.x >= game.width) {
      ball.body.velocity.x *= -1;
    }
    if (ball.body.y > game.height && !ballIsOut) {
      if (player.data.lives <= 0) {
        ball.destroy()
        gameoverText = game.add.text(game.width/2 -100, game.height - 200, 'GAME OVER', { fontSize: '32px', fill: '#999' })
        game.paused = true
        gameover = true
      }
      else {
        ballOut()
      }

    }
    // controls
    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
      player.body.velocity.x = -250;
    }
    if (cursors.right.isDown) {
      player.body.velocity.x = 250;
    }
    // ball is out
    if (ballIsOut) {
      if (checkForThreeSecondsElapsed()) {
        ballIsOut = false
        newBall()
      }
      updateScreenTimer()
    }
  }

  // helper functions
  function playerHit() {

    ball.body.velocity.y *= -1;
    // divide player paddle into zones
    const left = player.body.center.x - 10;
    const right = player.body.center.x + 10;
    ball.body.velocity.x = 0;
    if (ball.body.center.x < left) {
      ball.body.velocity.x = -50 + player.body.velocity.x/2;
    }
    if (ball.body.center.x > right) {
      ball.body.velocity.x = 50 + player.body.velocity.x/2;
    }
  }
  function bricksHit(ball, brick) {
    // brick.alpha *= 0.75
    
    // rebounds (needs work)
    if (brick.body.wasTouching.down) {
      ball.body.velocity.y = Math.abs(ball.body.velocity.y)
    }
    else if (brick.body.wasTouching.up) {
      ball.body.velocity.y = Math.abs(ball.body.velocity.y) * -1
    }
    else if (brick.body.wasTouching.left) {
      ball.body.velocity.x = Math.abs(ball.body.velocity.x) * -1
    }
    else if (brick.body.wasTouching.right) {
      ball.body.velocity.x = Math.abs(ball.body.velocity.x)
    }
    if (brick.body.wasTouching.up || brick.body.wasTouching.down || brick.body.wasTouching.left || brick.body.wasTouching.right) {
      brick.damage(1)
    }
    if (!brick.alive) {
      //  Add and update the score
      score += brick.data.value;
      scoreText.text = 'Score: ' + score;
    }
    if (bricks.countLiving() <= 0) {
      game.paused = true;
    }
  }
  function ballOut() {
    ballIsOutTime = game.time.time
    ballIsOut = true;
    countdownText = game.add.text(game.width/2 -16, game.height - 200, '3', { fontSize: '32px', fill: '#999' })
  }
  function updateScreenTimer() {
    let countdown = 3 - Math.floor((game.time.time - ballIsOutTime)/1000)
    countdownText.text = countdown
  }
  function newBall() {
    player.data.lives -= 1
    livesText.text = 'Lives: ' + player.data.lives;
    ball.body.x = game.width / 2
    ball.body.y = game.height - 300
    ball.body.velocity.x = 0
    ball.body.velocity.y = 200
    countdownText.destroy()
  }
  function pause() {
    gameStarted = true
    if (!gameover) {
      game.paused = !game.paused
    }
  }
  function checkForThreeSecondsElapsed(){
    let elapsed = game.time.time - ballIsOutTime
    return elapsed >= 3000 ? true : false;
  }
};
