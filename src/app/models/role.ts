import {Model} from "./model";

export class Role extends Model {

  name: string;
  title: string;

  // for local use only
  attendances = [];

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.title = info.title;
  }
}
