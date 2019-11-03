import { Mesh, Vector3, Color3, Scene, MeshBuilder } from 'babylonjs'
import { GridMaterial } from 'babylonjs-materials';


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

export const showGrid = function(scene: Scene) {
  const length = 140;
  const width = 100;
  let gridGround = Mesh.CreateGround("grid_ground", width, length, 0, this.scene, false);
  gridGround.position.z += length * 0.5;
  const material = new GridMaterial("grid_material", this.scene);
  material.majorUnitFrequency = 10;
  material.minorUnitVisibility = 0.5;
  material.mainColor = new Color3(0, 0, 0);
  material.lineColor = new Color3(0.6, 0.6, 0.6);
  material.opacity = 0.4;
  material.backFaceCulling = false;
  gridGround.material = material;

  const xRuler = MeshBuilder.CreatePlane("x_ruler", {width: width, height: 0.5}, this.scene);
  xRuler.material = material;

  const zRuler = MeshBuilder.CreatePlane("z_ruler", {width: length, height: 0.5}, this.scene);
  zRuler.rotation.y = Math.PI * 0.5;
  zRuler.position.z += length * 0.5;
  zRuler.material = material;
}
