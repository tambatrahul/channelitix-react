import {Model} from "./model";

export class Holiday extends Model {

  date: string;

  constructor(info: any) {
    super(info.id);
    this.date = info.date;
  }
}
