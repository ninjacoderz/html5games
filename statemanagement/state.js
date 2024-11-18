export const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    SITTING_LEFT: 2,
    SITTING_RIGHT: 3,
    RUNNING_LEFT: 4,
    RUNNING_RIGHT: 5,
    JUMPING_LEFT: 6,
    JUMPING_RIGHT: 7,
    FALLING_LEFT: 8,
    FALLING_RIGHT: 9
}

class State {
    constructor(state) {
        this.state = state;
    }
    enter(maxFrame) {
        if(maxFrame ) this.player.maxFrame = maxFrame
        else this.player.maxFrame = 6
    }
}

export class StandingLeft extends State {
    constructor(player){
        super("STANDING LEFT");
        this.player = player;
    }
    enter() {
        super.enter();
        this.player.frameY = 1
        this.player.speed = 0
    }
    handlerInput(input){
        if(input === "PRESS right")  this.player.setState(states.RUNNING_RIGHT)
        else if(input === "PRESS left") this.player.setState(states.RUNNING_LEFT)
        else if(input === "PRESS down") this.player.setState(states.SITTING_LEFT)
        else if(input === "PRESS up") this.player.setState(states.JUMPING_LEFT)
    }
}

export class StandingRight extends State {
    constructor(player){
        super("STANDING RIGHT");
        this.player = player;
    }
    enter() {
        super.enter();
        this.player.frameY = 0
        this.player.speed = 0
    }
    handlerInput(input){
        if(input === "PRESS left") this.player.setState(states.RUNNING_LEFT)
        if(input === "PRESS right") this.player.setState(states.RUNNING_RIGHT)
        else if(input === "PRESS down") this.player.setState(states.SITTING_RIGHT)
        else if(input === "PRESS up") this.player.setState(states.JUMPING_RIGHT)
    }
}

export class SittingRight extends State {
    constructor(player){
        super("SETTING RIGHT");
        this.player = player;
    }
    enter() {
        super.enter(4);
        this.player.frameY = 8
    }
    handlerInput(input){
        if(input === "PRESS left") {
            this.player.setState(states.SITTING_LEFT)
        }
        else if(input === "PRESS up") {
            this.player.setState(states.STANDING_RIGHT)
        }
        else if(input === "RELEASE down") {
            this.player.setState(states.STANDING_RIGHT)
        }
    }
}

export class SittingLeft extends State {
    constructor(player){
        super("SETTING LEFT");
        this.player = player;
    }
    enter() {
        super.enter(4);
        this.player.frameY = 9
    }
    handlerInput(input){
        if(input === "PRESS right") {
            this.player.setState(states.SITTING_RIGHT)
        }
        else if(input === "PRESS up") {
            this.player.setState(states.STANDING_LEFT)
        }
        else if(input === "RELEASE down") {
            this.player.setState(states.STANDING_LEFT)
        }
    }
}

export class RunningLeft extends State {
    constructor(player){
        super("Running LEFT");
        this.player = player;
    }
    enter() {
        super.enter(8);
        this.player.frameY = 7
        this.player.speed = -this.player.maxSpeed
    }
    handlerInput(input){
        if(input === "PRESS left")  this.player.setState(states.RUNNING_LEFT)
        else if(input === "RELEASE left") this.player.setState(states.STANDING_LEFT)
        else if(input === "PRESS down") this.player.setState(states.SITTING_LEFT)
    }
}

export class RunningRight extends State {
    constructor(player){
        super("Running RIGHT");
        this.player = player;
    }
    enter() {
        super.enter(8);
        this.player.frameY = 6
        this.player.speed = this.player.maxSpeed
    }
    handlerInput(input){
        if(input === "PRESS right")  this.player.setState(states.RUNNING_RIGHT)
        else if(input === "RELEASE right") this.player.setState(states.STANDING_RIGHT)
        else if(input === "PRESS down") this.player.setState(states.SITTING_RIGHT)
    }
}

export class JumpingRight extends State {
    constructor(player){
        super("Jumping RIGHT");
        this.player = player;
    }

    enter() {
        super.enter();
        this.player.frameY = 2
        this.player.speed = this.player.maxSpeed
        if(this.player.onGround())
            this.player.vy -= 40
    }

    handlerInput(input){
        if(input === "PRESS left")  this.player.setState(states.JUMPING_LEFT)
        else if(this.player.onGround()) this.player.setState(states.STANDING_RIGHT)
        else if(this.player.vy > 0)  this.player.setState(states.FALLING_RIGHT)
    }
}

export class JumpingLeft extends State {
    constructor(player){
        super("Jumping LEFT");
        this.player = player;
    }

    enter() {
        super.enter();
        this.player.frameY = 3
        this.player.speed = -this.player.maxSpeed

        if(this.player.onGround())
            this.player.vy -= 40
    }

    handlerInput(input){
        if(input === "PRESS right")  this.player.setState(states.JUMPING_RIGHT)
        else if(this.player.onGround()) this.player.setState(states.STANDING_LEFT)
        else if(this.player.vy > 0)  this.player.setState(states.FALLING_LEFT)
    }
}

export class FallingRight extends State {
    constructor(player){
        super("Falling RIGHT");
        this.player = player;
    }

    enter() {
        super.enter();
        this.player.frameY = 4
    }

    handlerInput(input){
        if(input === "PRESS left")  this.player.setState(states.FALLING_LEFT)
        else if(this.player.onGround()) this.player.setState(states.STANDING_RIGHT)
    }
}

export class FallingLeft extends State {
    constructor(player){
        super("Falling LEFT");
        this.player = player;
    }

    enter() {
        super.enter();
        this.player.frameY = 5
    }

    handlerInput(input){
        if(input === "PRESS right")  this.player.setState(states.FALLING_RIGHT)
        else if(this.player.onGround()) this.player.setState(states.STANDING_LEFT)
    }
}