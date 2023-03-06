import { LightningElement, api } from 'lwc';

export default class PlanSection extends LightningElement {
    @api plan;
    @api type;

    planAssets;

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
    }

    toggleSection() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.icon = "utility:switch";
        } else {
            this.icon = "utility:chevronup";
        }
    }
}