import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {PrimarySale} from "../../../../models/sale/primary_sale";

declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'invoice-detail',
    templateUrl: 'invoice_detail.component.html',
    styleUrls: ['invoice_detail.component.less']
})
export class InvoiceDetailComponent extends ListComponent {

    /**
     * title for form
     *
     * @type {string}
     */
    title: string = "";

    /**
     * Tours
     */
    @Input()
    invoice: PrimarySale;

    /**
     * Monthly Tour Program Constructor
     *
     * @param _service
     */
    constructor(public _service: AuthService) {
        super(_service);
    }

    fetch() {

    }
}
