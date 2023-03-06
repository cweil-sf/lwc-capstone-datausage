import { LightningElement, api } from 'lwc';
import getPlans from '@salesforce/apex/deviceUsageController.getPlans';

export default class DataUsage extends LightningElement {
    @api recordId;

    type = 'Data';
    dataButtonVariant = 'Brand';
    textButtonVariant = 'Neutral';
    talkButtonVariant = 'Neutral';

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
        getPlans({ billingAccountId: this.recordId, usageType: this.type })
        .then(result => {
            this.planData = result.plans;
            this.planData.forEach(plan => {
                plan.Assets__r.forEach(asset => {
                    asset.Usage__r = result.usageMap[asset.Id];
                });
            });
            this.isLoading = false;
        })
        .catch(error => {
            this.hasError = true;
            this.isLoading = false;
        });
    }

    setTypeData() {
        this.isLoading = true;
        this.type = 'Data';
        this.dataButtonVariant = 'Brand';
        this.textButtonVariant = 'Neutral';
        this.talkButtonVariant = 'Neutral';
        this.callGetPlans();
    }

    setTypeText() {
        this.isLoading = true;
        this.type = 'Text';
        this.dataButtonVariant = 'Neutral';
        this.textButtonVariant = 'Brand';
        this.talkButtonVariant = 'Neutral';
        this.callGetPlans();
    }

    setTypeTalk() {
        this.isLoading = true;
        this.type = 'Talk';
        this.dataButtonVariant = 'Neutral';
        this.textButtonVariant = 'Neutral';
        this.talkButtonVariant = 'Brand';
        this.callGetPlans();
    }
}