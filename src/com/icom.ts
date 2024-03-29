export type IComCallback = (msg: string) => void;

export abstract class ICom {
  abstract sendMsg(endpoint: string, msg: any, cb: IComCallback): void;
}
