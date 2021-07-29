import {Model} from "../model";

export class UserLocation extends Model {

  latitude: number;
  longitude: number;
  date: string;

  constructor(info: any) {
    super(info.id);
    this.latitude = parseFloat(info.latitude);
    this.longitude = parseFloat(info.longitude);
    this.date = info.date;
  }
}
