import { Vector3, Color3, Scene, MeshBuilder } from 'babylonjs'
import { GridMaterial } from 'babylonjs-materials';


// x == red
// y == green
// z == blue
export const showAxis = function(size: number, scene: Scene) {
  const zeroVec: Vector3 = new Vector3(0, 0, 0); 

  // red
  var axisX = MeshBuilder.CreateLines("axisX", {
    points: [ 
      zeroVec, new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0), 
      new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
    ]
  }, scene);
  axisX.color = new BABYLON.Color3(0.7, 0.2, 0.2);
  // green
  var axisY = MeshBuilder.CreateLines("axisY", {
    points: [
      zeroVec, new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
      new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
    ]
  }, scene);
  axisY.color = new Color3(0.2, 0.7, 0.2);
  // blue
  var axisZ = MeshBuilder.CreateLines("axisZ", {
    points: [
      zeroVec, new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
      new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
    ]
  }, scene);
  axisZ.color = new Color3(0.2, 0.2, 0.7);
};

export const showGrid = function(scene: Scene) {
  const offsetToFront = 40;
  const width = 300; // x-direction
  const height = 200; // y-direction
  let gridGround = MeshBuilder.CreateGround("grid_ground", {height: height, width: width, subdivisions: 0, updatable: false}, scene);
  gridGround.rotation.x = Math.PI*0.5;
  gridGround.position.x += offsetToFront;
  let material = new GridMaterial("grid_material", scene);
  material.majorUnitFrequency = 10;
  material.minorUnitVisibility = 0.5;
  material.mainColor = new Color3(0, 0, 0);
  material.lineColor = new Color3(0.6, 0.6, 0.6);
  material.opacity = 0.25;
  material.backFaceCulling = false;
  gridGround.material = material;

  let rulerMaterial = material.clone("ruler_material");
  rulerMaterial.opacity = 0.6;
  const xRuler = MeshBuilder.CreatePlane("x_ruler", {width: width, height: 0.5}, scene);
  xRuler.rotation.x = Math.PI * 0.5;
  xRuler.position.x += offsetToFront;
  xRuler.material = rulerMaterial;

  const yRuler = MeshBuilder.CreatePlane("y_ruler", {width: height, height: 0.5}, scene);
  yRuler.rotation.z = Math.PI * 0.5;
  yRuler.rotation.y = Math.PI * 0.5;
  yRuler.material = rulerMaterial;
}
