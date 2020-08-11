import {Model} from "../model";

export class HeadquaterDownload extends Model {
	
	name: string;
	pivot: HeadquaterDownload

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	  this.pivot = info.pivot;
	}

}
