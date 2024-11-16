const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const CAVANS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
let x = 0;

const fps = 35;
let timeStart = Date.now();

const spriteWidth = 575
const spriteHeight = 523

let gameFrame = 0
const staggerFrames = 4; 

let playerState = "idle";


const spriteAnimations = []

const animationStates = [
    {
        name: 'idle',
        frame: 7,
    },
    {
        name: 'jump',
        frame: 7,
    },
    {
        name: 'fall',
        frame: 7,
    },
    {
        name: 'run',
        frame: 9,
    },
    {
        name: 'dizzy',
        frame: 11,
    },
    {
        name: 'sit',
        frame: 5,
    },
    {
        name: 'roll',
        frame: 7,
    },
    {
        name: 'bite',
        frame: 7,
    },
    {
        name: 'ko',
        frame: 12,
    },
    {
        name: 'gethit',
        frame: 4,
    }
]

document.getElementById("animations").onchange = (event) => {
    playerState = event.target.value;
}
animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let i = 0; i < state.frame; i++) {
        let positionX = i * spriteWidth;
        let positionY = index*spriteHeight;
        frames.loc.push ({x: positionX, y: positionY})
    }
    spriteAnimations[state.name] = frames
})

console.log(spriteAnimations);

function animate( ){
    let detaTime = (Date.now() - timeStart);
    timeStart = Date.now();
  
    let position = Math.floor( gameFrame / staggerFrames )  % spriteAnimations[playerState].loc.length;

    const location = spriteAnimations[playerState].loc[position];
    console.log(location);
    
    frameX = position * spriteWidth
    ctx.clearRect(0, 0, CAVANS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, location.x, location.y, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight );
    
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps - (detaTime));

    gameFrame ++; 
}   

animate();