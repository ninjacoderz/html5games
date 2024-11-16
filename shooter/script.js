const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colliionCanvas = document.getElementById("colissionCanvas");
const colissionCtx = colliionCanvas.getContext('2d');
colliionCanvas.width = window.innerWidth;
colliionCanvas.height = window.innerHeight;

let explosionFrame = 0
const canvasPosition = canvas.getBoundingClientRect();
let timeStart = Date.now();
const fps = 45
let gameOver = false;
let gameFrame = 0;
class Explosion {

    constructor (x, y) {
        this.spriteWidth = 200
        this.spriteHeight = 179 
        this.width = this.spriteWidth / 2
        this.height = this.spriteHeight / 2

        this.x = x - this.width / 2;
        this.y = y - this.height / 2;

        this.animateFrame = 0;
        this.image = new Image();
        this.image.src = "boom.png"
        this.animateTimeInterval = 200;
        this.intervalFromLastTime = 0
        this.sound = new Audio()
        this.sound.src = "boom.wav"
    }

    update (deltaTime) {
        if(this.animateFrame == 0) this.sound.play() ;
        this.intervalFromLastTime += deltaTime
        if(this.intervalFromLastTime > this.animateTimeInterval) {
            ++this.animateFrame ;
            this.intervalFromLastTime = 0
        }
    }

    draw () {
        ctx.drawImage(this.image, ( this.animateFrame - 1) * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
            this.x , this.y, this.width , this.height );
    }

}

const explosions = []

let revens = []
let timeToNextReven = 0 
let revenInteval = 500;

class Reven {
    constructor() {
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDelete = false
        // Sprite 
        this.image = new Image();
        this.image.src = "raven.png"
        this.spriteWidth = 271
        this.spriteHeight = 194

        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.x = canvas.width;
        this.y = Math.random() * (  canvas.height - this.height );

        this.frame = 0;
        this.maxFrame = 4;
        this.frameRate = Math.random();
        this.flapTimeInterval = Math.random() * 50 + 50;
        this.lastFlapTime = 0

        this.randomColor = [Math.floor(Math.random() * 225), Math.floor(Math.random() * 225), Math.floor(Math.random() * 225)]
        this.color = 'rgb(' + this.randomColor[0] +","+ this.randomColor[1] +","+ this.randomColor[2] + ")";
        this.hasTrail = Math.random() > 0.5 
    }

    update (deltaTime) {
        this.x -= this.directionX;
        this.y -= this.directionY;
        if(this.y < 0 || this.y > canvas.height - this.height ) this.directionY = -this.directionY
        if( this.x <  -this.width ) this.markedForDelete = true;

        if(this.frame > this.maxFrame) this.frame = 0
        else {
            this.lastFlapTime += deltaTime;
            if(this.lastFlapTime > this.flapTimeInterval) {
                this.frame++ 
                this.lastFlapTime = 0;
                if(this.hasTrail) 
                    for(let i = 0; i< 5; i++ ) particles.push(new Particle(this.x + this.width, this.y + this.height/2, this.width, this.color))
            }

        }
        if(this.x < 0 ) gameOver = true
    }

    draw () {
        colissionCtx.fillStyle = this.color;
        colissionCtx.fillRect (this.x , this.y, this.width, this.height);
        ctx.drawImage ( this.image , this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height )
    }
}

let score = 0;
function drawScore() {
    ctx.font = '50px Impact'
    ctx.fillStyle = 'black';
    ctx.fillText("Score: " + score, 45, 70);

    ctx.fillStyle = 'white';
    ctx.fillText("Score: " + score, 50, 75);
    
}

function drawGameOver  () {
    ctx.font = '50px Impact';
    ctx.textAlign = "center";
    ctx.fillStyle = 'black';
    ctx.fillText("Game Over, your score is " + score, canvas.width/2 - 5, canvas.height/2 - 5);

    ctx.fillStyle = 'white';
    ctx.fillText("Game Over, your score is " + score, canvas.width/2, canvas.height/2);
    
}

let particles = []
class Particle {
    constructor ( x, y , size, color) {
        this.x = x + Math.random() * 50 - 25;
        this.y = y + Math.random() * 50 - 25; 
        this.size = size;
        this.color = color; 
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 30
        this.speedX = Math.random() * 1 + 0.3  
        this.markedForDelete = false;
    }
    update() {
        this.x += this.speedX;
        this.radius += 0.5
        if(this.radius > this.maxRadius - 5 ) this.markedForDelete = true;
    }
    draw () {
        ctx.save()
        ctx.globalAlpha = 1 - this.radius / this.maxRadius
        ctx.beginPath ();
        ctx.fillStyle = this.color;
        ctx.arc(this.x , this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

window.addEventListener("click", (event) => {
    
    const detectPixelColor = colissionCtx.getImageData ( event.x, event.y, 1, 1);
    const pc = detectPixelColor.data
    revens.forEach ( object => {
        if(object.randomColor[0]=== pc[0] && object.randomColor[1]=== pc[1] && object.randomColor[2]=== pc[2]){
            object.markedForDelete = true;
            score++; 
        }
    })
    
    const explosion = new Explosion(event.clientX - canvasPosition.x, event.clientY - canvasPosition.y)
    explosions.push(explosion)
})

function animate() {
    let deltaTime = Date.now() - timeStart;
    timeStart = Date.now();
    ctx.clearRect ( 0, 0, canvas.width, canvas.height )
    colissionCtx.clearRect ( 0, 0, canvas.width, canvas.height )
    drawScore();

    for(let i = 0; i < explosions.length; i++ ){
        explosions[i].update(deltaTime)
        explosions[i].draw()
        if ( explosions[i].animateFrame > 5 ){
            explosions.splice(i, 1);
            i--;
        }
    }

    // Reven draw 
    timeToNextReven += deltaTime
    if(timeToNextReven > revenInteval) {
        revens.push(new Reven())
        timeToNextReven = 0;
        revens.sort((a, b) => a.width - b.width);
    }
    particles.sort((a, b) => a.size - b.size);

    [ ...particles, ...revens, ...explosions].forEach(object => {
        object.update(deltaTime);
    });

    [ ...particles, ...revens, ...explosions].forEach(object => {
        object.draw()
    });
    revens = revens.filter(reven => !reven.markedForDelete)

    particles = particles.filter(reven => !reven.markedForDelete)
    ++gameFrame;
    setTimeout(() => {
        if(!gameOver) requestAnimationFrame(animate);
        else drawGameOver ();
    }, 1000 / fps - (deltaTime));

}

animate();