class Tile {
  constructor(colors) {
    this.pos = createVector(width / 2, height / 2);
    this.scale = 1;
    this.rotation = PI;

    this.edges = [];

    let rotation = PI / 3;
    let startV = createVector(0, -100).rotate(rotation);

    for (let i = 0; i < 6; ++i) {
      let endV = startV.copy().rotate(rotation);

      let newEdge = {
        color: colors[i],
        start: startV,
        end: endV,
        middle: endV.copy().sub(startV).div(2).add(startV),
        connect: null,
        drawn: false
      };

      for (let edge of this.edges) {
        if (edge.color === newEdge.color) {
          edge.connect = newEdge;
          newEdge.connect = edge;

          break;
        }
      }

      this.edges.push(newEdge);

      startV = endV;
    }
  }

  draw() {
    push();

    translate(this.pos.x, this.pos.y);
    scale(this.scale);
    rotate(this.rotation);

    stroke(55);
    fill(55);

    beginShape();
    for (let edge of this.edges) {
      vertex(edge.start.x, edge.start.y);
      edge.drawn = false;
    }
    endShape(CLOSE);

    for (let edge of this.edges) {
      if (edge.drawn || !edge.connect) {
        continue;
      }

      strokeWeight(16);
      stroke(COLORS[edge.color]);

      line(edge.middle.x, edge.middle.y, edge.connect.middle.x, edge.connect.middle.y);

      edge.drawn = true;
      edge.connect.draw = true;
    }

    stroke(55);

    pop();
  }
}

let PATTERNS = [
  'YYBRBR', 'RRBYYB', 'BBYYRR', 'BRYBYR', 'BBRYYR', 'YBRYRB', 'BBYRYR',
  'BBRYRY', 'RBYRYB', 'YYRBRB', 'RRBYBY', 'RRYBYB', 'BBYRRY', 'BBRRYY',
  'GGRYYR', 'GGYRRY', 'YYGRGR', 'YYRGRG', 'RRGYGY', 'RRYGYG', 'GGRRYY',
  'RRGYYG', 'GGYYRR', 'GGBRRB', 'BBGGRR', 'BBGRRG', 'RRBGBG', 'BBRRGG',
  'RRGBGB', 'BBRGGR', 'GGRYRY', 'GRYGYR', 'GGYRYR', 'RGYRYG', 'YGRYRG',
  'GGRBRB', 'BBGRGR', 'BBRGRG', 'GBRGRB', 'BGRBRG', 'GGBRBR', 'RBGRGB',
  'BBYYGG', 'YBGYGB', 'BBGGYY', 'GGBYBY', 'BBYGGY', 'GGBYYB', 'BBGYYG',
  'BGYBYG', 'GBYGYB', 'GGYBYB', 'YYGBGB', 'YYBGBG', 'BBGYGY', 'BBYGYG'
];

let COLORS = {
  'Y': [255, 255, 0],
  'R': [255, 0, 0],
  'G': [0, 255, 0],
  'B': [0, 0, 255]
};

let tiles = [];

var selectedTile;
var sliderTile;

var selectedScale;
var sliderScale;

var selectedRotation;
var sliderRotation;

function setup() {
  createCanvas(640, 480);

  for (let pattern of PATTERNS) {
    tiles.push(new Tile(pattern));
  }

  selectedTile = createP();
  sliderTile = createSlider(0, tiles.length - 1, 0);

  selectedScale = createP();
  sliderScale = createSlider(0.5, 3, 1, 0.5);

  selectedRotation = createP();
  sliderRotation = createSlider(0, 5, 3);
}

function draw() {
  background(200);

  let tileIndex = sliderTile.value();
  let scaleIndex = sliderScale.value();
  let rotationIndex = sliderRotation.value();

  let tile = tiles[tileIndex];

  selectedTile.html('Selected tile: ' + tileIndex);
  selectedScale.html('Scale: ' + scaleIndex);
  selectedRotation.html('Rotation: ' + rotationIndex * 60);

  tile.scale = scaleIndex;
  tile.rotation = rotationIndex * PI / 3;
  tile.draw();
}
