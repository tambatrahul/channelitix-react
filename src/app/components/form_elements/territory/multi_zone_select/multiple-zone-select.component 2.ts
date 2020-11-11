import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MultipleBaseSelectComponent} from '../../base-multiple-select.component';
import {TerritoryService} from '../../../../services/territory.service';
import {HQZone} from '../../../../models/territory/zone';

@Component({
    selector: 'multiple-zone-select',
    templateUrl: 'multiple-zone-select.component.html'
})
export class MultipleZoneSelectComponent extends MultipleBaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Zones";

    /**
     * Select regions
     *
     * @type {Array}
     */
    @Input()
    zone_ids: Array<number> = [];

    /**
     * country id for filter
     */
    private _country_id: number;

    /**
     * output selected events
     * @type {EventEmitter}
     */
    @Output()
    selectedZone = new EventEmitter();

    /**
     * Multiple region select component
     * @param service
     */
    constructor(private service: TerritoryService) {
        super();
    }

    /**
     * country_id getter and setters
     *
     * @param country_id
     */
    @Input()
    set country_id(country_id: number) {
        this._country_id = country_id;
        this.fetch();
    }

    get country_id(): number {
        return this._country_id;
    }

    /**
     * load headquarters
     */
    fetch() {
        this.loading = true;
        this.service.zones(this._country_id).subscribe(
            response => {
                this.loading = false;
                this.models = response.zones.map(function (t, key) {
                    return new HQZone(t);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * when region is selected
     * @param id
     */
    selectValue(id: number) {
        let zones = this.zone_ids.map(zone_id => zone_id);
        if (zones.indexOf(id) < 0)
          zones.push(id);
        else
          zones.splice(zones.indexOf(id), 1);

        this.selectedZone.emit(zones);
    }
}
