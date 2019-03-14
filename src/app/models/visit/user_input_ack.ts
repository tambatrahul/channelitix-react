import {Model} from "../model";

export class UserInputAck extends Model {

  qty : number;
  input_id : number;

  constructor(info: any) {
    super(info.id);
    this.qty = info.qty;
    this.input_id = info.input_id;
  }
}
