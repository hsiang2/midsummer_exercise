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

// function createPolygon(vertices, fill) {
//   return new Konva.Line({
//     points: vertices.flatMap(p => [p.x, p.y]),
//     fill: fill,
//     stroke: 'black',
//     strokeWidth: 2,
//     closed: true,
// })}

function createPolygon(vertices, fill, draggable = false) {
  return new Konva.Line({
    points: vertices.flatMap(p => [p.x, p.y]),
    fill: fill,
    stroke: 'black',
    strokeWidth: 2,
    closed: true,
    draggable: draggable
})}

// function createVertices(vertices) {
//   return vertices.map(v => new Konva.Circle({
//     x: v.x,
//     y: v.y,
//     radius: 3,
//     fill: 'black',
//   }))
// }

const polygonA = createPolygon(verticesA, 'cyan');
const polygonB = createPolygon(verticesB, 'red', true);

layer.add(polygonA);
layer.add(polygonB);
// createVertices(verticesA).forEach(dot => layer.add(dot));

// const groupB = new Konva.Group({
//   draggable: true 
// });

// const polygonB = createPolygon(verticesB, 'red');
// groupB.add(polygonB);

// const dotsB = createVertices(verticesB);
// dotsB.forEach(dot => groupB.add(dot));

// add cursor styling
// groupB.on('mouseover', () => {
//     document.body.style.cursor = 'pointer';
//   });
// groupB.on('mouseout', () => {
//   document.body.style.cursor = 'default';
// });
polygonB.on('mouseover', () => {
  document.body.style.cursor = 'pointer';
});
polygonB.on('mouseout', () => {
document.body.style.cursor = 'default';
});

// layer.add(groupB);


polygonB.on('dragmove', () => {
  let pos = polygonB.getAbsolutePosition();
  let newVerticesB = verticesB.map(v => ({ x: v.x + pos.x, y: v.y + pos.y }));

  let snapPos = checkSnap(newVerticesB);
  console.log("pos", newVerticesB); 
  console.log(snapPos);  // 查看返回的 snap 位置
  if (snapPos) {
    // polygonB.position(snapPos)
    let offset = { 
      x: snapPos.x - newVerticesB[0].x, // 計算第一個點應該移動多少
      y: snapPos.y - newVerticesB[0].y
    };

    polygonB.position({ 
      x: pos.x + offset.x, // 只移動 offset 差值
      y: pos.y + offset.y
    });
  }

  layer.batchDraw()
})

function checkSnap(verticesB) {
  let snapStandards = { vertex: 20, midpoint: 15, line: 10 }
  let closestSnap = null;
  let closestDistance = Infinity;
  
  verticesB.forEach(vertexB => {
    verticesA.forEach((vertexA, index) => {
      let nextVertexA = verticesA[(index + 1) % verticesA.length]
      
      let distVertex = getDistance(vertexB, vertexA)
      if (distVertex < snapStandards.vertex && distVertex < closestDistance) {
        closestSnap = { x: vertexA.x, y: vertexA.y};
        closestDistance = distVertex;
      }

      let midpoint = getMidpoint(vertexA, nextVertexA);
      let distMid = getDistance(vertexB, midpoint);
      if (distMid < snapStandards.midpoint && distMid < closestDistance) {
        closestSnap = midpoint;
        closestDistance = distMid;
      }

      let closestPointOnLine = getClosestPointOnLine(vertexB, vertexA, nextVertexA);
      let distLine = getDistance(vertexB, closestPointOnLine);
      if (distLine < snapStandards.line && distLine < closestDistance) {
        closestSnap = closestPointOnLine;
        closestDistance = distLine;
      }
    })
  })

  return closestSnap
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







