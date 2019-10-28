import { Vector3, Quaternion } from 'babylonjs'

export class CameraSensor {
  private direction: Vector3;

  constructor(private position: Vector3, 
              private fovHorizontal: number, 
              private fovVertical: number,
              private pitch: number = 0, 
              private yaw: number = 0, 
              private roll: number = 0) {
        this.direction = new Vector3(0 ,0, 0)
        new Vector3(0, 0, 1).rotateByQuaternionToRef(Quaternion.FromEulerAngles(pitch, yaw, roll), this.direction);
    }

    getPosition() { return this.position; }
    getFovHorizontal() { return this.fovHorizontal; }
    getFovVertical() { return this.fovVertical; }
    getPitch() { return this.pitch; }
    getYaw() { return this.yaw; }
    getRoll() { return this.roll; }
    getDirection() { return this.direction; }
}
