const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 800
let explosionFrame = 0
const canvasPosition = canvas.getBoundingClientRect();
let timeStart = Date.now();
const fps = 45
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
        this.animateSpeed = 10;
        this.frame  =  0
        this.sound = new Audio()
        this.sound.src = "boom.wav"
    }

    update () {
        if(this.animateFrame == 0) this.sound.play() ;
        if(this.frame % this.animateSpeed === 0) this.animateFrame ++;
        this.frame ++ 
    }

    draw () {
        ctx.drawImage(this.image, ( this.animateFrame - 1) * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
            this.x , this.y, this.width , this.height );
    }

}

const explosions = []

window.addEventListener("click", (event) => {
    
    const explosion = new Explosion(event.clientX - canvasPosition.x, event.clientY - canvasPosition.y)
    explosions.push(explosion)
})

function animate() {
    let detaTime = Date.now() - timeStart;
    timeStart = Date.now();
    ctx.clearRect ( 0, 0, canvas.width, canvas.height )
    for(let i = 0; i < explosions.length; i++ ){
        explosions[i].update()
        explosions[i].draw()
        if ( explosions[i].animateFrame > 5 ){
            explosions.splice(i, 1);
            i--;
        }
    }

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps - (detaTime));

}

animate();