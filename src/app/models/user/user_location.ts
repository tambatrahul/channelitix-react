import {Model} from "../model";

export class UserLocation extends Model {

  latitude: number;
  longitude: number;
  date: number;

  constructor(info: any) {
    super(info.id);
    this.latitude = info.latitude;
    this.longitude = info.longitude;
    this.date = info.date;
  }
}
