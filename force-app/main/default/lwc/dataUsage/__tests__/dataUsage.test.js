/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from "lwc";
import DataUsage from "c/dataUsage";
import testData from "./data.json";
import getPlans from "@salesforce/apex/DeviceUsageController.getPlans";

jest.mock(
  "@salesforce/apex/DeviceUsageController.getPlans",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

describe("c-data-usage", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("Data Usage Parent Success Test", async () => {
    // Arrange
    getPlans.mockResolvedValue(testData);
    const element = createElement("c-data-usage", {
      is: DataUsage
    });

    // Act
    element.recordId = "Test";
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
    const details = new Promise((resolve) => {
      setTimeout(() => {
        const planSections =
          element.shadowRoot.querySelectorAll("c-plan-section");
        resolve(planSections);
      }, 1000);
    });
    details.then((planSections) => {
      expect(planSections).not.toBeNull();
      expect(planSections[0].key).toBe(testData[0].Id);
    });
  });

  it("Data Usage Parent Get New Type Test", async () => {
    // Arrange
    getPlans.mockResolvedValue(testData);
    const element = createElement("c-data-usage", {
      is: DataUsage
    });

    // Act
    element.recordId = "Test";
    document.body.appendChild(element);
    const event = new CustomEvent("typeselect", {
      detail: {
        plan: "Test",
        value: "Text"
      }
    });
    getPlans.mockResolvedValue([]);
    dispatchEvent(event);
    // Assert
    await Promise.resolve();
    const details = new Promise((resolve) => {
      setTimeout(() => {
        const planSections = element.shadowRoot.querySelector("c-plan-section");
        const message = element.shadowRoot.querySelectorAll("h3");
        resolve(planSections, message);
      }, 1000);
    });
    details.then((planSection, message) => {
      expect(planSection).toBeNull();
      expect(message.text).toBe(
        "Usage is not available. Please refresh or check back later."
      );
    });
  });

  it("Data Usage Parent Failure Test", async () => {
    // Arrange
    getPlans.mockRejectedValue("error");
    const element = createElement("c-data-usage", {
      is: DataUsage
    });

    // Act
    element.recordId = "Test";
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
    const details = new Promise((resolve) => {
      setTimeout(() => {
        const message = element.shadowRoot.querySelector("h3");
        resolve(message);
      }, 1000);
    });
    details.then((message) => {
      expect(message.textContent).toBe(
        "An unexpected error occurred while retrieving the usage. Please refresh or report the issue."
      );
    });
  });

  it("Data Usage Parent No Data Test", async () => {
    // Arrange
    getPlans.mockResolvedValue([]);
    const element = createElement("c-data-usage", {
      is: DataUsage
    });

    // Act
    element.recordId = "Test";
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
    const message = element.shadowRoot.querySelector("h3");
    expect(message.textContent).toBe(
      "Usage is not available. Please refresh or check back later."
    );
  });
});
