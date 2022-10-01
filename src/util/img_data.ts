import * as fs from 'fs'
import { encode } from 'fast-png'
import { Img as ProtoImg } from '../com/interface/proto/camera'


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

export function convertImg(protoImg: ProtoImg) {
  if (!protoImg)
    return null;
  var imageData = new ImageData(protoImg.width, protoImg.height);
  let x = 0;
  let z = 0;
  let b = 0, g = 0, r = 0;
  while (x < protoImg.data.length) {
    if (protoImg.channels == 3) {
      b = protoImg.data[x++];
      g = protoImg.data[x++];
      r = protoImg.data[x++];
    }
    else if (protoImg.channels == 1) {
      const value = protoImg.data[x++];
      r = value;
      b = value;
      g = value;
    }
    imageData.data[z++] = r; // red
    imageData.data[z++] = g; // green
    imageData.data[z++] = b; // blue
    imageData.data[z++] = 0xFF; // alpha
  }
  return imageData;
}
