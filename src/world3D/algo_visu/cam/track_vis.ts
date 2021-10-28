import { Scene } from 'babylonjs'
import { IAlgoVis3D } from '../ivis'
import { ITrack, IReduxWorld } from "../../../redux/world/types";
import { Track } from "./track"


export class TrackVis extends IAlgoVis3D {
  private tracks: {[key: string]: Track} = {};

  constructor(private scene: Scene) {
    super();
  }

  public reset() {
    for (let key in this.tracks) {
      this.tracks[key].reset();
      delete this.tracks[key];
    }
  }

  public update(worldData: IReduxWorld) {
    this.reset();
    var tracks: ITrack[] = worldData.tracks;
  
    // Check if tracks need to be removed
    for (let trackId in tracks) {
      // Check if trackId is within the received tracks
      let found = false;
      for (let i = 0; i < tracks.length; ++i) {
        if (tracks[i].trackId === trackId) {
          found = true;
          break;
        }
      }
      if (!found && trackId in this.tracks) {
        this.tracks[trackId].reset();
        delete this.tracks[trackId];
      }
    }

    // Update and initialize remaining tracks
    for (let i = 0; i < tracks.length; i++) {
      const trackId = tracks[i].trackId;
      if (!(trackId in this.tracks)) {
        this.tracks[trackId] = new Track(this.scene);
      }
      this.tracks[trackId].update(tracks[i]);
    }
  }
}
