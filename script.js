const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function setCanvasSize() {
    canvas.width = Math.min(window.innerWidth, window.innerHeight) - 20;
    canvas.height = canvas.width;
}
setCanvasSize();
// set canvas size to min of window width and height
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function drawLine(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}
class Cell {
    constructor(x, y, color, mazeSize) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.current = false;
        this.startPoint = new Point(
            (x * canvas.width) / mazeSize,
            (y * canvas.height) / mazeSize
        );
        this.endPoint = new Point(
            ((x + 1) * canvas.width) / mazeSize,
            ((y + 1) * canvas.height) / mazeSize
        );
        this.upRight = new Point(this.endPoint.x, this.startPoint.y);
        this.downLeft = new Point(this.startPoint.x, this.endPoint.y);
        // borders: top, right, bottom, left
        this.borders = [true, true, true, true];
        this.color = color;
    }
    draw() {
        if (this.current) {
            ctx.fillStyle = "red";
            ctx.fillRect(
                this.startPoint.x,
                this.startPoint.y,
                canvas.width / mazeSize,
                canvas.height / mazeSize
            );
        } else if (this.color != "white") {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.startPoint.x,
                this.startPoint.y,
                canvas.width / mazeSize,
                canvas.height / mazeSize
            );
        } else if (this.visited) {
            ctx.fillStyle = "#FFF0B8";
            ctx.fillRect(
                this.startPoint.x,
                this.startPoint.y,
                canvas.width / mazeSize,
                canvas.height / mazeSize
            );
        }
        // draw borders
        ctx.fillStyle = "black";
        if (this.borders[0]) {
            drawLine(this.startPoint, this.upRight);
        }
        if (this.borders[1]) {
            drawLine(this.upRight, this.endPoint);
        }
        if (this.borders[2]) {
            drawLine(this.endPoint, this.downLeft);
        }
        if (this.borders[3]) {
            drawLine(this.downLeft, this.startPoint);
        }
    }
    connect(otherCell) {
        // if same or not adjacent, return
        if (
            Math.abs(this.x - otherCell.x) > 1 ||
            Math.abs(this.y - otherCell.y) > 1
        ) {
            return;
        }
        // if same row
        if (this.x == otherCell.x) {
            if (this.y < otherCell.y) {
                this.borders[2] = false;
                otherCell.borders[0] = false;
            } else {
                this.borders[0] = false;
                otherCell.borders[2] = false;
            }
            return;
        }
        // if same column
        if (this.y == otherCell.y) {
            if (this.x < otherCell.x) {
                this.borders[1] = false;
                otherCell.borders[3] = false;
            } else {
                this.borders[3] = false;
                otherCell.borders[1] = false;
            }
            return;
        }
    }
}

class CreatMaze {
    constructor(cells, mazeSize, animate = false) {
        this.cells = cells;
        this.mazeSize = mazeSize;
        this.animate = animate;
        this.stack = [];
        this.lastVisited = null;
        this.currentCell = cells[0][0];
        this.currentCell.visited = true;
        this.stack.push(this.currentCell);
        this.done = false;
    }
    step() {
        if (this.done) {
            return;
        }
        if (this.lastVisited != null) {
            this.lastVisited.current = false;
        }
        this.currentCell.current = true;
        this.lastVisited = this.currentCell;
        let neighbors = [];
        // up
        if (this.currentCell.y > 0) {
            let upCell = this.cells[this.currentCell.x][this.currentCell.y - 1];
            if (!upCell.visited) {
                neighbors.push(upCell);
            }
        }
        // right
        if (this.currentCell.x < this.mazeSize - 1) {
            let rightCell =
                this.cells[this.currentCell.x + 1][this.currentCell.y];
            if (!rightCell.visited) {
                neighbors.push(rightCell);
            }
        }
        // down
        if (this.currentCell.y < this.mazeSize - 1) {
            let downCell =
                this.cells[this.currentCell.x][this.currentCell.y + 1];
            if (!downCell.visited) {
                neighbors.push(downCell);
            }
        }
        // left
        if (this.currentCell.x > 0) {
            let leftCell =
                this.cells[this.currentCell.x - 1][this.currentCell.y];
            if (!leftCell.visited) {
                neighbors.push(leftCell);
            }
        }
        if (neighbors.length > 0) {
            let nextCell =
                neighbors[Math.floor(Math.random() * neighbors.length)];
            this.currentCell.connect(nextCell);
            nextCell.visited = true;
            this.stack.push(nextCell);
            this.currentCell = nextCell;
        } else if (this.stack.length > 0) {
            this.currentCell = this.stack.pop();
        } else {
            this.done = true;
        }
    }
    run() {
        return new Promise((resolve, reject) => {
            if (this.done) {
                resolve();
                return;
            }
            if (this.animate) {
                requestAnimationFrame(() => {
                    this.step();
                    drawCanvas(this.cells, this.mazeSize);
                    this.run().then(() => {
                        resolve();
                    });
                });
            } else {
                while (!this.done) {
                    this.step();
                }
                drawCanvas(this.cells, this.mazeSize);
                resolve();
            }
        });
    }
}

class SolveMaze {
    // reach cells[mazeSize-1][mazeSize-1] using BFS
    constructor(cells, mazeSize, currentCell = null, animate = false) {
        if (currentCell == null) currentCell = cells[0][0];
        this.cells = cells;
        this.mazeSize = mazeSize;
        this.animate = animate;
        this.queue = [];
        this.currentCell = currentCell;
        this.queue.push(this.currentCell);
        this.done = false;
        this.pathMapping = {};
    }
    step() {
        if (this.done) {
            return;
        }
        if (this.queue.length == 0) {
            this.done = true;
            return;
        }
        let currentCell = this.queue.shift();
        currentCell.visited = true;
        currentCell.color = "green";
        if (
            currentCell.x == this.mazeSize - 1 &&
            currentCell.y == this.mazeSize - 1
        ) {
            this.done = true;
            clearMaze(this.cells, this.mazeSize);
            let path = [];
            let current = currentCell;
            while (current != null) {
                path.push(current);
                current = this.pathMapping[current.x + "," + current.y];
            }
            for (let i = 0; i < path.length; i++) {
                let hue = (i / path.length) * 360;
                path[i].color = `hsl(${hue}, 100%, 50%)`;
            }
            drawCanvas(this.cells, this.mazeSize);
            return;
        }
        // up
        if (currentCell.y > 0) {
            let upCell = this.cells[currentCell.x][currentCell.y - 1];
            if (!upCell.visited && !upCell.borders[2]) {
                this.queue.push(upCell);
                this.pathMapping[upCell.x + "," + upCell.y] = currentCell;
            }
        }
        // right
        if (currentCell.x < this.mazeSize - 1) {
            let rightCell = this.cells[currentCell.x + 1][currentCell.y];
            if (!rightCell.visited && !rightCell.borders[3]) {
                this.queue.push(rightCell);
                this.pathMapping[rightCell.x + "," + rightCell.y] = currentCell;
            }
        }
        // down
        if (currentCell.y < this.mazeSize - 1) {
            let downCell = this.cells[currentCell.x][currentCell.y + 1];
            if (!downCell.visited && !downCell.borders[0]) {
                this.queue.push(downCell);
                this.pathMapping[downCell.x + "," + downCell.y] = currentCell;
            }
        }
        // left
        if (currentCell.x > 0) {
            let leftCell = this.cells[currentCell.x - 1][currentCell.y];
            if (!leftCell.visited && !leftCell.borders[1]) {
                this.queue.push(leftCell);
                this.pathMapping[leftCell.x + "," + leftCell.y] = currentCell;
            }
        }
    }
    run() {
        return new Promise((resolve, reject) => {
            if (this.done) {
                resolve();
                return;
            }
            if (this.animate) {
                requestAnimationFrame(() => {
                    this.step();
                    drawCanvas(this.cells, this.mazeSize);
                    this.run().then(() => {
                        resolve();
                    });
                });
            } else {
                while (!this.done) {
                    this.step();
                }
                drawCanvas(this.cells, this.mazeSize);
                resolve();
            }
        });
    }
}

function clearMaze(cells, mazeSize) {
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            cells[i][j].visited = false;
            cells[i][j].current = false;
            cells[i][j].color = "white";
        }
    }
}

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawCanvas(cells, mazeSize) {
    clearCanvas();
    ctx.fillStyle = "black";
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            cells[i][j].draw();
        }
    }
}
function newCells(mazeSize) {
    let cells = [];
    for (let i = 0; i < mazeSize; i++) {
        cells.push([]);
        for (let j = 0; j < mazeSize; j++) {
            cells[i].push(new Cell(i, j, "white", mazeSize));
        }
    }
    return cells;
}

const size = document.getElementById("mazeSize");
let mazeSize = size.value;

const animate = document.getElementById("tick");
let animating = animate.checked;

const newMazeButton = document.getElementById("new");
const showPathButton = document.getElementById("path");
const hidePathButton = document.getElementById("hide");
let cells = newCells(mazeSize);
let pathVisible = false;
let start = cells[0][0];
start.current = true;
start.visited = true;
drawCanvas(cells, mazeSize);
let end = cells[mazeSize - 1][mazeSize - 1];

hidePathButton.addEventListener("click", () => {
    hidePathButton.disabled = true;
    pathVisible = false;
    clearMaze(cells, mazeSize);
    start.current = true;
    drawCanvas(cells, mazeSize);
});
showPathButton.addEventListener("click", () => {
    hidePathButton.disabled = true;
    clearMaze(cells, mazeSize);
    drawCanvas(cells, mazeSize);
    size.disabled = true;
    animate.disabled = true;
    newMazeButton.disabled = true;
    showPathButton.disabled = true;
    let maze = new SolveMaze(cells, mazeSize, start, animating);
    maze.run().then(() => {
        hidePathButton.disabled = false;
        size.disabled = false;
        animate.disabled = false;
        newMazeButton.disabled = false;
        showPathButton.disabled = false;
    });
    pathVisible = true;
});

newMazeButton.addEventListener("click", () => {
    hidePathButton.disabled = true;
    pathVisible = true;
    size.disabled = true;
    animate.disabled = true;
    newMazeButton.disabled = true;
    showPathButton.disabled = true;
    cells = newCells(mazeSize);
    drawCanvas(cells, mazeSize);
    let maze = new CreatMaze(cells, mazeSize, animating);
    maze.run().then(() => {
        cells = maze.cells;
        hidePathButton.disabled = false;
        pathVisible = false;
        clearMaze(cells, mazeSize);
        start = cells[0][0];
        start.current = true;
        drawCanvas(cells, mazeSize);
        size.disabled = false;
        animate.disabled = false;
        newMazeButton.disabled = false;
        showPathButton.disabled = false;
    });
});

size.addEventListener("change", () => {
    mazeSize = size.value;
    showPathButton.disabled = true;
    cells = newCells(mazeSize);
    clearCanvas();
    clearMaze(cells, mazeSize);
    drawCanvas(cells, mazeSize);
});

animate.addEventListener("change", () => {
    animating = animate.checked;
});

function checkIfSolved(start, end) {
    if (start.x == end.x && start.y == end.y) {
        return true;
    }
    return false;
}

document.addEventListener("keydown", (e) => {
    if (pathVisible) return;
    start.current = true;
    if (e.key == "ArrowUp" || e.key == "w") {
        if (start.y > 0 && !cells[start.x][start.y].borders[0]) {
            start.current = false;
            start = cells[start.x][start.y - 1];
        }
    }
    if (e.key == "ArrowRight" || e.key == "d") {
        if (start.x < mazeSize - 1 && !cells[start.x][start.y].borders[1]) {
            start.current = false;
            start = cells[start.x + 1][start.y];
        }
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        if (start.y < mazeSize - 1 && !cells[start.x][start.y].borders[2]) {
            start.current = false;
            start = cells[start.x][start.y + 1];
        }
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        if (start.x > 0 && !cells[start.x][start.y].borders[3]) {
            start.current = false;
            start = cells[start.x - 1][start.y];
        }
    }
    start.current = true;
    drawCanvas(cells, mazeSize);
    if (checkIfSolved(start, end)) {
        alert("You solved the maze!");
    }
});
