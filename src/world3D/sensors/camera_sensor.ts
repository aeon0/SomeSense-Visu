import { Vector3, Matrix } from 'babylonjs'


export class CameraSensor {
  private direction: Vector3;
  private upVector: Vector3;
  private ratio: number;
  private rotationMat: Matrix;
  private translationMat: Matrix;
  private camToWorldMat: Matrix;

  constructor(private position: Vector3, 
              private rotation: Vector3, // roll, pitch, yaw
              private fovHorizontal: number, 
              private fovVertical: number) {
      this.rotationMat =  Matrix.Identity().multiply(Matrix.RotationX(rotation.x))
                                            .multiply(Matrix.RotationY(rotation.y))
                                            .multiply(Matrix.RotationZ(rotation.z));
      this.translationMat = Matrix.Translation(position.x, position.y, position.z);
      this.camToWorldMat = this.translationMat.multiply(this.rotationMat);

      this.direction = new Vector3(1, 0, 0);
      this.direction = Vector3.TransformCoordinates(this.direction, this.rotationMat);
      this.upVector = new Vector3(0, 0, 1);
      this.upVector = Vector3.TransformCoordinates(this.upVector, this.rotationMat);

      // calc ratio
      const width = 2 * Math.tan(this.getFovHorizontal() * 0.5);
      const height = 2 * Math.tan(this.getFovVertical() * 0.5);
      this.ratio = (width / height);
    }

    getPosition() { return this.position; }
    getFovHorizontal() { return this.fovHorizontal; }
    getFovVertical() { return this.fovVertical; }
    getRotation() { return this.rotation; }
    getDirection() { return this.direction; }
    getUpVector() { return this.upVector; }
    getRatio() { return this.ratio; }
    getCamToWorld() { return this.camToWorldMat; }

    public equals(obj: CameraSensor) : boolean {
      return this.position.equalsWithEpsilon(obj.position) &&
             this.rotation.equalsWithEpsilon(obj.rotation) &&
             this.fovHorizontal == obj.fovHorizontal &&
             this.fovVertical == obj.fovVertical;
    }
}
