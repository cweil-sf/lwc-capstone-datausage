import { LightningElement, api } from 'lwc';

const COLORS = ['#96F2EE', '#68CEEE', '#2D9CED', '#0E6ECE', '#073E92', '#051C61'];

export default class PlanSection extends LightningElement {
    @api plan;
    @api type;

    planAssets;

    colorMap = {};
    expanded = true;
    icon = "utility:switch";

    get hasData() {
        if(this.plan.Assets__r.length) {
            return this.plan.Assets__r.length > 0;
        }
        return false;
    }

    renderedCallback() {
        this.planAssets = this.plan.Assets__r;
        this.planAssets.forEach((asset, index) => {
            this.colorMap[asset.Id] = COLORS[index % COLORS.length];
        });
    }

    toggleSection() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.icon = "utility:switch";
            setTimeout(() => {
                this.createChart();
            }, 0);
        } else {
            this.icon = "utility:chevronup";
        }
    }

    @api
    createChart(){
        this.template.querySelector('c-pie-chart').createChart(this.planAssets, this.colorMap);
    }
}