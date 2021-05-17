import {Model} from "../model";

export class SampleReport extends Model {

	name: string;
	pivot: SampleReport;

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
