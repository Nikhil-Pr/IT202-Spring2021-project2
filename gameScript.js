let canvas = document.querySelector('#canvas')
let context = canvas.getContext('2d')
let frames = 0
let upPress = false
let downPress = false

let gameDetails = {
    score: 0,
    lives: 3,
    level: 1,
    gameRunning: false,
    objectSpeed: 5,
    framesPerSpawn: 50,
    objects: []
}

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

function Harm(posY) {
    this.sprite = null
    this.posX = canvas.width
    this.posY = posY
    this.width = 60
    this.height = 60
    this.initHarm = function () {
        this.sprite = new Image()
        this.sprite.src = 'assets/sprites/boulder.png'
        this.sprite.onload = () => {
        }
    }
    this.translate = function () {
        if (this.posX - gameDetails.objectSpeed < 0) {
            gameDetails.objects.splice(gameDetails.objects.indexOf(this), 1)
        } else {
            this.posX -= gameDetails.objectSpeed
        }
    }
}


function Benefit(posY) {
    this.sprite = null
    this.posX = canvas.width
    this.posY = posY
    this.width = 60
    this.height = 60
    this.initBenefit = function () {
        this.sprite = new Image()
        this.sprite.src = 'assets/sprites/wrench.png'
        this.sprite.onload = () => {
        }
    }
    this.translate = function () {
        if (this.posX - gameDetails.objectSpeed < 0) {
            gameDetails.objects.splice(gameDetails.objects.indexOf(this), 1)
        } else {
            this.posX -= gameDetails.objectSpeed
        }
    }
}
