import { Vector3, Quaternion } from 'babylonjs'


export class CameraSensor {
  private direction: Vector3;
  private quaternion: Quaternion;
  private ratio: number;

  constructor(private position: Vector3, 
              private rotation: Vector3,
              private fovHorizontal: number, 
              private fovVertical: number) {
        // calc direction and quaternion
        this.direction = new Vector3(0 ,0, 0)
        this.quaternion = Quaternion.FromEulerAngles(rotation.x, rotation.y, rotation.z)
        new Vector3(0, 0, 1).rotateByQuaternionToRef(this.quaternion, this.direction);
        // calc ratio
        const width = 4 * Math.tan(this.getFovHorizontal() * 0.5);
        const height = 4 * Math.tan(this.getFovVertical() * 0.5);
        this.ratio = (width / height);
    }

    getPosition() { return this.position; }
    getFovHorizontal() { return this.fovHorizontal; }
    getFovVertical() { return this.fovVertical; }
    getPitch() { return this.rotation.x; }
    getYaw() { return this.rotation.y; }
    getRoll() { return this.rotation.z; }
    getDirection() { return this.direction; }
    getQuaternion() { return this.quaternion; }
    getRatio() { return this.ratio; }

    public equals(obj: CameraSensor) : boolean {
      return this.position.equals(obj.position) &&
             this.rotation.equals(obj.rotation) &&
             this.fovHorizontal == obj.fovHorizontal &&
             this.fovVertical == obj.fovVertical;
    }
}
