import {Model} from "../model";

export class CustomerQualification extends Model {

    name: string;
    customer_id: number;
    qualification_id: number;
    pivot: CustomerQualification;


  constructor(info: any) {
        super(info.id);
        this.name = info.name;
        this.customer_id = info.customer_id;
        this.qualification_id = info.qualification_id;
        this.pivot = info.pivot;
    }
}
