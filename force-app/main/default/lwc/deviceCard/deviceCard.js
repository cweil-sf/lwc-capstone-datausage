import { LightningElement, api } from 'lwc';

export default class DeviceCard extends LightningElement {
    @api asset;

    usageToUse;

    name;
    contactNumber;
    icon;
    device;
    usage;
    unitOfMeasure;
    totalUsage;

    nearLimit = false;
    overLimit = false;

    type = 'Data';
    
    renderedCallback() {
        this.asset.Usage__r.forEach(usage => {
            if (usage.Usage_Type__c == this.type) {
                this.usageToUse = usage;
                return;
            }
        })
        this.name = this.asset.User__c;
        this.contactNumber = this.asset.Phone_Number_Display__c;
        this.device = this.asset.Make_and_Model__c;
        this.usage = this.usageToUse.Current_Usage__c;
        this.unitOfMeasure = this.usageToUse.Unit_of_Measure__c;
        this.setIcon();
        this.determineUsageLimit();
    }

    setIcon() {
        switch(this.asset.Device_Type__c) {
            case 'Phone':
                this.icon = 'utility:phone_portrait';
                break;
            case 'Tablet':
                this.icon = 'utility:tablet_portrait';
                break;
            case 'Wearable':
                this.icon = 'utility:clock';
                break;
            default:
                this.icon = 'utility:help';
        }
    }

    determineUsageLimit() {
        switch (this.type) {
            case 'Data':
                if (this.asset.Unlimited_Data__c) {
                    this.totalUsage = 'unlimited';
                } else {
                    this.totalUsageCalculation();
                }
                break;
            case 'Talk':
                if (this.asset.Unlimited_Talk__c) {
                    this.totalUsage = 'unlimited';
                } else {
                    this.totalUsageCalculation();
                }
                break;
            case 'Text':
                if (this.asset.Unlimited_Text__c) {
                    this.totalUsage = 'unlimited';
                } else {
                    this.totalUsageCalculation();
                }
                break;
            default:
                this.totalUsage = 'error';
        }
        if (!this.asset.Unlimited_Data__c) {
            
        } else {
            this.totalUsage = 'unlimited';
        }
    }

    totalUsageCalculation() {
        this.totalUsage = this.usageToUse.Allotted_Usage__c;
        if (this.usage / this.totalUsage >= 1) {
            this.overLimit = true;
        } else if (this.usage / this.totalUsage > 0.9) {
            this.nearLimit = true;
        }
    }
}