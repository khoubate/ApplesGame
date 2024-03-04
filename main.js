import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};
// Game Speed
const speedDown = 600;

const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");
// const  restartGameBtn = document.querySelector("#restartGameBtn") ;
const restartGameBtn = document.querySelector("#restartGameBtn");




// Variables Section
class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player
    this.cursor
    this.playerSpeed = speedDown + 50
    this.target
    this.points = 0
    this.textScore
    this.textTime
    this.timedEvent
    this.remainingTime
    this.coinMusic
    this.bgMusic
    this.emitter
  }

  preload() {
    // load the background
    this.load.image("bg", "/assets/bg.png");
    // load the player basket
    this.load.image("basket", "/assets/basket.png");
    // Load the apple image
    this.load.image("apple", "/assets/apple.png");
    // Add Music to the game
    this.load.audio("bgMusic", ["/assets/bgMusic.mp3"]);
    this.load.audio("coin", ["/assets/coin.mp3"]);

    this.load.image("money", "/assets/money.png")
   
  }

  create() {
    //Pause the game until we hit Start
    this.scene.pause("scene-game");

    // Set up the music and play 
    this.coinMusic = this.sound.add("coin")
    this.bgMusic = this.sound.add("bgMusic") 
    this.bgMusic.play()
   // this.bgMusic.stop()

    this.add.image(0, 0, "bg").setOrigin(0.0);

    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0.0);
    this.player.setImmovable(true);
    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true);
    // this.player.setSize(80,15).setOffset(10,70)
    this.player.setSize(this.player.width - this.player.width / 4, this.player.height / 6).setOffset(this.player.width / 10, this.player.height - this.player.height / 6)

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0.0);
    this.target.setMaxVelocity(0, speedDown);
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys();
    // Display  score on the screen
    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
      font: "25px Arial",
      fill: "#000000",
    });
    // Display time on the screen   
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });
// Create the game timer
    this.timedEvent = this.time.delayedCall(30000,this.gameOver,[], this)

//  Simple particle emitter that will emit small, slowly moving "money".
    this.emitter=this.add.particles(0,0,"money",{
      speed:100,
      gravityY:speedDown-200,
      scale:0.04,
      duration:100,
      emitting: false,
    })
    // Set up the emitter to follow the player object from its center, without being affected by gravity.
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  
  }

  update() {
    //Get the remaining time in seconds
    this.remainingTime = this.timedEvent.getRemainingSeconds()
    //Update the time UI with the remaining time
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()} `)

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
    }
    // Checks if the left or right arrow keys are being pressed down, and sets the player's horizontal velocity accordingly
    const { left, right } = this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed)
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed)
    } else {
      this.player.setVelocityX(0)
    }

  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }

  // Moves the target to a new random position, awards a point to the player, and updates the visual score display
  targetHit() {
    this.emitter.start()
    this.coinMusic.play()
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`)
  }

// Game Over function
  gameOver(){
    this.sys.game.destroy(true)
   // console.log("🎮 Game Over 😊");
   if(this.points >=10){
    gameEndScoreSpan.textContent =  "Your score is "+this.points+". That's impressive!";
    gameWinLoseSpan.textContent = " Win! 👏😊"
    }else{
      gameEndScoreSpan.textContent =  "Your score is "+this.points+". Try harder next time.";
      gameWinLoseSpan.textContent  = " Lost, sorry 😞!"
   }
   gameEndDiv.style.display="flex"

  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener('click', () =>{
  gameStartDiv.style.display= 'none';
  game.scene.resume('scene-game');
});

// restartGameBtn.addEvenListener('click',()=>{
//   window.location.reload();
// })

restartGameBtn.addEventListener('click', () => {
  window.location.reload();
});
