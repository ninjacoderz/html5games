
window.addEventListener("load", function(event) {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    const CAVANS_WIDTH = canvas.width = 500;
    const CANVAS_HEIGHT = canvas.height = 800;

    class Game {
        constructor(ctx, width, height) {
            this.enemies = []
            this.ctx = ctx
            this.width = width
            this.height = height

            this.enemyInterval = 400
            this.enemyTime = 0
            this.enemyType = ["worm", "ghost", "spider"]
        }

        update(deltaTime) {
            
            this.enemies = this.enemies.filter(object => !object.markedForDelete)
            if(this.enemyTime > this.enemyInterval){
                this.#addNewEnemy()
                this.enemyTime = 0
            
            } else {
                this.enemyTime += deltaTime
            }
            
            if(this.enemies.length > 0 ) for(let enemy of this.enemies) {
                enemy.update(deltaTime);
            }

        }
        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height)

            if(this.enemies.length > 0 ) for(let enemy of this.enemies) {
                enemy.draw(this.ctx);
            }
        }

        #addNewEnemy() {
            const randomEnemy = this.enemyType[Math.floor(Math.random() * this.enemyType.length)]
            if(randomEnemy === "worm") this.enemies.push(new Worm(this))
            else if(randomEnemy == "ghost") this.enemies.push(new Ghost(this))
                else if(randomEnemy == "spider") this.enemies.push(new Spider(this))
            this.enemies.sort(function(a,b) {
                return a.y - b.y
            });
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.markedForDelete = false
            this.frame = 0
            this.frameInterval = 0
            this.frameRate = 50 // 50 milisecond / frame
            this.totalFrame = 5
            this.vx = Math.random() * 0.1;
            this.vy = 0;
        }
        update(deltaTime) {
            this.frameInterval += deltaTime
            if(this.frameInterval > this.frameRate ) { 
                this.frame ++ ; 
                this.frameInterval = 0
            }
            if(this.frame > this.totalFrame ) this.frame = 0;

            this.x -= this.vx * deltaTime

            if(this.x < -this.width ) this.markedForDelete = true;

            if(this.y < -this.height ) this.markedForDelete = true;
        }
        draw(ctx) {
            // ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0,this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        }
    }

    class Worm extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth/ 2
            this.height = this.spriteHeight / 2

            this.x = game.width
            this.y = game.height - this.height
            
            this.speed = Math.random() * 1 + 1
            
            this.image = worm;
            
        }
        update(deltaTime){
            super.update(deltaTime);
        }
    }

    class Spider extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth/ 2
            this.height = this.spriteHeight / 2

            this.x = Math.random() * game.width
            this.y = 0 - this.height
            this.speed = Math.random() * 1 + 1
            this.image = spider;
            this.vx = 0;
            this.vy = 1;

        }
        update (deltaTime) {
            super.update(deltaTime);
            this.y += this.vy;
            if(this.y > 200 ) this.vy *= -1

        }
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, 0);
            ctx.lineTo(this.x + this.width/2, this.y + 10 )
            ctx.stroke();
            super.draw(ctx)
        }
    }

    class Ghost extends Enemy {
        constructor(game) {
            super(game)
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.width = this.spriteWidth/ 2
            this.height = this.spriteHeight / 2

            this.x = game.width
            this.y = Math.random() * game.height * 0.6
            
            this.speed = Math.random() * 1 + 1
            
            this.image = ghost;
            this.angle = 0
        }
        update(ctx) {
            super.update(ctx);
            this.y += Math.sin(this.angle) * 1
            this.angle += 0.4
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = 0.9
            super.draw(ctx);
            ctx.restore();
        }
    }

    let timeStart = Date.now();
    let game = new Game(ctx, CAVANS_WIDTH, CANVAS_HEIGHT);
    const fps = 45
    function animate(){
        deltaTime = (Date.now() - timeStart);
        timeStart = Date.now();

        game.update(deltaTime);
        game.draw();

        setTimeout(() => {
            requestAnimationFrame(animate);
        }, Math.floor(1000 / fps - (deltaTime)));
        
    }

    // animate()

})