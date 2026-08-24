/* =========================================================
   RPG GAME - COMPLETE CODEPEN VERSION
========================================================= */


/* =========================================================
   CANVAS
========================================================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* =========================================================
   GAME
========================================================= */

class Game {

    constructor() {

        /* =========================
           WORLD
        ========================= */

        this.worldWidth = 4000;

        this.worldHeight = 4000;


        /* =========================
           TIME
        ========================= */

        this.lastTime = 0;


        /* =========================
           INPUT
        ========================= */

        this.keys = {};


        /* =========================
           JOYSTICK
        ========================= */

        this.joystick = {

            active: false,

            x: 0,

            y: 0
        };


        /* =========================
           PLAYER
        ========================= */

        this.player =
            new Player(
                this.worldWidth / 2,
                this.worldHeight / 2
            );


        /* =========================
           MONSTERS
        ========================= */

        this.monsters = [];


        /* =========================
           CAMERA
        ========================= */

        this.camera =
            new Camera(
                window.innerWidth,
                window.innerHeight
            );


        /* =========================
           RESIZE
        ========================= */

        this.resize();

        window.addEventListener(
            "resize",
            () => {

                this.resize();

                this.camera.resize(
                    window.innerWidth,
                    window.innerHeight
                );
            }
        );


        /* =========================
           INPUT
        ========================= */

        this.setupKeyboard();

        this.setupJoystick();


        /* =========================
           CREATE MONSTERS
        ========================= */

        this.createMonsters();
    }


    /* =====================================================
       RESIZE
    ===================================================== */

    resize() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            window.innerWidth * dpr;

        canvas.height =
            window.innerHeight * dpr;


        canvas.style.width =
            window.innerWidth + "px";

        canvas.style.height =
            window.innerHeight + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =====================================================
       CREATE MONSTERS
    ===================================================== */

    createMonsters() {

        const p = this.player;


        this.monsters.push(

            new Monster(
                p.x + 500,
                p.y
            )
        );


        this.monsters.push(

            new Monster(
                p.x - 500,
                p.y
            )
        );


        this.monsters.push(

            new Monster(
                p.x,
                p.y + 500
            )
        );


        this.monsters.push(

            new Monster(
                p.x,
                p.y - 500
            )
        );
    }


    /* =====================================================
       KEYBOARD
    ===================================================== */

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

                const key =
                    event.key.toLowerCase();

                this.keys[key] = true;


                if (
                    [
                        "w",
                        "a",
                        "s",
                        "d",
                        "arrowup",
                        "arrowdown",
                        "arrowleft",
                        "arrowright"
                    ].includes(key)
                ) {

                    event.preventDefault();
                }
            }
        );


        window.addEventListener(
            "keyup",
            (event) => {

                const key =
                    event.key.toLowerCase();

                this.keys[key] = false;
            }
        );
    }


    /* =====================================================
       JOYSTICK
    ===================================================== */

    setupJoystick() {

        const joystick =
            document.getElementById(
                "joystick"
            );


        const knob =
            document.getElementById(
                "joystickKnob"
            );


        let startX = 0;

        let startY = 0;


        const maxDistance = 32;


        const reset = () => {

            this.joystick.active =
                false;

            this.joystick.x = 0;

            this.joystick.y = 0;


            knob.style.transform =
                "translate(0px,0px)";
        };


        joystick.addEventListener(
            "pointerdown",
            (event) => {

                event.preventDefault();


                this.joystick.active =
                    true;


                startX =
                    event.clientX;

                startY =
                    event.clientY;


                joystick.setPointerCapture(
                    event.pointerId
                );
            }
        );


        joystick.addEventListener(
            "pointermove",
            (event) => {

                if (
                    !this.joystick.active
                ) {

                    return;
                }


                let dx =
                    event.clientX -
                    startX;

                let dy =
                    event.clientY -
                    startY;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance >
                    maxDistance
                ) {

                    dx =
                        dx /
                        distance *
                        maxDistance;

                    dy =
                        dy /
                        distance *
                        maxDistance;
                }


                this.joystick.x =
                    dx /
                    maxDistance;

                this.joystick.y =
                    dy /
                    maxDistance;


                knob.style.transform =
                    `translate(${dx}px,${dy}px)`;
            }
        );


        joystick.addEventListener(
            "pointerup",
            reset
        );


        joystick.addEventListener(
            "pointercancel",
            reset
        );


        joystick.addEventListener(
            "lostpointercapture",
            reset
        );
    }


    /* =====================================================
       UPDATE
    ===================================================== */

    update(deltaTime) {

        let dx = 0;

        let dy = 0;


        /* =========================
           KEYBOARD MOVEMENT
        ========================= */

        if (
            this.keys["w"] ||
            this.keys["arrowup"]
        ) {

            dy -= 1;
        }


        if (
            this.keys["s"] ||
            this.keys["arrowdown"]
        ) {

            dy += 1;
        }


        if (
            this.keys["a"] ||
            this.keys["arrowleft"]
        ) {

            dx -= 1;
        }


        if (
            this.keys["d"] ||
            this.keys["arrowright"]
        ) {

            dx += 1;
        }


        /* =========================
           JOYSTICK
        ========================= */

        if (
            this.joystick.active
        ) {

            dx =
                this.joystick.x;

            dy =
                this.joystick.y;
        }


        /* =========================
           PLAYER
        ========================= */

        this.player.directionX =
            dx;

        this.player.directionY =
            dy;


        this.player.update(
            deltaTime,
            this.worldWidth,
            this.worldHeight
        );


        /* =========================
           MONSTERS
        ========================= */

        for (
            const monster of this.monsters
        ) {

            monster.update(
                deltaTime,
                this.player
            );
        }


        /* =========================
           CAMERA
        ========================= */

        this.camera.follow(
            this.player,
            this.worldWidth,
            this.worldHeight
        );


        /* =========================
           HUD
        ========================= */

        document.getElementById(
            "playerLevel"
        ).textContent =
            `LV ${this.player.level}`;


        document.getElementById(
            "xpText"
        ).textContent =
            `XP ${this.player.xp} / ${this.player.xpRequired}`;
    }


    /* =====================================================
       DRAW
    ===================================================== */

    draw() {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* =========================
           WORLD
        ========================= */

        this.drawWorld();


        /* =========================
           MONSTERS
        ========================= */

        for (
            const monster of this.monsters
        ) {

            monster.draw(
                ctx,
                this.camera
            );
        }


        /* =========================
           PLAYER
        ========================= */

        this.player.draw(
            ctx,
            this.camera
        );
    }


    /* =====================================================
       WORLD
    ===================================================== */

    drawWorld() {

        const tileSize = 100;


        /* =========================
           BACKGROUND
        ========================= */

        ctx.fillStyle =
            "#294629";

        ctx.fillRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        /* =========================
           VISIBLE AREA
        ========================= */

        const startX =
            Math.floor(
                this.camera.x /
                tileSize
            ) *
            tileSize;


        const startY =
            Math.floor(
                this.camera.y /
                tileSize
            ) *
            tileSize;


        const endX =
            this.camera.x +
            window.innerWidth +
            tileSize;


        const endY =
            this.camera.y +
            window.innerHeight +
            tileSize;


        /* =========================
           GRID
        ========================= */

        ctx.lineWidth = 1;


        for (
            let x = startX;
            x < endX;
            x += tileSize
        ) {

            for (
                let y = startY;
                y < endY;
                y += tileSize
            ) {

                const screenX =
                    x -
                    this.camera.x;


                const screenY =
                    y -
                    this.camera.y;


                ctx.strokeStyle =
                    "rgba(255,255,255,0.035)";


                ctx.strokeRect(
                    screenX,
                    screenY,
                    tileSize,
                    tileSize
                );
            }
        }


        /* =========================
           WORLD BORDER
        ========================= */

        ctx.strokeStyle =
            "rgba(255,255,255,0.25)";

        ctx.lineWidth = 4;


        ctx.strokeRect(
            -this.camera.x,
            -this.camera.y,
            this.worldWidth,
            this.worldHeight
        );
    }


    /* =====================================================
       GAME LOOP
    ===================================================== */

    loop(currentTime) {

        let deltaTime =
            (
                currentTime -
                this.lastTime
            ) / 1000;


        this.lastTime =
            currentTime;


        deltaTime =
            Math.min(
                deltaTime,
                0.05
            );


        this.update(
            deltaTime
        );


        this.draw();


        requestAnimationFrame(
            (time) =>
                this.loop(time)
        );
    }


    /* =====================================================
       START
    ===================================================== */

    start() {

        this.lastTime =
            performance.now();


        requestAnimationFrame(
            (time) =>
                this.loop(time)
        );
    }
}


/* =========================================================
   PLAYER
========================================================= */

class Player {

    constructor(x, y) {

        this.x = x;

        this.y = y;


        this.width = 42;

        this.height = 60;


        this.speed = 260;


        this.directionX = 0;

        this.directionY = 0;


        /* =========================
           HEALTH
        ========================= */

        this.maxHealth = 500;

        this.health = 500;


        /* =========================
           LEVEL
        ========================= */

        this.level = 1;

        this.xp = 0;

        this.xpRequired = 100;


        /* =========================
           STATS
        ========================= */

        this.attack = 50;

        this.defense = 10;
    }


    /* =========================
       UPDATE
    ========================= */

    update(
        deltaTime,
        worldWidth,
        worldHeight
    ) {

        let dx =
            this.directionX;

        let dy =
            this.directionY;


        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            length > 1
        ) {

            dx /= length;

            dy /= length;
        }


        this.x +=
            dx *
            this.speed *
            deltaTime;


        this.y +=
            dy *
            this.speed *
            deltaTime;


        /* =========================
           WORLD BOUNDARY
        ========================= */

        const halfWidth =
            this.width / 2;


        const halfHeight =
            this.height / 2;


        this.x =
            Math.max(
                halfWidth,
                Math.min(
                    worldWidth -
                    halfWidth,
                    this.x
                )
            );


        this.y =
            Math.max(
                halfHeight,
                Math.min(
                    worldHeight -
                    halfHeight,
                    this.y
                )
            );
    }


    /* =========================
       DAMAGE
    ========================= */

    takeDamage(amount) {

        const damage =
            Math.max(
                1,
                amount -
                this.defense
            );


        this.health -=
            damage;


        if (
            this.health < 0
        ) {

            this.health = 0;
        }


        return damage;
    }


    /* =========================
       XP
    ========================= */

    addXP(amount) {

        this.xp += amount;


        while (
            this.xp >=
            this.xpRequired
        ) {

            this.xp -=
                this.xpRequired;


            this.levelUp();
        }
    }


    /* =========================
       LEVEL UP
    ========================= */

    levelUp() {

        this.level++;


        this.xpRequired =
            Math.floor(
                this.xpRequired *
                1.35
            );


        this.maxHealth +=
            50;


        this.health =
            this.maxHealth;


        this.attack +=
            10;


        this.defense +=
            3;
    }


    /* =========================
       DRAW
    ========================= */

    draw(ctx, camera) {

        const screenX =
            this.x -
            camera.x;


        const screenY =
            this.y -
            camera.y;


        /* =========================
           SHADOW
        ========================= */

        ctx.beginPath();


        ctx.ellipse(
            screenX,
            screenY + 25,
            22,
            8,
            0,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(0,0,0,0.35)";


        ctx.fill();


        /* =========================
           BODY
        ========================= */

        ctx.fillStyle =
            "#3d6cff";


        ctx.fillRect(
            screenX - 17,
            screenY - 5,
            34,
            35
        );


        /* =========================
           HEAD
        ========================= */

        ctx.beginPath();


        ctx.arc(
            screenX,
            screenY - 20,
            17,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#f0bd91";


        ctx.fill();


        /* =========================
           HAIR
        ========================= */

        ctx.beginPath();


        ctx.arc(
            screenX,
            screenY - 25,
            17,
            Math.PI,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#191919";


        ctx.fill();


        /* =========================
           HEALTH BAR
        ========================= */

        this.drawHealthBar(
            ctx,
            screenX,
            screenY - 52,
            80,
            8
        );


        /* =========================
           HP NUMBER
        ========================= */

        ctx.font =
            "bold 12px Arial";


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            `${Math.ceil(this.health)} / ${this.maxHealth}`,
            screenX,
            screenY - 61
        );
    }


    /* =========================
       HEALTH BAR
    ========================= */

    drawHealthBar(
        ctx,
        x,
        y,
        width,
        height
    ) {

        const percentage =
            Math.max(
                0,
                Math.min(
                    1,
                    this.health /
                    this.maxHealth
                )
            );


        /* Background */

        ctx.fillStyle =
            "rgba(0,0,0,0.8)";


        ctx.fillRect(
            x - width / 2,
            y,
            width,
            height
        );


        /* HP */

        ctx.fillStyle =
            "#32d74b";


        ctx.fillRect(
            x - width / 2,
            y,
            width *
            percentage,
            height
        );


        /* Border */

        ctx.strokeStyle =
            "rgba(255,255,255,0.8)";


        ctx.lineWidth = 1;


        ctx.strokeRect(
            x - width / 2,
            y,
            width,
            height
        );
    }
}


/* =========================================================
   MONSTER
========================================================= */

class Monster {

    constructor(x, y) {

        this.x = x;

        this.y = y;


        this.width = 45;

        this.height = 45;


        this.speed = 70;


        this.stopDistance = 80;


        /* =========================
           HEALTH
        ========================= */

        this.maxHealth = 250;

        this.health = 250;


        /* =========================
           COMBAT
        ========================= */

        this.attackDamage = 25;

        this.attackCooldown = 1.2;

        this.attackTimer = 0;


        /* =========================
           STATE
        ========================= */

        this.alive = true;


        this.xpReward = 25;
    }


    /* =========================
       UPDATE
    ========================= */

    update(
        deltaTime,
        player
    ) {

        if (
            !this.alive
        ) {

            return;
        }


        const dx =
            player.x -
            this.x;


        const dy =
            player.y -
            this.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /* =========================
           MOVE
        ========================= */

        if (
            distance >
            this.stopDistance
        ) {

            if (
                distance > 0
            ) {

                this.x +=
                    (
                        dx /
                        distance
                    ) *
                    this.speed *
                    deltaTime;


                this.y +=
                    (
                        dy /
                        distance
                    ) *
                    this.speed *
                    deltaTime;
            }
        }


        /* =========================
           ATTACK TIMER
        ========================= */

        if (
            this.attackTimer > 0
        ) {

            this.attackTimer -=
                deltaTime;
        }


        /* =========================
           ATTACK
        ========================= */

        if (
            distance <=
            this.stopDistance
        ) {

            if (
                this.attackTimer <= 0
            ) {

                this.attackPlayer(
                    player
                );


                this.attackTimer =
                    this.attackCooldown;
            }
        }
    }


    /* =========================
       ATTACK PLAYER
    ========================= */

    attackPlayer(player) {

        if (
            !player ||
            player.health <= 0
        ) {

            return;
        }


        player.takeDamage(
            this.attackDamage
        );
    }


    /* =========================
       DAMAGE
    ========================= */

    takeDamage(amount) {

        if (
            !this.alive
        ) {

            return false;
        }


        this.health -=
            amount;


        if (
            this.health <= 0
        ) {

            this.health = 0;

            this.alive = false;

            return true;
        }


        return false;
    }


    /* =========================
       DRAW
    ========================= */

    draw(ctx, camera) {

        if (
            !this.alive
        ) {

            return;
        }


        const screenX =
            this.x -
            camera.x;


        const screenY =
            this.y -
            camera.y;


        /* =========================
           SHADOW
        ========================= */

        ctx.beginPath();


        ctx.ellipse(
            screenX,
            screenY + 20,
            23,
            8,
            0,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(0,0,0,0.4)";


        ctx.fill();


        /* =========================
           BODY
        ========================= */

        ctx.beginPath();


        ctx.arc(
            screenX,
            screenY,
            22,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#7c3aed";


        ctx.fill();


        /* =========================
           EYES
        ========================= */

        ctx.fillStyle =
            "#ff4444";


        ctx.beginPath();


        ctx.arc(
            screenX - 8,
            screenY - 4,
            4,
            0,
            Math.PI * 2
        );


        ctx.arc(
            screenX + 8,
            screenY - 4,
            4,
            0,
            Math.PI * 2
        );


        ctx.fill();


        /* =========================
           HEALTH BAR
        ========================= */

        this.drawHealthBar(
            ctx,
            screenX,
            screenY - 38,
            70,
            7
        );


        /* =========================
           HP NUMBER
        ========================= */

        ctx.font =
            "bold 11px Arial";


        ctx.textAlign =
            "center";


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            `${Math.ceil(this.health)} / ${this.maxHealth}`,
            screenX,
            screenY - 45
        );
    }


    /* =========================
       HEALTH BAR
    ========================= */

    drawHealthBar(
        ctx,
        x,
        y,
        width,
        height
    ) {

        const percentage =
            Math.max(
                0,
                Math.min(
                    1,
                    this.health /
                    this.maxHealth
                )
            );


        /* Background */

        ctx.fillStyle =
            "rgba(0,0,0,0.8)";


        ctx.fillRect(
            x - width / 2,
            y,
            width,
            height
        );


        /* Health */

        ctx.fillStyle =
            "#ff3b30";


        ctx.fillRect(
            x - width / 2,
            y,
            width *
            percentage,
            height
        );


        /* Border */

        ctx.strokeStyle =
            "rgba(255,255,255,0.8)";


        ctx.lineWidth = 1;


        ctx.strokeRect(
            x - width / 2,
            y,
            width,
            height
        );
    }
}


/* =========================================================
   CAMERA
========================================================= */

class Camera {

    constructor(
        width,
        height
    ) {

        this.x = 0;

        this.y = 0;

        this.width =
            width;

        this.height =
            height;
    }


    /* =========================
       RESIZE
    ========================= */

    resize(
        width,
        height
    ) {

        this.width =
            width;

        this.height =
            height;
    }


    /* =========================
       FOLLOW PLAYER
    ========================= */

    follow(
        target,
        worldWidth,
        worldHeight
    ) {

        this.x =
            target.x -
            this.width / 2;


        this.y =
            target.y -
            this.height / 2;


        /* =========================
           WORLD LIMIT
        ========================= */

        this.x =
            Math.max(
                0,
                Math.min(
                    worldWidth -
                    this.width,
                    this.x
                )
            );


        this.y =
            Math.max(
                0,
                Math.min(
                    worldHeight -
                    this.height,
                    this.y
                )
            );
    }
}


/* =========================================================
   START GAME
========================================================= */

const game =
    new Game();

game.start();
