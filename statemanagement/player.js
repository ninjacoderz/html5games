import { FallingLeft, FallingRight, JumpingLeft, JumpingRight, RunningLeft, RunningRight, SittingLeft, SittingRight, StandingLeft, StandingRight, states } from "./state.js";

export default class Player {
    constructor (gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.states = [new StandingLeft(this), new StandingRight(this), new SittingLeft(this), new SittingRight(this), 
            new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this),
            new FallingLeft(this), new FallingRight(this)];
        this.currentState = this.states[states.STANDING_RIGHT];
        this.image = document.getElementById("dogImage")
        this.width = 200;
        this.height = 182;
        this.x = 0;
        this.y = gameHeight - this.height;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.vy = 0;
        this.weight = 2;
        this.maxFrame = 6
        this.frameSpeed = 5 // 100 milisecond / frame
        this.currentFrame = 0
    }

    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    update(input, detaTime){
        this.currentState.handlerInput(input)
        this.x += this.speed

        if(this.x <= 0) this.x = 0
        else if(this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width
        
        this.y += this.vy
        if(!this.onGround()) this.vy += this.weight
        else {
            this.vy = 0;
            this.y = this.gameHeight - this.height;
        }
        console.log(detaTime)
        
        console.log("currentFrame",this.currentFrame)
        if(this.currentFrame  >= this.frameSpeed){
            this.frameX ++;
            this.currentFrame = 0
        }
        else {
            this.currentFrame += detaTime
        }
        if(this.frameX > this.maxFrame) this.frameX = 0
    }
    
    onGround() {
        return this.y >= this.gameHeight - this.height
    }

    draw(context){
        context.drawImage( this.image, this.width * this.frameX, this.height * this.frameY, 
            this.width, this.height,  this.x, this.y, this.width, this.height)
    }

}