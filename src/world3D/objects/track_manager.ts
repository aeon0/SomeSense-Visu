import { Scene } from 'babylonjs'
import { ITrack } from "../../redux/world/types";
import { Track } from "./track"


export class TrackManager {
  private tracks: {[key: string]: Track} = {};

  constructor(private scene: Scene) {}

  public update(tracks: ITrack[]) {
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
      if (!found) {
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
