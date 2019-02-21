const globals = {
  tileSize: 32,
  scale: 2,
  tilesTall: 10,
  tilesWide: 6,
  pipeGapSize: 3,
  gravity: 300,
  deviceWidth: window.innerWidth,
  deviceHeight: window.innerHeight
};

globals.width = globals.tileSize * globals.scale * globals.tilesWide;
globals.height = globals.tileSize * globals.scale * globals.tilesTall;
globals.deviceScale = Math.min(
  globals.deviceWidth / globals.width,
  globals.deviceHeight / globals.height
);

export default globals;
