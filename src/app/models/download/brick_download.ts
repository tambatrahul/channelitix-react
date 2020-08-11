import {Model} from "../model";

export class BrickDownload extends Model {
	
	name: string;
	pivot: BrickDownload

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	  this.pivot = info.pivot;
	}

}
