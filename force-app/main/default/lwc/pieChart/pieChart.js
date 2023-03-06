import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import chartjs from '@salesforce/resourceUrl/ChartJs';

export default class PieChart extends LightningElement {

    @api planAssets;

    chart;

    chartInit = false;

    chartConfig = {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true
                }
            }
        }
    };

    renderedCallback() {
        if (this.chartInit) {
            return;
        }
        this.chartInit = true;
        loadScript(this, chartjs)
        .then(() => {
            const context = this.template.querySelector('canvas.donut').getContext('2d');
            this.chart = new window.Chart(context, this.chartConfig);
            this.updateChartData();
        })
        .catch(error => {
            console.warn(error);
        });
    }

    @api
    updateChartData() {
        this.chart.data.labels = [];
        this.chart.data.datasets = [{ label: '', data: [], backgroundColor: [] }];
        this.planAssets.forEach(asset => {
            this.chart.data.labels.push(asset.Make_and_Model__c);
            this.chart.data.datasets[0].data.push(asset.Usage__r.Current_Usage__c);
            this.chart.data.datasets[0].backgroundColor.push();
        });
        this.chart.update();
    }
}