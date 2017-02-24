import {Model} from "../model";

export class Region extends Model {

  name: string;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
  }
}
