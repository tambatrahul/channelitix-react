import {environment} from "../../../environments/environment";
declare let jQuery: any;


export abstract class BaseComponent {

    /**
     * get environment details
     */
    environment = environment;

    public ROLE_THIRD_PARTY = 'THIRD_PARTY';
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
