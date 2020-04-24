import {Model} from "../model";
import {User} from './user';

export class Department extends Model {

  name: string;
  pivot: Department;
  user_id: number;
  department_id: number;

  constructor(info: any) {
    super(info.id);
    this.name = info.name;
    this.user_id = info.user_id;
    this.department_id = info.department_id;
    this.pivot = info.pivot;

  }
}
