import {Model} from '../model';
import { AppConstants } from 'app/app.constants';
import * as moment from "moment";

export class UserTraining extends Model {

    id: number;
    training_type: string;
    org_code: string;
    template_id: string;
    status: string;

    constructor(info:any) {
        super(info.id);
        this.training_type = info.training_type;
        this.org_code = info.org_code;
        this.template_id = info.template_id;
        this.status = info.status;
    }
}
