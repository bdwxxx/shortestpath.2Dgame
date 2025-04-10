// Possible movements: right, down, left, up
const DIRECTIONS = Object.freeze([[0, 1], [1, 0], [0, -1], [-1, 0]]);

/**
 * Finds the shortest path from start to end on a 2D grid
 * @param {number[][]} grid - 2D array where 0 is passable and 1 is a wall
 * @param {number[]} start - Starting coordinates [x, y]
 * @param {number[]} end - Ending coordinates [x, y]
 * @return {Object|null} - Path and steps if found, null otherwise
 */
function findShortestPath(grid, start, end) {
    // Validate input data
    if (!grid || !grid.length || !grid.at(0).length) return null;
    
    const rows = grid.length;
    const cols = grid.at(0).length;
    
    const [startX, startY] = start;
    const [endX, endY] = end;
    
    // Check if start and end positions are valid
    if (!isValidPosition(startX, startY, rows, cols, grid) || 
        !isValidPosition(endX, endY, rows, cols, grid)) {
        return null;
    }
    
    // Queue for BFS - stores positions to visit
    const queue = [[startX, startY]];
    
    // Track visited cells to avoid cycles
    const visited = new Set([`${startX},${startY}`]);
    
    // Store predecessors to reconstruct path
    const predecessors = new Map();
    
    // BFS
    while (queue.length > 0) {
        const [x, y] = queue.shift();
        
        // If we've reached the end, reconstruct and return the path
        if (x === endX && y === endY) {
            return reconstructPath(predecessors, start, end);
        }
        
        // Check all four directions
        for (const [dx, dy] of DIRECTIONS) {
            const newX = x + dx;
            const newY = y + dy;
            const key = `${newX},${newY}`;
            
            // Check if new position is valid and not visited
            if (isValidPosition(newX, newY, rows, cols, grid) && !visited.has(key)) {
                visited.add(key);
                predecessors.set(key, [x, y]);
                queue.push([newX, newY]);
            }
        }
    }
    
    // No path found
    return null;
}

/**
 * Checks if a position is valid and passable in the grid
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} rows - Number of rows in the grid
 * @param {number} cols - Number of columns in the grid
 * @param {number[][]} grid - The grid
 * @return {boolean} - True if position is valid and passable
 */
function isValidPosition(x, y, rows, cols, grid) {
    return x >= 0 && x < rows && y >= 0 && y < cols && grid.at(x).at(y) === 0;
}

/**
 * Reconstructs the path from start to end using predecessors
 * @param {Map} predecessors - Map of cell predecessors
 * @param {number[]} start - Starting coordinates [x, y]
 * @param {number[]} end - Ending coordinates [x, y]
 * @return {Object} - Object containing path and number of steps
 */
function reconstructPath(predecessors, start, end) {
    const path = [end];
    let current = `${end.at(0)},${end.at(1)}`;
    const startKey = `${start.at(0)},${start.at(1)}`;
    
    // Reconstruct path backwards from end to start
    while (current !== startKey) {
        const predecessor = predecessors.get(current);
        path.unshift(predecessor);
        current = `${predecessor[0]},${predecessor[1]}`;
    }
    
    return {
        path: path,
        steps: path.length - 1
    };
}

// Example usage
const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0]
];
const start = [0, 0];
const end = [4, 4];

const result = findShortestPath(grid, start, end);
console.log(result);
