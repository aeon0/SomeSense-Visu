import { Visu3D } from './visu3D/visu3d';

// Start Tracking
console.log("HERE!");
const visu3D: Visu3D = new Visu3D(<HTMLCanvasElement>document.getElementsByTagName('canvas').item(0));
visu3D.load();
visu3D.run();
