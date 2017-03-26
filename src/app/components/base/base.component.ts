import {ViewChild, ElementRef} from "@angular/core";
import {AuthService} from "../../services/AuthService";
declare let jQuery: any;


export abstract class BaseComponent {

    public ROLE_CSE = 'HQ_MNG';
    public ROLE_CSM = 'AREA_MNG';
    public ROLE_ZSM = 'REGION_MNG';
    public ROLE_ADMIN = 'COUNTRY_MNG';

    /**
     * Base Component Constructor
     */
    constructor() {
    }
}
