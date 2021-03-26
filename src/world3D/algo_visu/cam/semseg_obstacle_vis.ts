import { Scene, Vector3, Color4, PointsCloudSystem, CloudPoint } from 'babylonjs'
import { IAlgoVis3D } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'
import { createGlobalStyle } from 'styled-components';


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

  public update(worldData: IReduxWorld) {
    if (!this.PCS) {
      this.PCS = new PointsCloudSystem("pcs", 1, this.scene);
      this.PCS.addPoints(8000);
      this.PCS.buildMeshAsync();
    }
    else {
      var pointCloud: Vector3[] = worldData.obstacles;

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
}
