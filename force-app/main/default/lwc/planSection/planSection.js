import { LightningElement, api } from 'lwc';

export default class PlanSection extends LightningElement {
    @api plan;

    planAssets;

    get hasData() {
        if(this.plan.Assets__r.length) {
            return this.plan.Assets__r.length > 0;
        }
        return false;
    }

    renderedCallback() {
        this.planAssets = this.plan.Assets__r;
    }
}