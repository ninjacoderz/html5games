import { Dust, Fire, Splash } from "./particles.js";

export const stateKeys = {
    IDLE: 0,
    JUMP: 1,
    FALL: 2,
    RUNNING: 3,
    SITTING: 4,
    ROLLING: 5,
    DIVING: 6,
    HIT: 7, 
}

export const states = {
    IDLE: {frameY: 0, maxFrame: 6},
    JUMP: {frameY: 1, maxFrame: 6},
    FALL: {frameY: 2, maxFrame: 6},
    RUNNING: {frameY: 3, maxFrame: 8},
    DIZZY: {frameY: 4, maxFrame: 10},
    SITTING: {frameY: 5, maxFrame: 4},
    ROLLING: {frameY: 6, maxFrame: 6},
    BITE: {frameY: 7, maxFrame: 6},
    KO: {frameY: 8, maxFrame: 11},
    GET_HIT: {frameY: 9, maxFrame: 3},
}


class State {
    constructor(game) {
        this.game = game;
    }
    enter(stateContent) {
        if( stateContent ) {
            this.frameX = 0;
            this.game.player.maxFrame = stateContent.maxFrame
            this.game.player.frameY = stateContent.frameY
        }
    }
}

export class Idle extends State {
    constructor(player){
        super(player)
    }
    enter() {
        super.enter(states.IDLE)
        this.game.player.speed = 0
    }
    handlerInput(inputs){
        if(inputs.includes("ArrowRight"))
            this.game.player.setState(stateKeys.RUNNING, 1);
        if(inputs.includes("ArrowLeft"))
            this.game.player.setState(stateKeys.RUNNING, 1);
        if(inputs.includes("ArrowUp"))
            this.game.player.setState(stateKeys.JUMP, 1)
        if(inputs.includes("ArrowDown"))
            this.game.player.setState(stateKeys.SITTING, 0)
        if(inputs.includes("Enter"))
            this.game.player.setState(stateKeys.ROLLING, 2)
    }
}

export class Running extends State {
    constructor(player){
        super(player);
    }
    enter() {
        super.enter(states.RUNNING)
    }
    handlerInput(inputs){
        if(inputs.includes("ArrowDown"))
            this.game.player.setState(stateKeys.SITTING, 0)
        if(inputs.includes("ArrowUp"))
            this.game.player.setState(stateKeys.JUMP, 1)
        if(inputs.includes("Enter"))
            this.game.player.setState(stateKeys.ROLLING, 2)

        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width/2, this.game.player.y + this.game.player.height))

    }
}


export class Jump extends State {
    constructor(player){
        super(player);
    }

    enter() {
        super.enter(states.JUMP);
        if(this.game.player.onGround())
            this.game.player.vy -= 40
    }

    handlerInput(inputs){
        // if(this.game.player.onGround()) this.game.player.setState(stateKeys.RUNNING, 1)
        if(this.game.player.vy > this.game.player.weight)  this.game.player.setState(stateKeys.FALL, 1)
        else if(inputs.includes("Enter")) this.game.player.setState(stateKeys.ROLLING, 2)
        else if(inputs.includes("ArrowDown")) this.game.player.setState(stateKeys.DIVING, 0)
    }
}


export class Falling extends State {
    constructor(player){
        super(player);
    }

    enter() {
        super.enter(states.FALL);
    }
    handlerInput(inputs){
        if(this.game.player.onGround()) this.game.player.setState(stateKeys.RUNNING, 1)
        else if(inputs.includes("ArrowDown")) this.game.player.setState(stateKeys.DIVING, 0)
    }
}


export class Sitting extends State {
    constructor(player){
        super(player);
    }

    enter() {
        super.enter(states.SITTING);
    }
    handlerInput(inputs){
        if(inputs.includes("ArrowUp")) this.game.player.setState(stateKeys.IDLE, 0)
    }
}

export class Rolling extends State {
    constructor(player){
        super(player);
    }

    enter() {
        super.enter(states.ROLLING);
    }
    handlerInput(inputs){
        if(!(inputs.includes("Enter")) && this.game.player.onGround()) {
            this.game.player.setState(stateKeys.RUNNING, 1)
        } else if(!inputs.includes("Enter") && !this.game.player.onGround()) {
            this.game.player.setState(stateKeys.FALL, 1)
        } else if(inputs.includes("Enter") && inputs.includes("ArrowUp") && this.game.player.onGround()) {
            this.game.player.vy -= 27
        }
        else if(inputs.includes("ArrowDown")) this.game.player.setState(stateKeys.DIVING, 0)

        this.game.particles.unshift(new Fire(this.game, this.game.player.x  +  this.game.player.width/2, this.game.player.y + this.game.player.height/2))
    }
}

export class Diving extends State {
    constructor(game){
        super(game);
    }

    enter() {
        super.enter(states.ROLLING);
        this.game.player.vy = 15
    }
    handlerInput(inputs){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x  +  this.game.player.width/2, this.game.player.y + this.game.player.height/2))
        if(this.game.player.onGround()) {
            this.game.player.setState(stateKeys.RUNNING, 1)
            for (let i = 0; i < 30 ; i++ )
                this.game.particles.unshift(new Splash(this.game, this.game.player.x +  this.game.player.width * 0.5 , this.game.player.y - this.game.player.height))
        } else if(inputs.includes("Enter") && this.game.player.onGround()) {
            this.game.player.setState(stateKeys.ROLLING, 2)
        } 

    }
}
export class Hit extends State {
    constructor(game){
        super(game);
    }

    enter() {
        super.enter(states.DIZZY);
        this.game.player.frameSpeed = 100
    }
    handlerInput(inputs){
        if(this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(stateKeys.RUNNING, 1)
            this.game.player.frameSpeed = 45
        } else if(this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(stateKeys.FALL, 1)
            this.game.player.frameSpeed = 45
        } 

    }
}
