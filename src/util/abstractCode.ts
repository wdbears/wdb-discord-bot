export class AbstractCode {
  private _id: number;
  private _desc: string;

  constructor(id: number, desc: string) {
    this._id = id;
    this._desc = desc;
  }

  public get id(): number {
    return this._id;
  }

  public get desc(): string {
    return this._desc;
  }
}
