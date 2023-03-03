import { LightningElement, api } from 'lwc';

export default class DeviceCard extends LightningElement {
    @api asset;

    name;
    contactNumber;
    icon;
    device;
    usage;
    totalUsage;

    nearLimit = false;
    overLimit = false;
    
    renderedCallback() {
        this.name = this.asset.User__c;
        this.contactNumber = this.asset.Phone_Number_Display__c;
        this.device = this.asset.Make_and_Model__c;
        this.usage = this.asset.Usage__r.Current_Usage__c;
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
        if (!this.asset.Unlimited_Data__c) {
            this.totalUsage = this.asset.Usage__r.Allotted_Usage__c;
            if (this.usage / this.totalUsage >= 1) {
                this.overLimit = true;
            } else if (this.usage / this.totalUsage > 0.9) {
                this.nearLimit = true;
            }
        } else {
            this.totalUsage = 'unlimited';
        }
    }
}