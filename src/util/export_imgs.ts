import * as fs from 'fs'
import { encode } from 'fast-png'

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
