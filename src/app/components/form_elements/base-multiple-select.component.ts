import {Input, Output, EventEmitter} from "@angular/core";
import {Model} from "../../models/model";

export abstract class MultipleBaseSelectComponent {

    /**
     * selected value
     */
    @Input()
    values: Array<number> = [];

    /**
     * title for select field
     */
    title: string;

    /**
     * event on values changed
     *
     * @type {EventEmitter}
     */
    @Output()
    onValuesChanged = new EventEmitter();

    /**
     * loading for server call
     * @type {boolean}
     */
    protected loading: boolean = false;

    /**
     * model list
     *
     * @type {Array}
     */
    public models: Model[] = [];

    /**
     * on load of component load territories
     */
    ngOnInit() {
        this.fetch();
    }

    /**
     * load on start
     */
    abstract fetch();

    /**
     * Value changed
     */
    onValueChange(value) {
        let present = false;

        // check if value of present
        this.values.map(function (val, key) {
            if (val == value) {
                present = true;
            }
        });

        // add or remove value depending on value
        if (present)
            this.values.slice(this.values.indexOf(value), 1);
        else
            this.values.push(value);

        this.onValuesChanged.emit(this.values);
    }
}
