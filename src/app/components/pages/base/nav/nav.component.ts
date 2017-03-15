import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
declare let jQuery: any;

@Component({
    selector: 'nav-comp',
    templateUrl: 'nav.component.html'
})
export class NavComponent {

    constructor(public _auth_service: AuthService) {

    }

    /**
     * reload navigation on view initialization
     */
    ngAfterViewInit() {
        jQuery('.list-accordion').each(function () {
            jQuery(this).dcAccordion({
                eventType: 'click',
                hoverDelay: 100,
                autoClose: true,
                saveState: false,
                disableLink: true,
                speed: 'fast',
                showCount: false,
                autoExpand: true,
                cookie: 'dcjq-accordion-1',
                classExpand: 'dcjq-current-parent'
            });
        });
    }
}
