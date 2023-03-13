import { createElement } from 'lwc';
import PieChart from 'c/pieChart';
import testData from "./data.json";
import 'jest-canvas-mock';
// eslint-disable-next-line no-unused-vars
import Chart from '../../../staticresources/ChartJs.js';

describe('c-pie-chart', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('Pie Chart Generation', async () => {
        // Arrange
        const element = createElement('c-pie-chart', {
            is: PieChart
        });

        // Act
        document.body.appendChild(element);
        element.createChart(testData.Assets, testData.ColorMap);

        // Assert
        await Promise.resolve();
        const canvas = element.shadowRoot.querySelector('canvas');
        expect(Object.getPrototypeOf(canvas)).toBeTruthy();
    });
});