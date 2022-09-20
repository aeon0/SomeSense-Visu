export abstract class ICom {
  abstract sendMsg(msg: any, cb: Function): void;
}
