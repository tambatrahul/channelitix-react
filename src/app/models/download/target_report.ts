import {Model} from "../model";

export class TargetReport extends Model {
	
	name: string;
	pivot: TargetReport

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
