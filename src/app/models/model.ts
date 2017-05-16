import {environment} from "../../environments/environment";

export class Model {

    environment = environment;
    id: number;

    constructor(id: number) {
        this.id = id;
    }

}
