import { Scene, Vector3, Color4, MeshBuilder, SolidParticleSystem, Mesh, Scalar } from 'babylonjs'
import { IAlgoVis3D } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'


export class SemsegObstacleVis extends IAlgoVis3D {
  private SPS: SolidParticleSystem = null;
  private model: Mesh = null;

  constructor(private scene: Scene) {
    super();
  }

  public reset() {
    if (this.SPS) {
      this.SPS.dispose();
      this.model.dispose();
    }
  }

  public update(worldData: IReduxWorld) {
    this.reset();

    this.SPS = new SolidParticleSystem('SPS_obstacle', this.scene);
    this.model = MeshBuilder.CreateBox("m_obstacle", {size: 0.05}, this.scene);

    var pointCloud: Vector3[] = worldData.obstacles;

    this.SPS.initParticles = () => {
      for (let p = 0; p < pointCloud.length - 1; p++) {
        const maxLength = 70;
        const length = Math.min(pointCloud[p].length(), maxLength);
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

        this.SPS.particles[p].position = pointCloud[p];
        this.SPS.particles[p].color = color;
      }
    };

    this.SPS.addShape(this.model, pointCloud.length);
    this.SPS.buildMesh();
    this.SPS.initParticles();
    this.SPS.setParticles();
    this.SPS.isAlwaysVisible = true;
  }
}
