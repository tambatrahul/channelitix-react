import {Model} from "../model";

export class SubName extends Model {

  sub_name: string;

  constructor(info: any) {
    super(info.id);
    this.sub_name = info.sub_name;
  }
}
