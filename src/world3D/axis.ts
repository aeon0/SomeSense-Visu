import { Mesh, Vector3, Color3, Scene } from 'babylonjs'

// x == red
// y == green
// z == blue
export const showAxis = function(size: number, scene: Scene) {
  const zeroVec: Vector3 = new Vector3(0, 0, 0); 

  var axisX = Mesh.CreateLines("axisX", [ 
    zeroVec, new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0), 
    new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
  axisX.color = new BABYLON.Color3(0.7, 0.2, 0.2);
  var axisY = Mesh.CreateLines("axisY", [
      zeroVec, new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0), 
      new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
      ], scene);
  axisY.color = new Color3(0.2, 0.7, 0.2);
  var axisZ = Mesh.CreateLines("axisZ", [
      zeroVec, new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
      new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
      ], scene);
  axisZ.color = new Color3(0.2, 0.2, 0.7);
};