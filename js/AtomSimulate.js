class Atom {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    updatePosition(timeStep, boxWidth, boxHeight, mode) {
        let newX = this.x + this.vx * timeStep;
        let newY = this.y + this.vy * timeStep;

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
}

// User input for boundary and initial conditions
const userBoxWidth = parseFloat(prompt("Enter the width of the box:"));
const userBoxHeight = parseFloat(prompt("Enter the height of the box:"));
const startX = 0;
const startY = 0;
const startVx = parseFloat(prompt("Enter initial X velocity:")) / 10;
const startVy = parseFloat(prompt("Enter initial Y velocity:")) / 10;
const maxSteps = parseInt(prompt("Enter the number of time steps before stopping:"));
const mode = parseInt(prompt("Mode (0-bounce / 1-wrap):"));

let atom = new Atom(startX, startY, startVx, startVy);
const timeStep = 0.50;
let stepCount = 0;

// Create a canvas for visualization
document.body.innerHTML = '<canvas id="simulationCanvas"></canvas>';
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
canvas.width = userBoxWidth * 100;
canvas.height = userBoxHeight * 100;
canvas.style.border = "1px solid black";

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Transform coordinates to fit canvas where (0,0) is at center and scale by 100
    let drawX = (canvas.width / 2) + atom.x * 100;
    let drawY = (canvas.height / 2) - atom.y * 100;

    // Draw atom
    ctx.beginPath();
    ctx.arc(drawX, drawY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

const interval = setInterval(() => {
    if (stepCount >= maxSteps) {
        clearInterval(interval);
        console.log("Simulation stopped after " + maxSteps + " time steps.");
        return;
    }
    atom.updatePosition(timeStep, userBoxWidth, userBoxHeight, mode);
    draw();
    console.log(`Atom Position: (${atom.x.toFixed(2)}, ${atom.y.toFixed(2)})`);
    stepCount++;
}, 100);
