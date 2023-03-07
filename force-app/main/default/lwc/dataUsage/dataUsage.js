import { LightningElement, api } from 'lwc';
import getPlans from '@salesforce/apex/deviceUsageController.getPlans';
import getUpdatedPlans from '@salesforce/apex/deviceUsageController.getUpdatedPlans';

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
        this.callGetPlans();
    }

    callGetPlans() {
        this.planData = [];
        getPlans({ billingAccountId: this.recordId, usageType: 'Data' })
        .then(result => {
            this.planData = result.plans;
            this.planData.forEach(plan => {
                plan.Assets__r.forEach(asset => {
                    asset.Usage__r = result.usageMap[asset.Id];
                });
            });
        })
        .catch(error => {
            this.hasError = true;
        })
        .finally(() => {
            this.isLoading = false;
            setTimeout(() => {
                this.template.querySelectorAll('c-plan-section').forEach(selector => {
                    selector.createChart();
                });
            }, 0);
        });
    }

    getNewTypeData(event) {
        this.isLoading = true;
        let planIdx = -1;
        getUpdatedPlans({ planId: event.detail.plan, usageType: event.detail.value })
        .then(result => {
            planIdx = this.planData.findIndex((plan) => plan.Id == event.detail.plan);
            if (planIdx == -1) {
                throw new Error('Error retrieving plan information');
            }
            this.planData[planIdx] = result.plans[0];
            this.planData[planIdx].Assets__r.forEach(asset => {
                asset.Usage__r = result.usageMap[asset.Id];
            });
        })
        .catch(error => {
            this.hasError = true;
        })
        .finally(() => {
            this.isLoading = false;
            setTimeout(() => {
                this.template.querySelectorAll('c-plan-section')[planIdx].setupButtons(event.detail.value);
                this.template.querySelectorAll('c-plan-section').forEach(selector => {
                    selector.createChart();
                });
            }, 0);
        });
    }
}