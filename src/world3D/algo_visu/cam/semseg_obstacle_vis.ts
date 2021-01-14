import { Scene, Vector3, Color4, MeshBuilder, SolidParticleSystem, Mesh, Scalar } from 'babylonjs'
import { IAlgoVis3DCam } from '../ivis'
import { IReduxWorld } from '../../../redux/world/types'
import { CameraSensor } from '../../sensors/camera_sensor'


export class SemsegObstacleVis extends IAlgoVis3DCam {
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

  public update(worldData: IReduxWorld, camSensor: CameraSensor) {
    this.reset();

    this.SPS = new SolidParticleSystem('SPS_obstacle', this.scene);
    this.model = MeshBuilder.CreateBox("m_obstacle", {size: 0.15}, this.scene);
    
    var pointCloud: Vector3[] = [];
    for (let i = 0; i < worldData.camSensors.length; i++) {
      if (camSensor.getKey() == worldData.camSensors[i].key) {
        pointCloud = worldData.camSensors[i].semseg.obstacles;
      }
    }

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

        // Let's just lie a bit in the visu, I mean, make it nicer, by also putting some points above the ground in random proximity
        // the random nosiness makes it a bit easier to gather the 3D distances
        const iP = p * 3;
        const x = pointCloud[p].x;
        const y = pointCloud[p].y;
        const randDelta = 0.01;
        this.SPS.particles[iP].position = new Vector3(Scalar.RandomRange(x-randDelta, x+randDelta),
        Scalar.RandomRange(y-randDelta, y+randDelta), Scalar.RandomRange(0.025, 0.075));
        this.SPS.particles[iP+1].position = new Vector3(Scalar.RandomRange(x-randDelta, x+randDelta),
          Scalar.RandomRange(y-randDelta, y+randDelta), Scalar.RandomRange(0.475, 0.525));
        this.SPS.particles[iP+2].position = new Vector3(Scalar.RandomRange(x-randDelta, x+randDelta),
          Scalar.RandomRange(y-randDelta, y+randDelta), Scalar.RandomRange(0.775, 0.825));
        this.SPS.particles[iP].color = color;
        this.SPS.particles[iP+1].color = color;
        this.SPS.particles[iP+2].color = color;
      }
    };

    // We want to have 3 particals for each point in the point cloud
    this.SPS.addShape(this.model, pointCloud.length * 3);
    this.SPS.buildMesh();
    this.SPS.initParticles();
    this.SPS.setParticles();
    this.SPS.isAlwaysVisible = true;
  }
}
