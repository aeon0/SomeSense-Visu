import { Scene, Vector3, Color4, MeshBuilder, SolidParticleSystem, Mesh } from 'babylonjs'
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
      for (let p = 0; p < this.SPS.nbParticles - 1; p++) {
        this.SPS.particles[p].position = pointCloud[p];
        
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
        this.SPS.particles[p].color = new Color4(r/255.0, g/255.0, 0, 1.0);
      }
    };

    this.SPS.addShape(this.model, pointCloud.length);
    this.SPS.buildMesh();
    this.SPS.initParticles();
    this.SPS.setParticles();
    this.SPS.isAlwaysVisible = true;
  }
}
