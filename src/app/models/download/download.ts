import {Model} from "../model";

export class Download extends Model {
	
	name: string;
	file_name: string;
	pivot: Download;

	constructor(info: any) {
	  super(info.id);
	  this.name = info.display_name;
	  this.file_name = info.download_file_name
	 this.pivot = info.pivot;
	}

}
