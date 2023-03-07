import { LightningElement, api } from 'lwc';
import getPlans from '@salesforce/apex/deviceUsageController.getPlans';

export default class DataUsage extends LightningElement {
    @api recordId;

    isLoading = true;
    hasError = false;
    planData = [];

    get hasData() {
        return this.planData.length > 0;
    }

    connectedCallback() {
        this.isLoading = true;
        this.callGetPlans(this.recordId, 'Data');
    }

    callGetPlans(id, type) {
        const assetAssignment = (plan, result) => {
            plan.Assets__r.forEach(asset => {
                asset.Usage__r = result.usageMap[asset.Id];
            });
        };
        getPlans({ inputId: id, usageType: type })
        .then(result => {
            const planIdx = this.planData.findIndex((plan) => plan.Id == id);
            if (planIdx == -1) {
                this.planData = result.plans;
                this.planData.forEach(plan => {
                    assetAssignment(plan, result);
                });
            } else {
                this.planData[planIdx] = result.plans[0];
                assetAssignment(this.planData[planIdx], result);
            }
            setTimeout(() => {
                if (planIdx != -1) {
                    this.template.querySelectorAll('c-plan-section')[planIdx].setupButtons(type);
                }
                this.template.querySelectorAll('c-plan-section').forEach(selector => {
                    selector.createChart();
                });
            }, 0);
        })
        .catch(error => {
            this.hasError = true;
            console.error(error);
        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    getNewTypeData(event) {
        this.isLoading = true;
        this.callGetPlans(event.detail.plan, event.detail.value);
    }
}