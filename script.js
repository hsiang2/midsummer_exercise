const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

const layer = new Konva.Layer();
stage.add(layer);

const verticesA = [
  {x: 189, y: 28}, {x: 287, y: 28}, {x: 287, y: 275}, {x: 58, y: 275},
  {x: 58, y: 199}, {x: 98, y: 96}
];

const verticesB = [
  {x: 415, y: 28}, {x: 461, y: 72}, {x: 461, y: 102}, 
  {x: 365, y: 102}, {x: 365, y: 72}
];

function createPolygon(vertices, fill) {
  return new Konva.Line({
    points: vertices.flatMap(p => [p.x, p.y]),
    fill: fill,
    stroke: 'black',
    strokeWidth: 2,
    closed: true,
})}

function createVertices(vertices) {
  return vertices.map(v => new Konva.Circle({
    x: v.x,
    y: v.y,
    radius: 3,
    fill: 'black',
  }))
}

const polygonA = createPolygon(verticesA, 'cyan');
layer.add(polygonA);
createVertices(verticesA).forEach(dot => layer.add(dot));

const groupB = new Konva.Group({
  draggable: true 
});

const polygonB = createPolygon(verticesB, 'red');
groupB.add(polygonB);

const dotsB = createVertices(verticesB);
dotsB.forEach(dot => groupB.add(dot));

// add cursor styling
groupB.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
groupB.on('mouseout', function () {
  document.body.style.cursor = 'default';
});

layer.add(groupB);



