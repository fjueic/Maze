# [Maze Solver](https://fjueic.github.io/Maze/) Project Report

## Introduction
The Maze Solver project is a web application that generates and solves mazes using a combination of maze generation algorithms and maze-solving algorithms. The project is implemented in JavaScript and utilizes the HTML5 Canvas element for visualization. The primary goal is to create a maze, visualize the process, and then solve it using a pathfinding algorithm.

## Technologies Used
- **JavaScript:** The core programming language used for the project.
- **HTML5 Canvas:** Used for rendering the maze and providing a visual representation of the maze-solving process.
- **Promises and Animation Frame:** Utilized for asynchronous execution and smooth animation during maze generation and solving.

## Code Structure Overview
The project consists of several key components:

1. **Maze Generation:**
   - The maze generation is achieved using a randomized depth-first search algorithm.
   - The `CreatMaze` class represents the maze generation process, including the animation if specified.

2. **Maze Solving:**
   - The maze-solving algorithm uses Breadth-First Search (BFS) to find the shortest path from the start to the end of the maze.
   - The `SolveMaze` class handles the maze-solving process, also supporting animation.

3. **Maze Cell and Point Classes:**
   - The `Cell` class represents a cell in the maze, with properties such as position, visited status, and borders.
   - The `Point` class represents a point in the 2D coordinate system.

4. **Utility Functions:**
   - Various utility functions are included, such as `drawLine`, `clearMaze`, and `clearCanvas`, used for rendering and resetting the maze.

5. **Event Listeners:**
   - Event listeners are implemented to handle user interactions, such as starting a new maze, showing/hiding the solution path, and manual maze solving using arrow keys.

## Usage
The web application provides the following functionalities:

- **New Maze Generation:**
  - Clicking the "New Maze" button generates a new maze using the randomized depth-first search algorithm.

- **Show Solution Path:**
  - Clicking the "Show Path" button solves the generated maze using BFS and visualizes the solution path.

- **Hide Solution Path:**
  - Clicking the "Hide Path" button hides the solution path and restores the maze to its original state.

- **Manual Maze Solving:**
  - Arrow keys (up, down, left, right) can be used to manually navigate through the maze.

- **Maze Size and Animation Toggle:**
  - Users can customize the maze size and choose whether to animate the maze generation and solving processes.

## Conclusion
The Maze Solver project demonstrates the generation and solution of mazes through a web-based interface. It combines maze generation algorithms with pathfinding algorithms to create an interactive and visually appealing experience. The project can be further expanded by incorporating additional maze generation and solving algorithms, improving the user interface, and adding more customization options for users.
