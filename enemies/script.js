const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const CAVANS_WIDTH = canvas.width = 700;
const CANVAS_HEIGHT = canvas.height = 800;
const numberEnemy = 100;
const enemiesArray = [];
const fps = 35;

const enemyImage = new Image();
enemyImage.src = "enemy2.png";

let gameFrame = 0;
let staggerFrames = 10
class Enemy {
    constructor (){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 135 * ( Math.random() * 2 - 1 );
        this.spriteWidth = 266
        this.spriteHeight = 188
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.frame = 0;
        this.flapSpeed = Math.floor ( Math.random() * 3 + 1 )
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
    }
    update(deltaTime){
        this.x += this.speed * deltaTime;
        this.y += Math.sin(this.angle) * deltaTime * 100;
        if(this.x + this.width < 0 ) this.x = canvas.width
        if(gameFrame % this.flapSpeed === 0)
            this.frame > 4 ? this.frame = 0 : this.frame ++;
        this.angle += this.angleSpeed
    }
    draw(){
        ctx.drawImage(enemyImage, this.frame * this.spriteWidth, 0, this.spriteWidth, 
            this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}


class Enemy2 {
    constructor (){
        this.image = new Image();
        this.image.src = "enemy3.png";
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 135 * ( Math.random() * 2 - 1 );
        this.spriteWidth = 218
        this.spriteHeight = 177
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.frame = 0;
        this.flapSpeed = Math.floor ( Math.random() * 3 + 1 )
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 200
    }
    update(deltaTime){
        this.x = canvas.width / 2 * Math.sin(this.angle * Math.PI / 180 ) + ( canvas.width / 2 - this.width / 2 )
        this.y = canvas.height / 2 * Math.cos(this.angle * Math.PI / 180 ) + ( canvas.height / 2 - this.height / 2 )
        if(this.x + this.width < 0 ) this.x = canvas.width
        if(gameFrame % this.flapSpeed === 0)
            this.frame > 4 ? this.frame = 0 : this.frame ++;
        this.angle += this.angleSpeed * deltaTime * 1000
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, 
            this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Enemy3 {
    constructor (){
        this.image = new Image();
        this.image.src = "enemy4.png";
        this.speed =  Math.random() * 4 + 1 ;
        this.spriteWidth = 213
        this.spriteHeight = 212

        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;

        this.x = Math.random() * ( canvas.width - this.width );
        this.y = Math.random() * ( canvas.height - this.height );

       
        this.newX = Math.random() * ( canvas.width - this.width )
        this.newY = Math.random() * ( canvas.height - this.height )
        this.frame = 0;
        this.flapSpeed = Math.floor ( Math.random() * 3 + 1 )
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 200
        
    }
    update(deltaTime){
        console.log(deltaTime)
        if( gameFrame % 60 === 0){
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }

        let dx = this.x - this.newX
        let dy = this.y - this.newY
        console.log(this.x, this.newX)
        this.x -= dx/70 
        this.y -= dy/70
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, 
            this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for (let i = 0; i < numberEnemy; i ++ ) {
    enemiesArray.push(new Enemy3());
}

console.log(enemiesArray)

let timeStart = Date.now();
function animate( deltaTime = 0){
    deltaTime = (Date.now() - timeStart);
    timeStart = Date.now();

    ctx.clearRect(0, 0, CAVANS_WIDTH, CANVAS_HEIGHT);
    
    for( const en of enemiesArray){
        console.log(en)
        en.update(deltaTime/1000);
        en.draw()
    }
    gameFrame++ 
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps - (deltaTime));
    
}

// animate();