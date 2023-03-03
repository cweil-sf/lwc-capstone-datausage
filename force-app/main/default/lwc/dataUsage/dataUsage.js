import { LightningElement, api } from 'lwc';
import getPlans from '@salesforce/apex/deviceUsageController.getPlans';

export default class DataUsage extends LightningElement {
    @api recordId;

    planData = [];

    get hasData() {
        return this.planData.length > 0;
    }

    connectedCallback() {
        getPlans({ billingAccountId: this.recordId })
        .then(result => {
            this.planData = result.plans;
            this.planData.forEach(plan => {
                plan.Assets__r.forEach(asset => {
                    asset.Usage__r = result.usageMap[asset.Id];
                });
            });
        })
        .catch(error => {
            console.warn(JSON.stringify(error));
        });
    }
}