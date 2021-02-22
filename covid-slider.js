var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, property, customElement, css } from 'lit-element';
let CovidSlider = class CovidSlider extends LitElement {
    constructor() {
        super(...arguments);
        this.data = [];
        this.minfix = 1;
        this.maxfix = 0;
        this.min = 1;
        this.max = 0;
        this.range = 0;
        this.width = 0;
        this.maxwidth = 100;
        this.minmax = [];
    }
    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
    }
    fetchData() {
        fetch(`https://covid-api.mmediagroup.fr/v1/cases`)
            .then(res => res.json())
            .then(response => {
            this.data = response;
        })
            .catch(error => console.error("Error:", error));
    }
    render() {
        let cases = [];
        let minmax = [];
        for (const [, value] of Object.entries(this.data)) {
            for (const [, val] of Object.entries(value)) {
                const CountryCases = val;
                const { country, population, confirmed, recovered } = CountryCases;
                country ? cases.push({
                    country,
                    population,
                    confirmed,
                    recovered
                }) : false;
                country ? minmax.push(confirmed) : false;
            }
        }
        ;
        let min = Math.min(...minmax);
        let max = Math.max(...minmax);
        let maxDisplayed = this.max === 0 ? max : this.max;
        this.minfix = min;
        this.maxfix = max;
        this.range = max - min;
        this.minmax = minmax;
        if (!this.data) {
            return html `
        <h4>Loading...</h4>
      `;
        }
        return html `
      <h1>Covid-19 Cases by Country</h1>
      <p>Up to date information on the number of COVID-19 cases.</p>
      
      <div class="slider-container">
        <div class="display-value" style="margin-right:10px">${this.min}</div>
        <div slider id="slider-distance">
          <div>
            <div inverse-left style="width:${this.width}%;"></div>
            <div inverse-right style="width:${100 - this.maxwidth}%;"></div>
            <div range style="left:${this.width}%;right:${100 - this.maxwidth}%;"></div>
            <span thumb style="left:${this.width}%;"></span>
            <span thumb style="left:${this.maxwidth}%;"></span>
          </div>
          <input type="range" value="0" max="100" min="0" step="1" @input='${this._handleInputMin}' />
          <input type="range" value="100" max="100" min="0" step="1" @input='${this._handleInputMax}' />
        </div>
        <div class="display-value" style="margin-left:10px">${maxDisplayed}</div>
      </div>

      <table>
        <tr>
          <th style='text-align: left'>Country</th>
          <th>Population</th>
          <th>Cases</th>
          <th>Recovered</th>
        </tr>
        ${cases.filter(country => country.confirmed >= this.min && country.confirmed <= maxDisplayed).map(country => html `
          <tr>
            <td style='text-align: left'>${country.country}</td>
            <td>${country.population}</td>
            <td>${country.confirmed}</td>
            <td>${country.recovered}</td>
          </tr>
        `)}
      </table>
    `;
    }
    _handleInputMin(e) {
        e.target.value = Math.min(e.target.value, this.maxwidth - 1);
        const value = e.target.value;
        const arr = this.minmax.sort((a, b) => a - b);
        const idx = value > 0 ? Math.floor(arr.length / 100 * value) - 1 : 0;
        this.min = arr[idx];
        const width = value;
        this.width = width;
    }
    _handleInputMax(e) {
        e.target.value = Math.max(e.target.value, this.width - (-1));
        const value = e.target.value;
        const arr = this.minmax.sort((a, b) => a - b);
        const idx = value > 0 ? Math.ceil(arr.length / 100 * value) - 1 : 0;
        this.max = arr[idx];
        const maxwidth = value;
        this.maxwidth = maxwidth;
    }
};
CovidSlider.styles = css `
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
    }

    .slider-container {
      display: flex;
      align-items: center;
      margin: 20px 0;
    }

    [slider] {
      width: 80%;
      position: relative;
      height: 5px;
    }
    
    [slider] > div {
      position: absolute;
      left: 13px;
      right: 15px;
      height: 5px;
    }
    [slider] > div > [inverse-left] {
      position: absolute;
      left: 0;
      height: 5px;
      border-radius: 10px;
      background-color: #CCC;
      margin: 0 7px;
    }
    
    [slider] > div > [inverse-right] {
      position: absolute;
      right: 0;
      height: 5px;
      border-radius: 10px;
      background-color: #CCC;
      margin: 0 7px;
    }
    
    
    [slider] > div > [range] {
      position: absolute;
      left: 0;
      height: 5px;
      border-radius: 14px;
      background-color: #d02128;
    }
    
    [slider] > div > [thumb] {
      position: absolute;
      top: -7px;
      z-index: 2;
      height: 20px;
      width: 20px;
      text-align: left;
      margin-left: -11px;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
      background-color: #FFF;
      border-radius: 50%;
      outline: none;
    }
    
    [slider] > input[type=range] {
      position: absolute;
      pointer-events: none;
      -webkit-appearance: none;
      z-index: 3;
      height: 14px;
      top: -2px;
      width: 100%;
      opacity: 0;
    }
    
    div[slider] > input[type=range]:focus::-webkit-slider-runnable-track {
      background: transparent;
      border: transparent;
    }
    
    div[slider] > input[type=range]:focus {
      outline: none;
    }
    
    div[slider] > input[type=range]::-webkit-slider-thumb {
      pointer-events: all;
      width: 28px;
      height: 28px;
      border-radius: 0px;
      border: 0 none;
      background: red;
      -webkit-appearance: none;
    }

    .display-value {
      color: #333;
      font-size: 12px;
      font-weight: bold;
      padding: 5px 8px;
      width: 60px;
      height: 14px;
      text-align: right;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: inset 0 0 5px #d6d6d6d6;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
    }

    td, th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
      text-align: center;
    }

    tr:nth-child(even) {
      background-color: #dddddd;
    }
  `;
__decorate([
    property({ type: Array })
], CovidSlider.prototype, "data", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "minfix", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "maxfix", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "max", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "range", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "width", void 0);
__decorate([
    property({ type: Number })
], CovidSlider.prototype, "maxwidth", void 0);
__decorate([
    property({ type: Array })
], CovidSlider.prototype, "minmax", void 0);
CovidSlider = __decorate([
    customElement('covid-slider')
], CovidSlider);
export { CovidSlider };
//# sourceMappingURL=covid-slider.js.map