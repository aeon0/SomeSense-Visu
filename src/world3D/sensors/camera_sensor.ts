import { Vector3, Quaternion } from 'babylonjs'


export class CameraSensor {
  private direction: Vector3;
  private quaternion: Quaternion;

  constructor(private position: Vector3, 
              private rotation: Vector3,
              private fovHorizontal: number, 
              private fovVertical: number) {
        this.direction = new Vector3(0 ,0, 0)
        this.quaternion = Quaternion.FromEulerAngles(rotation.x, rotation.y, rotation.z)
        new Vector3(0, 0, 1).rotateByQuaternionToRef(this.quaternion, this.direction);
    }

    getPosition() { return this.position; }
    getFovHorizontal() { return this.fovHorizontal; }
    getFovVertical() { return this.fovVertical; }
    getPitch() { return this.rotation.x; }
    getYaw() { return this.rotation.y; }
    getRoll() { return this.rotation.z; }
    getDirection() { return this.direction; }
    getQuaternion() { return this.quaternion; }
}
