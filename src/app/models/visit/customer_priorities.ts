import {Model} from "../model";

export class CustomerPriorities extends Model {

  priority_name: string;
  priority_id: number;
  brand_id: number;

  constructor(info: any) {
    super(info.id);
    this.priority_id = info.priority_id;
    this.brand_id = info.brand_id;
    this.priority_name = info.priority_name;

  }
}
