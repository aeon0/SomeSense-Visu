import * as fs from 'fs'
import { encode } from 'fast-png'
import { Img } from '../com/interface/proto/types'


export function exportImg(imgData: ImageData, ts: number) {
  if (imgData === null)
    return;

  var pngImg = encode({
    width: imgData.width,
    height: imgData.height,
    data: new Uint8Array(imgData.data)
  });
  const exportDir = "export";
  !fs.existsSync(exportDir) && fs.mkdirSync(exportDir);
  const saveTo = exportDir + "/" + ts.toString() + ".png";
  fs.writeFile(saveTo, pngImg, err => {
    if (err) {
      console.log("An error ocurred saving the image " + err.message);
    } else {
      console.log("Image has been saved as " + saveTo);
    }
  });
}

export function convertImg(rawImgPayload: Uint8Array, width: number, height: number) {
  var imageData = new ImageData(width, height);
  let x = 0;
  let z = 0;
  while (x < rawImgPayload.length) {
    const b = rawImgPayload[x++];
    const g = rawImgPayload[x++];
    const r = rawImgPayload[x++];
    imageData.data[z++] = r; // red
    imageData.data[z++] = g; // green
    imageData.data[z++] = b; // blue
    imageData.data[z++] = 0xFF; // alpha
  }
  return imageData;
}