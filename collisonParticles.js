var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    i,
    j,
    k,
    colorArray = ["#4d60ea", "#e38686", "#5daf9f", "#b9c940", "#dd5252", "#59d38c", "#cf42d4"],
    mouse = {
        x: 1,
        y: 1
    },
    cirlesArray = [];
function generateRandomRange(firstNum, lastNum) {
    return (Math.random() * firstNum) + lastNum;
}
canvas.onmousemove = function (e) {
    mouse = {
        x:e.x,
        y:e.y
    }
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// end gist

function generateRandomColor() {
    return colorArray[Math.floor(Math.random() * colorArray.length)];
}
function getDistance(x1, x2, y1, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}
/* resize */

canvas.width = innerWidth;
canvas.height = innerHeight;
function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
window.onresize = function () {
    resize();
};

/* end resize */

/* classes */

/* circle */

class Circle {
    constructor(x, y, r, color, velocity) {
        this.mass = 1;
        this.x = x;
        this.y = y;
        this.r = r;
        this.velocity = velocity;
        this.color = generateRandomColor();
    }
    draw() {
        c.beginPath();
        c.save();
        c.arc(this.x, this.y, this.r, Math.PI * 2, false);
        c.globalAlpha = 0.01;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }
    update() {
        for (j = 0; j < cirlesArray.length; j++) {
            if (this === cirlesArray[j]) continue;
            if (Math.hypot(this.x - cirlesArray[j].x, this.y - cirlesArray[j].y) - this.r * 2 < 0) {
                resolveCollision(this, cirlesArray[j])
            }
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x + this.r > canvas.width || this.x - this.r < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.r > canvas.height || this.y - this.r < 0) {
            this.velocity.y = -this.velocity.y;
        };
        if (Math.abs(mouse.x - this.x) < 50 && Math.abs(mouse.y - this.y) < 50) {
            this.alpha += 0.1;
        }
        if( 
            Math.abs(mouse.x - this.x) > 50 &&
            Math.abs(mouse.y - this.y) > 50
            ||
            mouse.x === undefined
            ) {
            this.alpha -= 0.1
        }
        this.draw();
    }
}
for (i = 0; i < 100; i++) {
    let r = 10,
        x = Math.random() * (canvas.width - r * 2) + r,
        y = Math.random() * (canvas.height - r * 2) + r,
        velocity = {
            x : generateRandomRange(1,-0.5),
            y : generateRandomRange(1,-0.5)
        },
        color = "#fff";
        if (i !== 0) {
        for (j = 0; j < cirlesArray.length; j++) {
            if (Math.hypot(x - cirlesArray[j].x, y - cirlesArray[j].y) - r * 2 <= 0) {
                x = Math.random() * (canvas.width - r * 2) + r;
                y = Math.random() * (canvas.height - r * 2) + r;
                j = -1;
            }
        }
    }
     cirlesArray.push(new Circle(x,y,r,color,velocity));
}
/* end circle */
/*  end classes */

var animationId;
let circle2 = new Circle(innerWidth/2,innerHeight/2,50,"#2f34a7");
function animate() {
    // animation loop
    
    animationId  = requestAnimationFrame(animate);
    
    // clearing canvas 
    
    c.fillStyle = "rgba(0, 0, 0, 0.33)";
    c.fillRect(0, 0, innerWidth, innerHeight);
    
    // drawing projectiels
    
    // drawing circles
    for (i = 0; i < cirlesArray.length; i++) {
    cirlesArray[i].update();
}
    
}
animate();