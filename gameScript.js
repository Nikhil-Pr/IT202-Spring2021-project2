let canvas = document.querySelector('#canvas')
let context = canvas.getContext('2d')
let frames = 0
let upPress = false
let downPress = false
let curTilt = 0

//Game details object
let gameDetails = {
    score: 0,
    lives: 3,
    level: 1,
    gameRunning: false,
    objectSpeed: 5,
    framesPerSpawn: 60,
    objects: []
}

//Player object
let playerObj = {
    playerSprite: null,
    posX: 0,
    posY: canvas.height / 2,
    width: 100,
    height: 100,
    initSprite: function () {
        this.playerSprite = new Image()
        this.playerSprite.src = 'assets/sprites/playerCar.png'
        this.playerSprite.onload = () => {
        }
    },
    draw: function () {
        context.drawImage(this.playerSprite, this.posX, this.posY, this.width, this.height)
    },
    playerMove: function () {
        if (upPress && (this.posY > 100)) {
            this.posY -= 5
        } else if (downPress && (this.posY < canvas.height - 200)) {
            this.posY += 5
        }
    }
}

//Constructor for 'Harm' type objects
function Harm(posY) {
    this.sprite = null
    this.posX = canvas.width
    this.posY = posY
    this.width = 60
    this.height = 60
    //Sprite initialization
    this.initHarm = function () {
        this.sprite = new Image()
        this.sprite.src = 'assets/sprites/boulder.png'
        this.sprite.onload = () => {
        }
    }
    //Object Translation
    this.translate = function () {
        if (this.posX - gameDetails.objectSpeed < 0) {
            gameDetails.objects.splice(gameDetails.objects.indexOf(this), 1)
        } else {
            this.posX -= gameDetails.objectSpeed
        }
    }
}

//Constructor for 'Benefit' type objects
function Benefit(posY) {
    this.sprite = null
    this.posX = canvas.width
    this.posY = posY
    this.width = 60
    this.height = 60
    //Sprite initialization
    this.initBenefit = function () {
        this.sprite = new Image()
        this.sprite.src = 'assets/sprites/wrench.png'
        this.sprite.onload = () => {
        }
    }
    //Object Translation
    this.translate = function () {
        if (this.posX - gameDetails.objectSpeed < 0) {
            gameDetails.objects.splice(gameDetails.objects.indexOf(this), 1)
        } else {
            this.posX -= gameDetails.objectSpeed
        }
    }
}

//Clear the canvas
function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

//Key handler for key releases
function keyUpHandler(e) {
    //Start game key
    if (e.key === "Enter") {
        if (!gameDetails.gameRunning) {
            loadGame()
        }
    }

    //Key to bring up instructions
    if(e.key === "i"){
        if(!gameDetails.gameRunning){
            instructions()
        }
    }

    //Movement key handling
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPress = false
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPress = false
    }

}

//Key handler for key presses
function keyDownHandler(e) {
    //Movement key handling
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPress = true
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPress = true
    }
}

function orientationHandler(e){
    console.log("tilt")
    if(curTilt - e.beta < 0){

        curTilt = e.beta
        upPress = true
        downPress = false
    }
    else if(curTilt - e.beta > 0){
        curTilt = e.beta
        upPress = false
        downPress = true
    }
}

function mouseDownHandler(e){
    if(!gameDetails.gameRunning){
        loadGame()
    }
}

//Attach listeners for key handlers, display instructions
window.onload = function () {
    instructions()
    document.addEventListener("keyup", keyUpHandler, false)
    document.addEventListener("keydown", keyDownHandler, false)
    if('DeviceOrientationEvent' in window){
        window.addEventListener('deviceorientation', orientationHandler, false)
    }
    else{
        console.log("No tilt!")
    }
    document.addEventListener("mousedown",mouseDownHandler, false )
}

//Instruction display
function instructions() {
    clear()
    context.font = "42px Arial"
    context.fillStyle = "black"
    context.fillText("Game Details", 400, 100)
    context.font = "24px Arial"
    context.fillText("Use the arrow keys to control your car", 325, 150)
    context.fillText("=> Avoid large rocks", 325, 200)
    context.fillText("=> Collect wrenches to score points", 325, 250)
    context.fillText("=> You have 3 spare cars", 325, 300)
    context.fillText("=> More rocks will appear as you get more points", 325, 350)
    context.fillStyle = "green"
    context.font = "42px Arial"
    context.fillText("Press Enter to Begin!", 325, 450)
}

//game HUD display (lives, score, level)
function gameHUD() {
    context.font = "24px Arial"
    context.fillStyle = "Black"
    context.fillText(`Score: ${gameDetails.score}`, 10, 20)
    context.fillText(`Level: ${gameDetails.level}`, 10, 40)
    context.fillText(`Lives: ${gameDetails.lives}`, 900, 20)
}

//Start the game
function loadGame() {
    clear()
    gameDetails.gameRunning = true
    gameDetails.lives = 3
    gameDetails.score = 0
    gameDetails.level = 1
    gameDetails.objectSpeed = 5
    gameDetails.objects = []
    playerObj.initSprite()
    gameLoop()
}

//When the score threshold is met, this function is called to update the level and make changes to the difficulty
function nextLevel() {
    gameDetails.objectSpeed += 2
    gameDetails.level += 1
    gameDetails.framesPerSpawn -= 4
    let newObject = new Harm(Math.floor(Math.random() * ((canvas.height - 200) - 100 + 1) + 100))
    newObject.initHarm()
    gameDetails.objects.push(newObject)
}

//Check for a collision between player object and a harm/benefit object. Handle collisions appropriately
function collisionHandler(playerObj, object) {
    if (playerObj.posX < object.posY + object.width &&
        playerObj.posX + playerObj.width > object.posX &&
        playerObj.posY < object.posY + object.height &&
        playerObj.posY + playerObj.height > object.posY) {
        if (object instanceof Benefit) {
            gameDetails.objects.splice(gameDetails.objects.indexOf(object), 1)
            gameDetails.score += 2
            if (gameDetails.score % 10 === 0) {
                nextLevel()
            }
        }
        if (object instanceof Harm) {
            gameDetails.objects.splice(gameDetails.objects.indexOf(object), 1)
            if (gameDetails.lives === 0) {
                endGame()
            } else {
                gameDetails.lives -= 1
            }
        }
    }
}

//Game over function, runs when lives fall to <0
function endGame() {
    clear()
    gameDetails.gameRunning = false
    context.font = "42px Arial"
    context.fillText("Game Over!", 350, 100)
    context.fillText(`You scored: ${gameDetails.score}`, 350, 150)
    context.fillText(`You Reached Level: ${gameDetails.level}`, 350, 200)
    context.fillText('Press Enter to try again!', 350, 250)
    context.font = "36px Arial"
    context.fillText('Press "i" to bring up the instructions', 350, 300)
}

//Add object function, checks to see if it's time to spawn a new object and does so if it is
function addObject() {
    if (frames % gameDetails.framesPerSpawn === 0) {
        let newObject = null
        let rand = Math.floor(Math.random() * 2)
        if (rand === 0) {
            newObject = new Benefit(Math.floor(Math.random() * ((canvas.height - 200) - 100 + 1) + 100))
            newObject.initBenefit()
            gameDetails.objects.push(newObject)
        } else if (rand === 1) {
            newObject = new Harm(Math.floor(Math.random() * ((canvas.height - 200) - 100 + 1) + 100))
            newObject.initHarm()
            gameDetails.objects.push(newObject)
        }
    }
}

//Main loop for the game
function gameLoop() {
    frames += 1
    clear()
    //Move the player (if necessary)
    playerObj.playerMove()
    //Draw the player after movement
    playerObj.draw()
    addObject()
    gameHUD()
    //If there are objects, move them, check for collisions with the player and draw them
    if (gameDetails.objects !== undefined || gameDetails.objects.length > 0) {
        gameDetails.objects.forEach(object => {
            object.translate()
            context.drawImage(object.sprite, object.posX, object.posY, object.width, object.height)
            collisionHandler(playerObj, object)
        })
    }
    if (gameDetails.gameRunning) {
        requestAnimationFrame(gameLoop)
    }
}
