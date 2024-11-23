import { Diving, Falling,Hit,Idle, Jump, Rolling, Running, Sitting, stateKeys } from "./state.js";

export default class Player {
    constructor (game){
        this.game = game
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;

        this.frameX = 0;
        this.frameY = 0;
        this.weight = 2;

        this.speed = 0;
        this.maxSpeed = 10;

        this.vy = 0;

        this.maxFrame = 6
        this.frameSpeed = 45 
        this.currentFrame = 0

        this.image = document.getElementById("player");
        this.states = [new Idle(this.game), new Jump(this.game), new Falling(this.game), 
            new Running(this.game), new Sitting(this.game), new Rolling(this.game),
            new Diving(this.game), new Hit(this.game)
        ];
    }

    setState(state, speed){
        this.currentState = this.states[state];
        this.currentState.enter();
        this.game.speed = speed * this.game.maxSpeed;
    }

    onGround() {
        return this.y >= (this.game.height - this.height - this.game.groundMargin);
    }

    update(pressedKeys, detaTime){
        this.currentState.handlerInput(pressedKeys)
        if(pressedKeys.includes("ArrowRight") && this.currentState !== this.states[stateKeys.HIT]) {
            this.speed = this.maxSpeed;
        }
        else if(pressedKeys.includes( "ArrowLeft")&& this.currentState !== this.states[stateKeys.HIT]) {
            this.speed = -this.maxSpeed;
        }
        else {
            this.speed = 0;
        }
        this.x += this.speed

        if(this.x <= 0) this.x = 0
        else if(this.x >= this.game.width - this.width) this.x = this.game.width - this.width
        
        this.y += this.vy
        if(!this.onGround()) this.vy += this.weight
        else {
            this.vy = 0;
            this.y = this.game.height - this.height - this.game.groundMargin;
        }

        
        if(this.currentFrame  >= this.frameSpeed){
            this.frameX ++;
            this.currentFrame = 0
        }
        else {
            this.currentFrame += detaTime
        }
        if(this.frameX > this.maxFrame) this.frameX = 0
        // collision 
        this.game.enemies.forEach( enemy => {
            const disX = ( enemy.x + enemy.width / 2 )-  ( this.x + this.width /2 )
            const disY = ( enemy.y + enemy.height / 2 ) - (this.y + this.height/2 )
            const distance = Math.sqrt(disX* disX + disY * disY)
            if ( distance < enemy.width / 2 + this.width /2){
                enemy.markedForDeletion = true;
                if(this.currentState === this.states[stateKeys.ROLLING] || this.currentState === this.states[stateKeys.DIVING])
                    this.game.score ++
                else this.setState(stateKeys.HIT, 0)
            }
        })
    }
    
    draw (context) {
        if(this.game.debug) {
            context.strokeStyle = "white"
            // ctx.strokeRect(this.x, this.y, this.width, this.height)
            context.beginPath();
            context.arc(this.x+ this.width/2, this.y+ this.height/2, this.width/2, 0, Math.PI*2)
            context.stroke();
        }
        context.drawImage( this.image, this.width * this.frameX, this.height * this.frameY, 
            this.width, this.height,  this.x, this.y, this.width, this.height)
    }
}