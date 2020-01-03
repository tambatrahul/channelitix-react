import {Model} from "../model";

export class Priorities extends Model {

  name: string;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
  }
}
