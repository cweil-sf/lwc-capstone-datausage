import { LightningElement, api } from 'lwc';

const COLORS = ['#96F2EE', '#68CEEE', '#2D9CED', '#0E6ECE', '#073E92', '#051C61'];

export default class PlanSection extends LightningElement {
    @api plan;

    planAssets;

    type = 'Data';
    colorMap = {};
    expanded = true;
    icon = "utility:switch";

    dataButtonVariant = 'Brand';
    textButtonVariant = 'Neutral';
    talkButtonVariant = 'Neutral';

    get hasData() {
        if(this.plan.Assets__r.length) {
            return this.plan.Assets__r.length > 0;
        }
        return false;
    }

    renderedCallback() {
        this.planAssets = this.plan.Assets__r;
        this.planAssets.forEach((asset, index) => {
            this.colorMap[asset.Id] = COLORS[index % COLORS.length];
        });
        this.template.querySelectorAll('.custom-border').forEach((selector, index) => {
            selector.style.borderLeftColor = COLORS[index % COLORS.length];
        });
    }

    toggleSection() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.icon = "utility:switch";
            setTimeout(() => {
                this.createChart();
            }, 0);
        } else {
            this.icon = "utility:chevronup";
        }
    }

    @api
    createChart(){
        this.template.querySelector('c-pie-chart').createChart(this.planAssets, this.colorMap);
    }

    @api
    setupButtons(type) {
        this.type = type;
        this.setButtonVariants();
    }

    setType(event) {
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