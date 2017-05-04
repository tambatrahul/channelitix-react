import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
declare let google: any;
declare let jQuery: any;

@Component({
    selector: 'chart'
})
export class GoogleChartComponent implements OnInit {
    private static googleLoaded: any;


    /**
     * loading identifier
     */
    @ViewChild('loading_box')
    loading_table: ElementRef;

    /**
     * loading variable
     */
    protected _loading: boolean;

    constructor() {
    }

    getGoogle() {
        return google;
    }

    ngOnInit() {
        if (!GoogleChartComponent.googleLoaded) {
            GoogleChartComponent.googleLoaded = true;
            google.charts.load('current', {packages: ['corechart']});
        }
    }

    drawGraph() {
        console.log("DrawGraph base class!!!! ");
    }

    /**
     * create bar chart
     *
     * @param element
     * @returns {google.visualization.BarChart}
     */
    createBarChart(element: any): any {
        return new google.visualization.BarChart(element);
    }

    /**
     * create column chart
     *
     * @param element
     * @returns {google.visualization.BarChart}
     */
    createColumnChart(element: any): any {
        return new google.visualization.ColumnChart(element);
    }

    /**
     * create line chart
     *
     * @param element
     * @returns {google.visualization.BarChart}
     */
    createLineChart(element: any): any {
        return new google.visualization.LineChart(element);
    }

    /**
     * create combo chart
     *
     * @param element
     * @returns {google.visualization.ComboChar}
     */
    createComboChar(element: any): any {
        return new google.visualization.ComboChart(element);
    }

    /**
     * create data table
     *
     * @param array
     * @returns {any}
     */
    createDataTable(array: any[]): any {
        return google.visualization.arrayToDataTable(array);
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