import { Vector3, Vector2, Matrix } from 'babylonjs'


export class CameraSensor {
  private direction: Vector3;
  private upVector: Vector3;
  private ratio: number;
  private rotationMat: Matrix;
  private translationMat: Matrix;
  private camToWorldMat: Matrix;

  constructor(
    private key: string,
    private position: Vector3, 
    private rotation: Vector3, // roll, pitch, yaw
    private fovHorizontal: number, 
    private fovVertical: number,
    private principalPoint: Vector2,
    private focalLength: Vector2) 
  {
    this.rotationMat =  Matrix.Identity().multiply(Matrix.RotationX(rotation.x))
                                          .multiply(Matrix.RotationY(rotation.y))
                                          .multiply(Matrix.RotationZ(rotation.z));
    this.translationMat = Matrix.Translation(position.x, position.y, position.z);
    this.camToWorldMat = this.translationMat.multiply(this.rotationMat);

    this.direction = Vector3.TransformCoordinates(new Vector3(1, 0, 0), this.rotationMat);
    this.upVector = Vector3.TransformCoordinates(new Vector3(0, 0, 1), this.rotationMat);

    // calc ratio
    const width = 2 * Math.tan(this.getFovHorizontal() * 0.5);
    const height = 2 * Math.tan(this.getFovVertical() * 0.5);
    this.ratio = (width / height);
  }

  getKey() { return this.key; }
  getPosition() { return this.position; }
  getFovHorizontal() { return this.fovHorizontal; }
  getFovVertical() { return this.fovVertical; }
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

  // Converts image position to world 3D coordinates on the normalized camera plane
  // imgPos (x, y) in image coordinates with (0, 0) being the to left corner
  public calcImgToWorld(imgPos: Vector2): Vector3 {
    // default camera direction with no rotation is Vector3(1, 0, 0);
    // x image coordinate -> -y cam
    // y image coordinate -> -z cam
    // n_x = ( x - p_x) * ( 1 / f_x )
    const camNorm = new Vector3(
      1,
      -(imgPos.x - this.principalPoint.x) * (1 / this.focalLength.x),
      -(imgPos.y - this.principalPoint.y) * (1 / this.focalLength.y),
    );
    return this.calcCamToWorld(camNorm);
  }

  public calcCamToWorld(camPos: Vector3): Vector3 {
    return Vector3.TransformCoordinates(camPos, this.camToWorldMat);
  }
}
