import {Model} from "../model";

export class WorkType extends Model {

  name: string;
  type: string;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.type = info.type;
  }
}
