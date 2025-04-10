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

function createPolygon(vertices, fill, draggable = false) {
  return new Konva.Line({
    points: vertices.flatMap(p => [p.x, p.y]),
    fill: fill,
    stroke: 'black',
    strokeWidth: 1,
    closed: true,
    draggable: draggable
})}

function createVertices(vertices, includeMidpoints = false) {
  let points = [];

  vertices.forEach((v, i) => {
      points.push(new Konva.Circle({ x: v.x, y: v.y, radius: 3, fill: 'black' }));

      if (includeMidpoints) {
          let nextV = vertices[(i + 1) % vertices.length];
          let mid = getMidpoint(v, nextV);
          points.push(new Konva.Circle({ x: mid.x, y: mid.y, radius: 2, fill: 'black' }));
      }
  });

  return points;
}

const polygonA = createPolygon(verticesA, 'cyan');
layer.add(polygonA);

const dotsA = createVertices(verticesA, true);
dotsA.forEach(dot => layer.add(dot));

const polygonB = createPolygon(verticesB, 'red', true);
layer.add(polygonB);

polygonB.on('mouseover', () => {
  document.body.style.cursor = 'pointer';
});
polygonB.on('mouseout', () => {
document.body.style.cursor = 'default';
});

polygonB.on('dragmove', () => {
  let pos = polygonB.getAbsolutePosition();
  let newVerticesB = verticesB.map(v => ({ x: v.x + pos.x, y: v.y + pos.y }));

  const { snapPos, vertexIndex } = checkSnap(newVerticesB);

  if (snapPos !== null && vertexIndex !== null) {
    let offset = { 
      x: snapPos.x - newVerticesB[vertexIndex].x, 
      y: snapPos.y - newVerticesB[vertexIndex].y
    };

    polygonB.position({ 
      x: pos.x + offset.x,
      y: pos.y + offset.y
    });
  }

  layer.batchDraw()
})

function checkSnap(verticesB) {
  let snapStandards = { vertex: 20, midpoint: 15, line: 10 }
   // Check vertex
   let best = { snapPos: null, vertexIndex: null, distance: Infinity };
   verticesB.forEach((vertexB, iB) => {
     verticesA.forEach((vertexA) => {
       let d = getDistance(vertexB, vertexA);
       if (d < snapStandards.vertex && d < best.distance) {
         best = { snapPos: { x: vertexA.x, y: vertexA.y }, vertexIndex: iB, distance: d };
       }
     });
   });
   if (best.snapPos) return { snapPos: best.snapPos, vertexIndex: best.vertexIndex };
 
   // Check midpoint
   best = { snapPos: null, vertexIndex: null, distance: Infinity };
   verticesB.forEach((vertexB, iB) => {
     verticesA.forEach((vertexA, iA) => {
       let nextVertexA = verticesA[(iA + 1) % verticesA.length];
       let midpoint = getMidpoint(vertexA, nextVertexA);
       let d = getDistance(vertexB, midpoint);
       if (d < snapStandards.midpoint && d < best.distance) {
         best = { snapPos: midpoint, vertexIndex: iB, distance: d };
       }
     });
   });
   if (best.snapPos) return { snapPos: best.snapPos, vertexIndex: best.vertexIndex };
 
   // Check line
   best = { snapPos: null, vertexIndex: null, distance: Infinity };
   verticesB.forEach((vertexB, iB) => {
     verticesA.forEach((vertexA, iA) => {
       let nextVertexA = verticesA[(iA + 1) % verticesA.length];
       let closestOnLine = getClosestPointOnLine(vertexB, vertexA, nextVertexA);
       let d = getDistance(vertexB, closestOnLine);
       if (d < snapStandards.line && d < best.distance) {
         best = { snapPos: closestOnLine, vertexIndex: iB, distance: d };
       }
     });
   });
   
   return { snapPos: best.snapPos, vertexIndex: best.vertexIndex };
}

function getDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function getMidpoint(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function getClosestPointOnLine(p, a, b) {
  let ap = { x: p.x - a.x, y: p.y - a.y };
  let ab = { x: b.x - a.x, y: b.y - a.y };
  let ab2 = ab.x * ab.x + ab.y * ab.y;
  let ap_ab = ap.x * ab.x + ap.y * ab.y;
  let t = ap_ab / ab2;
  t = Math.max(0, Math.min(1, t));
  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}







