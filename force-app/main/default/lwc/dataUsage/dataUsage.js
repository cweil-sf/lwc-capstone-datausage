import { LightningElement, api } from "lwc";
import getPlans from "@salesforce/apex/DeviceUsageController.getPlans";

export default class DataUsage extends LightningElement {
  @api recordId;

  hasError = false;
  planData = [];

  get hasData() {
    if (this.planData){
      return this.planData.length > 0;
    }
    return false;
    
  }

  connectedCallback() {
    this.callGetPlans(this.recordId, "Data");
  }

  callGetPlans(id, type) {
    const assetAssignment = (plan, result) => {
      plan.Assets__r.forEach((asset) => {
        asset.Usage__r = result.usageMap[asset.Id];
      });
    };
    getPlans({ inputId: id, usageType: type })
      .then((result) => {
        const planIdx = this.planData.findIndex((plan) => plan.Id === id);
        if (planIdx === -1) {
          this.planData = result.plans;
          this.planData.forEach((plan) => {
            assetAssignment(plan, result);
          });
        } else {
          this.planData[planIdx] = result.plans[0];
          assetAssignment(this.planData[planIdx], result);
          this.template
            .querySelectorAll("c-plan-section")[planIdx].completedDataProcessing(
              this.planData[planIdx],
              type
            );
        }
      })
      .catch(() => {
        this.hasError = true;
      });
  }

  getNewTypeData(event) {
    this.callGetPlans(event.detail.plan, event.detail.value);
  }
}
