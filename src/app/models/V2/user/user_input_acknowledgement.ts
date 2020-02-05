import {Model} from '../../model';


export class UserInputAcknowledgement extends Model {

  user_id: number = 0;
  qty: number = 0;
  input_id: number = 0;
  constructor(info: any) {
    super(info.id);
    this.user_id = info.user_id;
    this.qty = info.qty;
    this.input_id = info.input_id;
  }
}
