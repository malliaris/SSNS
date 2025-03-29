class Atom {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
/*
    updatePosition(timeStep, boxWidth, boxHeight, mode) {
        let newX = this.x + this.vx * timeStep;
        let newY = this.y + this.vy * timeStep;

        // Handling X position
        if (newX < -boxWidth / 2) {
            this.x = -boxWidth / 2 - (newX + boxWidth / 2); // Reflect from the left boundary
            this.vx *= -1; // Reverse velocity
        } else if (newX > boxWidth / 2) {
            this.x = boxWidth / 2 - (newX - boxWidth / 2); // Reflect from the right boundary
            this.vx *= -1; // Reverse velocity
        } else {
            this.x = newX;
        }

        // Handling Y position
        if (newY < -boxHeight / 2) {
            this.y = -boxHeight / 2 - (newY + boxHeight / 2); // Reflect from the top boundary
            this.vy *= -1; // Reverse velocity
        } else if (newY > boxHeight / 2) {
            this.y = boxHeight / 2 - (newY - boxHeight / 2); // Reflect from the bottom boundary
            this.vy *= -1; // Reverse velocity
        } else {
            this.y = newY;
        }
    }*/
    if (mode) {
            // Wrap mode
            if (newX < -boxWidth / 2) {
                this.x = newX + boxWidth;
            } else if (newX > boxWidth / 2) {
                this.x = newX - boxWidth;
            } else {
                this.x = newX;
            }

            if (newY < -boxHeight / 2) {
                this.y = newY + boxHeight;
            } else if (newY > boxHeight / 2) {
                this.y = newY - boxHeight;
            } else {
                this.y = newY;
            }
        } else {
            // Bounce mode
            if (newX < -boxWidth / 2 || newX > boxWidth / 2) {
                this.vx *= -1;
            }
            if (newY < -boxHeight / 2 || newY > boxHeight / 2) {
                this.vy *= -1;
            }
            this.x = newX;
            this.y = newY;
        }
}

// User input for boundary, number of particles, and velocity magnitude
document.getElementById('startSimulation').addEventListener('click', function() {
    const userBoxWidth = parseFloat(document.getElementById('boxWidth').value);
    const userBoxHeight = parseFloat(document.getElementById('boxHeight').value);
    //const startX = 0;
    //const startY = 0;
    const userVelocity = parseFloat(document.getElementById('velocityMagnitude').value);
    const numParticles = parseInt(document.getElementById('numParticles').value);
    const maxSteps = parseInt(document.getElementById('maxSteps').value);
    const mode = parseInt(document.getElementById('mode').value);

//const userBoxWidth = parseFloat(prompt("Enter the width of the box:"));
//const userBoxHeight = parseFloat(prompt("Enter the height of the box:"));
//const userVelocity = parseFloat(prompt("Enter the velocity magnitude of the particles:")) / 10;		// replace with temp request add temp to vmag conversion
//const numParticles = parseInt(prompt("Enter the number of particles:"));
//const maxSteps = parseInt(prompt("Enter the number of time steps before stopping:"));

// Initialize with random starting positions
function getRandomPosition() {
    return Math.random() * (userBoxWidth / 2) * 2 - (userBoxWidth / 2); // random between -width/2 and +width/2
}

// Generate random angle (in radians) between 0 and 2 * PI (360)
function getRandomAngle() {
    return Math.random() * Math.PI * 2; // Random angle between 0 and 2π (360 degrees)
}

const particles = [];

for (let i = 0; i < numParticles; i++) {
    const angle = getRandomAngle();  // Random direction (angle)

    // Calculate the x and y components of the velocity based on the random angle
    const vx = userVelocity * Math.cos(angle); // X velocity component
    const vy = userVelocity * Math.sin(angle); // Y velocity component

    const atom = new Atom(
        getRandomPosition(),
        getRandomPosition(),
        vx,  // Random X velocity component
        vy   // Random Y velocity component
    );
    particles.push(atom);
}

// Canvas setup
document.body.innerHTML = '<canvas id="simulationCanvas"></canvas>';
//const canvas = document.getElementById("simulationCanvas");

const canvas = document.createElement('canvas');
canvas.id = "simulationCanvas";
    
//const ctx = canvas.getContext("2d");
canvas.width = userBoxWidth * 100;
canvas.height = userBoxHeight * 100;
canvas.style.border = "2px solid black";

// get simulation button object for position top and height
    const button = document.getElementById('startSimulation');
    const buttonTop = button.getBoundingClientRect().top;
    const buttonHeight = button.offsetHeight

    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.style.position = "absolute";
    canvasContainer.style.top = `${buttonTop + buttonHeight}px`;
    canvasContainer.innerHTML = '';
    canvasContainer.style.width = `${canvas.width * 1.5}px`;
    canvasContainer.style.height = `${canvas.height * 1.5}px`;
    canvasContainer.appendChild(canvas);
    
const ctx = canvas.getContext("2d");
    
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each atom
    for (let i = 0; i < particles.length; i++) {
        let drawX = (canvas.width / 2) + particles[i].x * 100;
        let drawY = (canvas.height / 2) - particles[i].y * 100;
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }
}

let stepCount = 0;
const timeStep = 0.50;

const interval = setInterval(() => {
    if (stepCount >= maxSteps) {
        clearInterval(interval);
        console.log("Simulation stopped after " + maxSteps + " time steps.");
        return;
    }

    // Update positions and draw each atom
    for (let i = 0; i < particles.length; i++) {
        particles[i].updatePosition(timeStep, userBoxWidth, userBoxHeight);
    }

    draw(); // Redraw all atoms
    stepCount++;
}, 100); // 100 == 1/10 of a second
