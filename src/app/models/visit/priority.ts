import {Model} from "../model";

export class Priority extends Model {

  name: string;
  brand_id: number;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.brand_id = info.brand_id;
  }
}
