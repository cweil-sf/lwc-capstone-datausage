import { createElement } from "lwc";
import DeviceCard from "c/deviceCard";
import testData from "./data.json";

describe("c-device-card", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("Device Card for Phone with Unlimited Data", async () => {
    // Arrange
    const element = createElement("c-device-card", {
      is: DeviceCard
    });

    // Act
    element.asset = testData.Phone;
    element.type = "Data";
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
      const icon = element.shadowRoot.querySelector("lightning-icon");
      const strongs = element.shadowRoot.querySelectorAll("strong");
      const ps = element.shadowRoot.querySelectorAll("p");
      const helptext = element.shadowRoot.querySelector("lightning-helptext");
      expect(icon.src).toBe("UsagePhone#icon");
      expect(strongs[0].textContent).toBe(testData.Phone.User__c);
      expect(ps[0].textContent).toBe(testData.Phone.Phone_Number_Display__c);
      expect(strongs[1].textContent).toBe(testData.Phone.Make_and_Model__c);
      expect(ps[1].textContent).toContain(
          "" + testData.Phone.Usage__r.Current_Usage__c
      );
      expect(ps[1].textContent).toContain(testData.Phone.Usage__r.Unit_of_Measure__c);
      expect(ps[1].textContent).toContain("unlimited");
      expect(helptext).toBe(null);
  });

  it("Device Card for Tablet with Limited SMS", async () => {
    // Arrange
    const element = createElement("c-device-card", {
      is: DeviceCard
    });

    // Act
    element.asset = testData.Tablet;
    element.type = "Text";
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
      const icon = element.shadowRoot.querySelector("lightning-icon");
      const strongs = element.shadowRoot.querySelectorAll("strong");
      const ps = element.shadowRoot.querySelectorAll("p");
      const helptext = element.shadowRoot.querySelector("lightning-helptext");
      expect(icon.src).toBe("UsageTablet#icon");
      expect(strongs[0].textContent).toBe(testData.Tablet.User__c);
      expect(ps[0].textContent).toBe(testData.Tablet.Phone_Number_Display__c);
      expect(strongs[1].textContent).toBe(testData.Tablet.Make_and_Model__c);
      expect(ps[1].textContent).toContain(
          "" + testData.Tablet.Usage__r.Current_Usage__c
      );
      expect(ps[1].textContent).toContain(testData.Tablet.Usage__r.Unit_of_Measure__c);
      expect(ps[1].textContent).toContain("" + testData.Tablet.Usage__r.Allotted_Usage__c);
      expect(helptext.content).toBe("Over Limit");
  });

  it("Device Card for Watch with Limited Minutes", async () => {
    // Arrange
    const element = createElement("c-device-card", {
      is: DeviceCard
    });

    // Act
    element.asset = testData.Watch;
    element.type = "Talk";
    document.body.appendChild(element);

    // Assert
    await Promise.resolve();
      const icon = element.shadowRoot.querySelector("lightning-icon");
      const strongs = element.shadowRoot.querySelectorAll("strong");
      const ps = element.shadowRoot.querySelectorAll("p");
      const helptext = element.shadowRoot.querySelector("lightning-helptext");
      expect(icon.src).toBe("UsageWatch#icon");
      expect(strongs[0].textContent).toBe(testData.Watch.User__c);
      expect(ps[0].textContent).toBe(testData.Watch.Phone_Number_Display__c);
      expect(strongs[1].textContent).toBe(testData.Watch.Make_and_Model__c);
      expect(ps[1].textContent).toContain(
          "" + testData.Watch.Usage__r.Current_Usage__c
      );
      expect(ps[1].textContent).toContain(testData.Watch.Usage__r.Unit_of_Measure__c);
      expect(ps[1].textContent).toContain("" + testData.Watch.Usage__r.Allotted_Usage__c);
      expect(helptext.content).toBe("Near Limit");
  });
});
