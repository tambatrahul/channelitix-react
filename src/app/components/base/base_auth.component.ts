import {ViewChild, ElementRef} from "@angular/core";
import {AuthService} from "../../services/AuthService";
import {BaseComponent} from "./base.component";

declare let jQuery: any;


export abstract class BaseAuthComponent extends BaseComponent {

    /**
     * loading identifier
     */
    @ViewChild('loading_box')
    loading_table: ElementRef;

    /**
     * loading variable
     */
    protected _loading: boolean;

    /**
     * Base Component Constructor
     * @param _service
     */
    constructor(public _service: AuthService) {
        super();
    }

    /**
     * on load of component call this function
     */
    ngOnInit() {
        this._service.checkCredentials();
    }

    /**
     * loading setter
     */
    set loading(loading) {
        this._loading = loading;
        if (loading)
            jQuery(this.loading_table.nativeElement).mask('loading');
        else
            jQuery(this.loading_table.nativeElement).unmask();
    }

    /**
     * loading getter
     * @returns {boolean}
     */
    get loading() {
        return this._loading;
    }
}
