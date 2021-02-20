import { LitElement, html, property, customElement, css } from 'lit-element';

@customElement('covid-slider')
export class CovidSlider extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
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
      }
    };
    if (!this.data) {
      return html`
        <h4>Loading...</h4>
      `;
    }
    return html`
      <h1>Covid-19 Cases by Country</h1>
      <p>Up to date information on the number of COVID-19 cases.</p>
      <div id='slider'></div>
      <table>
        <tr>
          <th id='test' style='text-align: left'>Country</th>
          <th>Population</th>
          <th>Cases</th>
          <th>Recovered</th>
        </tr>
        ${cases.filter(country => country.confirmed > 100000 && country.confirmed < 200000).map(country => html`
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
}

declare global {
  interface HTMLElementTagNameMap {
    'covid-slider': CovidSlider;
  }
}