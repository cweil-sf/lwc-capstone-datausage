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
    
    connectedCallback() {
        this.name = this.asset.User__c;
        this.contactNumber = this.asset.Phone_Number_Display__c;
        this.device = this.asset.Name;
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
            this.totalUsage = this.asset.Usage__r.Alloted_Usage__c;
        } else {
            this.totalUsage = 'unlimited';
        }
    }
}