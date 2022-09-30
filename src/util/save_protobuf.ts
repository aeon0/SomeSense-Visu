import fs from 'fs'


let metaData = {
  "msgSize": null,
  "timestamp": [],
  "msgStart": [],
  "fileName": "",
  "startTs": 0
}

export function saveCurrMetaData(fileName: string) {
  console.log("Saving meta data");
  const fileNameJson = fileName + ".somesense.json";
  fs.writeFile(fileNameJson, JSON.stringify(metaData), (err) => {
    if (err) console.log(err);
    else console.log("Done");
  });
}

export function savePbToFile(fileName: string, data: Uint8Array, absTsMicro: number) {
  const fileNamePb = fileName + ".somesense.pb";

  if (metaData["fileName"] != fileName) {
    console.log("Saving new Rec")
    metaData["msgSize"] = data.length;
    metaData["timestamp"] = [];
    metaData["msgStart"] = [];
    metaData["fileName"] = fileName;
    metaData["startTs"] = absTsMicro;
  }

  // First check current filesize
  let startMsgBytes = 0;
  if (fs.existsSync(fileNamePb)) {
    startMsgBytes = fs.statSync(fileNamePb).size;
  }
  metaData["timestamp"].push(absTsMicro);
  metaData["msgStart"].push(startMsgBytes)

  fs.appendFile(fileNamePb, Buffer.from(data), (err) => {
    if (err) console.log(err);
  });
}
