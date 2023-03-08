import { LightningElement, api } from "lwc";

import usagePhone from "@salesforce/resourceUrl/UsagePhone";
import usageTablet from "@salesforce/resourceUrl/UsageTablet";
import usageWatch from "@salesforce/resourceUrl/UsageWatch";

export default class DeviceCard extends LightningElement {
  @api asset;
  @api colorMap;
  @api type;

  name;
  contactNumber;
  icon;
  device;
  usage;
  unitOfMeasure;
  totalUsage;

  nearLimit = false;
  overLimit = false;

  renderedCallback() {
    this.name = this.asset.User__c;
    this.contactNumber = this.asset.Phone_Number_Display__c;
    this.device = this.asset.Make_and_Model__c;
    this.usage = this.asset.Usage__r.Current_Usage__c;
    this.unitOfMeasure = this.asset.Usage__r.Unit_of_Measure__c;
    this.setIcon();
    this.determineUsageLimit();
  }

  setIcon() {
    switch (this.asset.Device_Type__c) {
      case "Phone":
        this.icon = usagePhone + "#icon";
        break;
      case "Tablet":
        this.icon = usageTablet + "#icon";
        break;
      case "Wearable":
        this.icon = usageWatch + "#icon";
        break;
      default:
        this.icon = "utility:help";
    }
  }

  determineUsageLimit() {
    switch (this.type) {
      case "Data":
        if (this.asset.Unlimited_Data__c) {
          this.totalUsage = "unlimited";
        } else {
          this.totalUsageCalculation();
        }
        break;
      case "Talk":
        if (this.asset.Unlimited_Talk__c) {
          this.totalUsage = "unlimited";
        } else {
          this.totalUsageCalculation();
        }
        break;
      case "Text":
        if (this.asset.Unlimited_Text__c) {
          this.totalUsage = "unlimited";
        } else {
          this.totalUsageCalculation();
        }
        break;
      default:
        this.totalUsage = "error";
    }
  }

  totalUsageCalculation() {
    this.totalUsage = this.asset.Usage__r.Allotted_Usage__c;
    if (this.usage / this.totalUsage >= 1) {
      this.overLimit = true;
    } else if (this.usage / this.totalUsage > 0.9) {
      this.nearLimit = true;
    }
  }
}
