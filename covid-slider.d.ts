import { LitElement } from 'lit-element';
export declare class CovidSlider extends LitElement {
    static styles: import("lit-element").CSSResult;
    data: never[];
    minfix: number;
    maxfix: number;
    min: number;
    max: number;
    range: number;
    width: number;
    maxwidth: number;
    connectedCallback(): void;
    fetchData(): void;
    render(): import("lit-element").TemplateResult;
    _handleInputMin(e: any): void;
    _handleInputMax(e: any): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'covid-slider': CovidSlider;
    }
}
//# sourceMappingURL=covid-slider.d.ts.map