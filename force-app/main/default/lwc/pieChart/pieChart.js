import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

import chartjs from '@salesforce/resourceUrl/ChartJs';

export default class PieChart extends LightningElement {

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
            legend: {
                position: 'bottom'
            }
        }
    };

    @api
    createChart(assets) {
        console.log('pie chart');
        if (this.chartInit) {
            this.updateChartData(assets);
            return;
        }
        this.chartInit = true;
        loadScript(this, chartjs)
        .then(() => {
            const context = this.template.querySelector('canvas.donut').getContext('2d');
            this.chart = new window.Chart(context, this.chartConfig);
            this.updateChartData(assets);
        })
        .catch(error => {
            console.warn(error);
        });
    }

    updateChartData(assets) {
        this.chart.data.labels = [];
        this.chart.data.datasets = [{ label: '', data: [], backgroundColor: [] }];
        assets.forEach(asset => {
            this.chart.data.labels.push(asset.Make_and_Model__c);
            this.chart.data.datasets[0].data.push(asset.Usage__r.Current_Usage__c);
            this.chart.data.datasets[0].backgroundColor.push();
        });
        this.chart.update();
    }
}