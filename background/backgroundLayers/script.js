const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const CAVANS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 205;

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'backgroundLayers/layer-1.png';

const backgroundLayer2 = new Image();
backgroundLayer2.src = 'backgroundLayers/layer-2.png';

const backgroundLayer3 = new Image();
backgroundLayer3.src = 'backgroundLayers/layer-3.png';

const backgroundLayer4 = new Image();
backgroundLayer4.src = 'backgroundLayers/layer-4.png';

const backgroundLayer5 = new Image();
backgroundLayer5.src = 'backgroundLayers/layer-5.png';

const fps = 45;
let timeStart = Date.now();

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.heigh = 700;
        this.image = image;
        this.speedModifier = speedModifier; 
    }

    update(deltaTime) {
        this.speed = gameSpeed * this.speedModifier;  
        const movement = this.speed * deltaTime / 1000
        if(this.x < -this.width ) this.x = 0
        this.x -= movement
        
    }

    draw () {
        ctx.drawImage(this.image, this.x, 0);
        ctx.drawImage(this.image, this.x + this.width, 0);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.1)
const layer2 = new Layer(backgroundLayer2, 0.25)
const layer3 = new Layer(backgroundLayer3, 0.5)
const layer4 = new Layer(backgroundLayer4, 0.85)
const layer5 = new Layer(backgroundLayer5, 1);

const gameObjects  = [layer1, layer2, layer3, layer4, layer5]

const showGameSpeed = document.getElementById("showGameSpeed")
showGameSpeed.textContent = gameSpeed
const slider = document.getElementById("slider");
slider.onchange = (evt) => {
    gameSpeed = evt.target.value;
    showGameSpeed.textContent = evt.target.value;
}



function animate( detaTime = 0){
    detaTime = (Date.now() - timeStart);
    timeStart = Date.now();

    ctx.clearRect(0, 0, CAVANS_WIDTH, CANVAS_HEIGHT);
    
    gameObjects.forEach((object) => {
        object.update(detaTime)
        object.draw();
    })
    
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps - (detaTime));

}   

// animate();