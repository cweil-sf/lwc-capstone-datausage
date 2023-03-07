import { LightningElement, api } from 'lwc';

const COLORS = ['#96F2EE', '#68CEEE', '#2D9CED', '#0E6ECE', '#073E92', '#051C61'];

export default class PlanSection extends LightningElement {
    @api plan;

    planAssets;

    type = 'Data';
    colorMap = {};
    expanded = true;
    icon = "utility:switch";
    isLoading = true;

    dataButtonVariant = 'Brand';
    textButtonVariant = 'Neutral';
    talkButtonVariant = 'Neutral';

    get hasData() {
        if(this.plan.Assets__r.length) {
            return this.plan.Assets__r.length > 0;
        }
        return false;
    }

    connectedCallback(){
        this.completedDataProcessing(this.plan, this.type);
    }

    @api
    completedDataProcessing(plan, type) {
        this.isLoading = false;
        this.plan = plan;
        this.planAssets = this.plan.Assets__r;
        this.planAssets.forEach((asset, index) => {
            this.colorMap[asset.Id] = COLORS[index % COLORS.length];
        });
        this.type = type;
        this.setButtonVariants();
        setTimeout(() => {
            this.template.querySelectorAll('.custom-border').forEach((selector, index) => {
                selector.style.borderLeftColor = COLORS[index % COLORS.length];
            });
            this.template.querySelector('c-pie-chart').createChart(this.planAssets, this.colorMap);
        }, 0);
    }

    toggleSection() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.icon = "utility:switch";
            this.completedDataProcessing(this.plan, this.type);
        } else {
            this.icon = "utility:chevronup";
        }
    }

    setType(event) {
        this.isLoading = true;
        this.type = event.target.value;
        this.setButtonVariants();

        const typeEvent = new CustomEvent('typeselect', {
            detail: {
                plan: this.plan.Id,
                value: event.target.value
            }
        });
        this.dispatchEvent(typeEvent);
    }

    setButtonVariants(){
        switch(this.type) {
            case 'Data':
                this.dataButtonVariant = 'Brand';
                this.textButtonVariant = 'Neutral';
                this.talkButtonVariant = 'Neutral';
                break;
            case 'Text':
                this.dataButtonVariant = 'Neutral';
                this.textButtonVariant = 'Brand';
                this.talkButtonVariant = 'Neutral';
                break;
            case 'Talk':
                this.dataButtonVariant = 'Neutral';
                this.textButtonVariant = 'Neutral';
                this.talkButtonVariant = 'Brand';
                break;
            default:
                this.dataButtonVariant = 'Brand';
                this.textButtonVariant = 'Neutral';
                this.talkButtonVariant = 'Neutral';
        }
    }
}