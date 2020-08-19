import {Model} from "../model";

export class InputReport extends Model {
	
	name: string;
	pivot: InputReport

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
