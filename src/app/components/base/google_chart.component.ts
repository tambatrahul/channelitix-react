import {Component, OnInit} from '@angular/core';
declare let google: any;


@Component({
    selector: 'chart'
})
export class GoogleChartComponent implements OnInit {
    private static googleLoaded: any;

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
}