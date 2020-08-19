import {Model} from "../model";

export class PrimaryDownload extends Model {
	
	name: string;
	pivot: PrimaryDownload

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	 this.pivot = info.pivot;
	}

}
