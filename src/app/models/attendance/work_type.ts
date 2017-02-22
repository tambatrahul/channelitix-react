import {Model} from "../model";

export class WorkType extends Model {

  name: string;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
  }
}
