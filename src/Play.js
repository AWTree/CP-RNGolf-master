class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height  - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true) 
        this.ball.body.setBounce(0.5) 
        this.ball.body.setDamping(true).setDrag(0.5) 

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)

        const obstacleSpeed = 100;
        wallA.body.setVelocityX(obstacleSpeed);
        wallA.setCollideWorldBounds(true);
        wallA.setBounce(1);

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionX = pointer.x - this.ball.x;
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(shotDirectionX*5)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY);
            // this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            // this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
            
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.ball.setPosition(width / 2, height - height / 10);
            this.shotCounter++;
            this.successfulShots++;
            this.totalShots++;
            updateUI();
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)


        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        // display shot counter, score, and successful shot percentage
        this.shotCounter = 0;
        this.successfulShots = 0;
        this.totalShots = 0;

        // Create and display text for shot counter, score, and percentage
        this.shotText = this.add.text(10, 10, `Shots: ${this.shotCounter}`, { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(10, 40, `Successful Shots: ${this.successfulShots}`, { fontSize: '20px', fill: '#fff' });
        this.percentageText = this.add.text(10, 70, `Success Percentage: 0%`, { fontSize: '20px', fill: '#fff' });

        // Update UI functions
        const updateUI = () => {
            this.shotText.setText(`Shots: ${this.shotCounter}`);
            this.scoreText.setText(`Successful Shots: ${this.successfulShots}`);
            const percentage = (this.successfulShots / this.totalShots * 100).toFixed(2);
            this.percentageText.setText(`Success Percentage: ${percentage}%`);
        };
    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[✔] Add ball reset logic on successful shot
[✔] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[✔] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/

/* 
Hi, Professor Nathan. I left the class early because my laptop battery was dead. 
So I have to finish the project after class by watching the recorded lecture video.
*/