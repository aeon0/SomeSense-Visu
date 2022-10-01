import { Scene, Vector3, Color4, PointsCloudSystem, CloudPoint } from 'babylonjs'
import { Frame } from '../../com/interface/proto/frame'
import { IAlgoVis3D } from './ivis'


export class SemsegObstacleVis extends IAlgoVis3D {
  private PCS: PointsCloudSystem = null;

  constructor(private scene: Scene) {
    super();
  }

  public reset() {
    if (this.PCS) {
      this.PCS.dispose();
      this.PCS = null;
    }
  }

  public update(data: Frame) {
    let obs = [];
    data.obstacles.forEach(point => obs.push(new Vector3(point.x, point.y, point.z)));

    if (!this.PCS) {
      this.PCS = new PointsCloudSystem("pcs", 3, this.scene);
      this.PCS.addPoints(8000);
      this.PCS.buildMeshAsync().then( () => this.draw(obs));
    }
    else {
      this.draw(obs);
    }
  }

  private draw(pointCloud: Vector3[]) {
    const zeroVec = new Vector3(0, 0, 0);
    this.PCS.updateParticle = (particle: CloudPoint) => {
      if (particle.idx < pointCloud.length) {
        const maxLength = 70;
        const length = Math.min(pointCloud[particle.idx].length(), maxLength);
        var r, g = 0;
        if(length < (maxLength * 0.5)) {
          r = 255;
          g = Math.round(5.1 * length);
        }
        else {
          g = 255;
          r = Math.round(510 - 5.10 * length);
        }
        const color = new Color4(r/255.0, g/255.0, 0, 1.0);

        particle.position = pointCloud[particle.idx];
        particle.color = color;
      }
      else {
        particle.position = zeroVec;
      }
      return particle;
    };

    this.PCS.setParticles();
    this.PCS.isAlwaysVisible = true;
  }
}
