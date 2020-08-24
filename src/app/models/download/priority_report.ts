import {Model} from "../model";

export class PriorityReport extends Model {
	
	name: string;
	pivot: PriorityReport

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
