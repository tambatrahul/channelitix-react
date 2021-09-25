import {Model} from '../model';

export class UserTrainingFiles extends Model {

  id: number;
  user_id: number;
  email: string;
  file_location: string;

  constructor(info:any) {
    super(info.id);
    this.user_id = info.user_id;
    this.email = info.email;
    this.file_location = info.file_location;
  }
}
