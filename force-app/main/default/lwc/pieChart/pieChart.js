import { LightningElement, api } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";

import chartjs from "@salesforce/resourceUrl/ChartJs";
import doughnutPlugin from "@salesforce/resourceUrl/DoughnutTotalPlugin";

export default class PieChart extends LightningElement {
  chart;

  chartInit = false;

  chartConfig = {
    type: "doughnut",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true
        }
      },
      elements: {
        center: {
          text: "",
          color: "#000000", // Default is #000000
          fontStyle: "Arial", // Default is Arial
          sidePadding: 20, // Default is 20 (as a percentage)
          minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25 // Default is 25 (in px), used for when text wraps
        }
      }
    }
  };

  @api
  createChart(assets, colorMap) {
    if (this.chartInit) {
      this.updateChartData(assets, colorMap);
      return;
    }
    this.chartInit = true;
    Promise.all([loadScript(this, chartjs), loadScript(this, doughnutPlugin)])
      .then(() => {
        const context = this.template
          .querySelector("canvas.donut")
          .getContext("2d");
        this.chart = new window.Chart(context, this.chartConfig);
        this.updateChartData(assets, colorMap);
      })
      .catch(() => {
        this.dispatchErrorEvent();
      });
  }

  updateChartData(assets, colorMap) {
    this.chart.data.labels = [];
    this.chart.data.datasets = [
      { label: "", data: [], backgroundColor: [], pointStyle: [] }
    ];
    this.chart.options.elements.center.text = "";
    let total = 0;
    assets.forEach((asset) => {
      this.chart.data.labels.push(asset.Make_and_Model__c);
      this.chart.data.datasets[0].data.push(asset.Usage__r.Current_Usage__c);
      this.chart.data.datasets[0].backgroundColor.push(colorMap[asset.Id]);
      this.chart.data.datasets[0].pointStyle.push("circle");
      total = total + asset.Usage__r.Current_Usage__c;
    });
    this.chart.options.elements.center.text =
      total + " " + assets[0].Usage__r.Unit_of_Measure__c;
    this.chart.update();
  }

  dispatchErrorEvent() {
    const errorEvent = new CustomEvent("error");
    this.dispatchEvent(errorEvent);
  }
}
