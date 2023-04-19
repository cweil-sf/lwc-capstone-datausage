import { LightningElement, api } from "lwc";

const COLORS = [
  "#003366",
  "#003399",
  "#0033CC",
  "#336699",
  "#006699",
  "#0066CC",
  "#3399CC",
  "#0099CC",
  "#66CCCC",
  "#6699CC",
  "#3366FF",
  "#0000FF"
];

export default class PlanSection extends LightningElement {
  @api plan;

  planAssets;
  privatePlan = {};

  type = "Data";
  colorMap = {};
  expanded = true;
  icon = "utility:switch";
  isLoading = true;

  dataButtonVariant = "Brand";
  textButtonVariant = "Neutral";
  talkButtonVariant = "Neutral";

  get hasData() {
    if (this.privatePlan.Assets__r) {
      if (this.privatePlan.Assets__r.length) {
        return this.privatePlan.Assets__r.length > 0;
      }
    }
    return false;
  }

  connectedCallback() {
    this.completedDataProcessing(this.plan, this.type);
  }

  renderedCallback() {
    if (!this.isLoading && this.expanded) {
      this.template
        .querySelectorAll(".custom-border")
        .forEach((selector, index) => {
          selector.style.borderLeftColor = COLORS[index % COLORS.length];
        });
      this.template
        .querySelector("c-pie-chart")
        .createChart(this.planAssets, this.colorMap);
    }
  }

  @api
  completedDataProcessing(plan, type) {
    this.privatePlan = plan;
    this.planAssets = this.privatePlan.Assets__r;
    this.planAssets.forEach((asset, index) => {
      this.colorMap[asset.Id] = COLORS[index % COLORS.length];
    });
    this.type = type;
    this.setButtonVariants();
    this.isLoading = false;
  }

  toggleSection() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.icon = "utility:switch";
      this.completedDataProcessing(this.privatePlan, this.type);
    } else {
      this.icon = "utility:chevronright";
    }
  }

  setType(event) {
    this.isLoading = true;

    const typeEvent = new CustomEvent("typeselect", {
      detail: {
        plan: this.plan.Id,
        value: event.target.value
      }
    });
    this.dispatchEvent(typeEvent);
  }

  setButtonVariants() {
    switch (this.type) {
      case "Data":
        this.dataButtonVariant = "Brand";
        this.textButtonVariant = "Neutral";
        this.talkButtonVariant = "Neutral";
        break;
      case "Text":
        this.dataButtonVariant = "Neutral";
        this.textButtonVariant = "Brand";
        this.talkButtonVariant = "Neutral";
        break;
      case "Talk":
        this.dataButtonVariant = "Neutral";
        this.textButtonVariant = "Neutral";
        this.talkButtonVariant = "Brand";
        break;
      default:
        this.dataButtonVariant = "Brand";
        this.textButtonVariant = "Neutral";
        this.talkButtonVariant = "Neutral";
    }
  }

  dispatchErrorEvent() {
    const errorEvent = new CustomEvent("error");
    this.dispatchEvent(errorEvent);
  }
}
