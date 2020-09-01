import {Model} from "../model";

export class CustomerReport extends Model {
	
	name: string;
	pivot: CustomerReport

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
