const empty = Symbol('empty');
const mine = Symbol('mine');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function countAdjacentMines(rowIndex, colIndex, grid) {
  let mineCount = 0;
  [rowIndex - 1, rowIndex, rowIndex + 1].forEach((row) => {
    [colIndex - 1, colIndex, colIndex + 1].forEach((col) => {
      if (row === rowIndex && col === colIndex) {
        return;
      }
      if (!grid[row] || !grid[row][col]) {
        return;
      }
      const space = grid[row][col];
      if (space.content === mine) {
        mineCount += 1;
      }
    });
  });
  return mineCount;
}

class Space {
  constructor(content, visible) {
    this.content = content;
    this.visible = visible;
  }

  toPlayerView(adjacentMineCount) {
    if (this.visible) {
      if (this.content === mine) {
        return '*';
      }
      return String(adjacentMineCount);
    }
    return ' ';
  }
}

function emptyGrid(m, n) {
  const grid = [];
  for (let r = 0; r < m; r += 1) {
    const row = [];
    for (let c = 0; c < n; c += 1) {
      row.push(new Space(empty, false));
    }
    grid.push(row);
  }
  return grid;
}


class Board {
  constructor(m, n, mineCount) {
    this.mRows = m;
    this.nCols = n;
    this.grid = emptyGrid(this.mRows, this.nCols);
    this.mineCount = mineCount;
    this.placeMines();
  }

  revealSpace(rowIndex, colIndex) {
    if (this.grid[rowIndex] && this.grid[rowIndex][colIndex]) {
      this.grid[rowIndex][colIndex].visible = true;
    }
  }

  placeMines() {
    let minesToPlace = this.mineCount;
    while (minesToPlace > 0) {
      const row = randomInt(0, this.mRows);
      const col = randomInt(0, this.nCols);
      const space = this.grid[row][col];
      if (space.content === empty) {
        space.content = mine;
        minesToPlace -= 1;
      }
    }
  }

  revealedCount() {
    let count = 0;
    this.grid.forEach((row) => {
      row.forEach(({ visible }) => {
        if (visible) {
          count += 1;
        }
      });
    });
    return count;
  }

  revealedMineCount() {
    let count = 0;
    this.grid.forEach((row) => {
      row.forEach(({ content, visible }) => {
        if (visible && content === mine) {
          count += 1;
        }
      });
    });
    return count;
  }

  toSolutionView() {
    return this.grid.map((row) => row.map((space) => {
      switch (space.content) {
        case empty:
          return ' ';
        case mine:
          return '*';
        default:
          return '!';
      }
    }).join('.')).join('\n');
  }

  toPlayerView() {
    const rowStrings = [];
    for (let r = 0; r < this.mRows; r += 1) {
      const spaceStrings = [];
      for (let c = 0; c < this.nCols; c += 1) {
        const space = this.grid[r][c];
        spaceStrings.push(space.toPlayerView(countAdjacentMines(r, c, this.grid)));
      }
      rowStrings.push(spaceStrings.join('.'));
    }
    return rowStrings.join('\n');
  }
}

module.exports = Board;
