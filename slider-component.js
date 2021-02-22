var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement } from 'lit-element';
let SliderComponent = class SliderComponent extends LitElement {
    render() {
        return html `
        <div data-role="main" class="ui-content">
            <form method="post" action="/action_page_post.php">
            <div data-role="rangeslider">
                <label for="price-min">Price:</label>
                <input type="range" name="price-min" id="price-min" value="200" min="0" max="1000">
                <label for="price-max">Price:</label>
                <input type="range" name="price-max" id="price-max" value="800" min="0" max="1000">
            </div>
                <input type="submit" data-inline="true" value="Submit">
                <p>The range slider can be useful for allowing users to select a specific price range when browsing products.</p>
            </form>
        </div>
        `;
    }
};
SliderComponent = __decorate([
    customElement('slider-component')
], SliderComponent);
export { SliderComponent };
//# sourceMappingURL=slider-component.js.map