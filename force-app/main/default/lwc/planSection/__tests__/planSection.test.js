/* eslint-disable jest/no-conditional-expect */
import { createElement } from "lwc";
import PlanSection from "c/planSection";
import testData from "./data.json";
import "jest-canvas-mock";
// eslint-disable-next-line no-unused-vars
import Chart from "../../../staticresources/ChartJs.js";

describe("c-plan-section", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Testing planSection when it is expanded to ensure that the proper assets cards are being created", async () => {
    // Arrange
    const element = createElement("c-plan-section", {
      is: PlanSection
    });

    // Act
    element.plan = testData.DataPlan;
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
    const buttonGroup = element.shadowRoot.querySelector(
      "lightning-button-group"
    );
    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    const pieChart = element.shadowRoot.querySelector("c-pie-chart");
    const deviceCards = element.shadowRoot.querySelectorAll("c-device-card");
    expect(buttonGroup).not.toBeNull();
    expect(buttons[0].variant).toBe("base");
    expect(buttons[0].iconName).toBe("utility:switch");
    expect(buttons[1].variant).toBe("Brand");
    expect(buttons[2].variant).toBe("Neutral");
    expect(buttons[3].variant).toBe("Neutral");
    expect(pieChart).not.toBeNull();
    expect(deviceCards.length).toBe(testData.DataPlan.Assets__r.length);
    deviceCards.forEach((card, index) => {
      expect(card.asset).toStrictEqual(testData.DataPlan.Assets__r[index]);
    });
  });

  it("Testing planSection when it is compressed to ensure that no assets cards are being created", async () => {
    // Arrange
    const element = createElement("c-plan-section", {
      is: PlanSection
    });

    // Act
    element.plan = testData.DataPlan;
    document.body.appendChild(element);
    const button = element.shadowRoot.querySelector("lightning-button");
    button.click();

    // Assert
    await Promise.resolve();
    const buttonGroup = element.shadowRoot.querySelector(
      "lightning-button-group"
    );
    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    const pieChart = element.shadowRoot.querySelector("c-pie-chart");
    const deviceCards = element.shadowRoot.querySelectorAll("c-device-card");
    expect(buttonGroup).toBeNull();
    expect(buttons[0].variant).toBe("base");
    expect(buttons[0].iconName).toBe("utility:chevronup");
    expect(buttons.length).toBe(1);
    expect(pieChart).toBeNull();
    expect(deviceCards.length).toBe(0);
  });

  it("Testing planSection when different type selected", async () => {
    // Arrange
    const element = createElement("c-plan-section", {
      is: PlanSection
    });

    // Act
    element.plan = testData.DataPlan;
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
    const changeType = new Promise((resolve) => {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        const button =
          element.shadowRoot.querySelectorAll("lightning-button")[2];
        button.click();
        element.completedDataProcessing(testData.TextPlan, "Text");
        resolve();
      }, 1000);
    });

    await changeType
      .then(() => {
        const buttonGroup = element.shadowRoot.querySelector(
          "lightning-button-group"
        );
        const buttons = element.shadowRoot.querySelectorAll("lightning-button");
        const pieChart = element.shadowRoot.querySelector("c-pie-chart");
        const deviceCards =
          element.shadowRoot.querySelectorAll("c-device-card");
        expect(buttonGroup).not.toBeNull();
        expect(buttons[0].variant).toBe("base");
        expect(buttons[0].iconName).toBe("utility:switch");
        expect(buttons[1].variant).toBe("Neutral");
        expect(buttons[2].variant).toBe("Brand");
        expect(buttons[3].variant).toBe("Neutral");
        expect(pieChart).not.toBeNull();
        expect(deviceCards.length).toBe(testData.TextPlan.Assets__r.length);
        deviceCards.forEach((card, index) => {
          expect(card.asset).toStrictEqual(testData.TextPlan.Assets__r[index]);
        });
      })
      .catch((error) => {
        throw error;
      });
  });
});
