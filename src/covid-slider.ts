import { LitElement, html, property, customElement, css } from 'lit-element';

@customElement('covid-slider')
export class CovidSlider extends LitElement {
  static styles = css`
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

  @property({ type: Array }) data = [];
  @property({ type: Number }) minfix = 1;
  @property({ type: Number }) maxfix = 0;
  @property({ type: Number }) min = 1;
  @property({ type: Number }) max = 0;
  @property({ type: Number }) range = 0;
  @property({ type: Number }) width = 0;
  @property({ type: Number }) maxwidth = 100;

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData() {
    fetch(
      `https://covid-api.mmediagroup.fr/v1/cases`
    )
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
        const CountryCases: any = val;
        interface Countrycases {
          country: string; population: number; confirmed: number; recovered: number
        }
        const { country, population, confirmed, recovered }: Countrycases = CountryCases;
        country ? cases.push({ 
          country, 
          population, 
          confirmed,
          recovered
        }) : false;
        country ? minmax.push(confirmed) : false;
      }
    };

    let min = Math.min(...minmax);
    let max = Math.max(...minmax);
    let maxDisplayed = this.max === 0 ? max : this.max;
    this.minfix = min;
    this.maxfix = max;
    this.range = max-min;

    if (!this.data) {
      return html`
        <h4>Loading...</h4>
      `;
    }

    return html`
      <h1>Covid-19 Cases by Country</h1>
      <p>Up to date information on the number of COVID-19 cases.</p>
      
      <div class="slider-container">
        <div class="display-value" style="margin-right:10px">${this.min}</div>
        <div slider id="slider-distance">
          <div>
            <div inverse-left style="width:${this.width}%;"></div>
            <div inverse-right style="width:${100-this.maxwidth}%;"></div>
            <div range style="left:${this.width}%;right:${100-this.maxwidth}%;"></div>
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
        ${cases.filter(country => country.confirmed >= this.min && country.confirmed <= maxDisplayed).map(country => html`
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

  _handleInputMin(e: any) {
    this.min = Math.floor((e.target.value * (this.range) / 100))+this.minfix;
    const width = e.target.value;
    this.width = width;
  }

  _handleInputMax(e: any) {
    this.max = Math.floor((e.target.value * (this.range) / 100))+this.minfix;
    const maxwidth = e.target.value;
    this.maxwidth = maxwidth;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'covid-slider': CovidSlider;
  }
}
