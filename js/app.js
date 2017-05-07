
window.onload = function() {
  const width = 800;
  const height = 600;

  const game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update });

  // setup
  let player;
  let ball;
  let bricks;
  let cursors;

  function preload () {

  }
  
  function create () {
    // background

    // player
    const playerWidth = 60;
    const playerHeight = 10;
    player = game.add.graphics (game.width/2 - playerWidth/2, game.height -20)
    player.beginFill(0xFFFFFF, 1)
    player.drawRect(0,0, playerWidth, playerHeight)
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    // ball
    ball = game.add.graphics(game.width / 2, game.height - 30)
    ball.beginFill(0xFFFFFF, 1)
    ball.drawCircle(0,0,10)
    game.physics.arcade.enable(ball);
    // bricks
    bricks = game.add.group()
    let rows = 5;
    let numberOfBricks = 20
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
        console.log(i,f, f * brickWidth)
        let brick = game.add.graphics(f * brickWidth, brickOffset + brickHeight * i)
        brick.beginFill(colors[i%colors.length], 1)
        brick.drawRect(0,0,brickWidth, brickHeight)
        bricks.addChild(brick)
      }
    }
    // controls
  }

  function update () {

  }
};
