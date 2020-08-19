import {Model} from "../model";

export class Stockist extends Model {
	
	name: string;
	pivot: Stockist

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
