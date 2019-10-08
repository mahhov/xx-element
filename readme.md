# XElement

Convenience class for creating custom HTML elements.

## Toggle button example

```html
<style>
	:host {
		display: flex;
	}

	label {
		display: flex;
	}

	input:checked ~ .toggle-off {
		display: none
	}

	input:not(:checked) ~ .toggle-on {
		display: none
	}
</style>

<label>
    <span id="title"></span>
	<input id="checkbox" type="checkbox" hidden>
	<slot name="toggle-on" class="toggle-on"></slot>
	<slot name="toggle-off" class="toggle-off"></slot>
</label>
```

```js
const {XElement} = require('xx-element');
const template = require('fs').readFileSync(`${__dirname}/toggle.html`, 'utf8');

customElements.define('x-toggle', class extends XElement {
	static get attributeTypes() {
		return {title: false, checked: true};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.$('#checkbox').addEventListener('change', () => {
			this.checked = this.$('#checkbox').checked;
            this.dispatchEvent(new CustomEvent('change', {detail: this.checked}));
		});
		this.$('label').addEventListener('click', e => e.stopPropagation());
	}

	set title(value) {
		this.$('#title').textContent = value;
	}
	
	set checked(value) {
		this.$('#checkbox').checked = value;
	}
});
```

## Usage

- Create a class extending XElement.
- Override the static getter methods `{...[attribute: isBoolean]} attributeTypes` and `string htmlTemplate`.
- Add setter methods for each attribute.

## Helpers

The `XElement` base class provides 3 helper functions:

- `$(selector)` invokes to `querySelector` on the XElement's `shadowRoot`.
- `$$(selector)` invokes to `querySelectorAll` on the XElement's `shadowRoot`.
- `clearChildren()` and `XElement.clearChildren(el)` clear the children elements of the XElement or an arbitrary element respectively.

## importUtils

`importUtils` provides a function to help fetch the custom element names and templates. To use, simply replace first 3 lines from the above example to:

```js
const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);

customElements.define(name, class extends XElement  {
    ...
```
