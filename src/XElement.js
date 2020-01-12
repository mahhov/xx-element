class XElement extends HTMLElement {
	static get attributeTypes() {
		return {};
		/* override */
	}

	static get htmlTemplate() {
		return '';
		/* override */
	}

	static get observedAttributes() {
		return Object.keys(this.attributeTypes)
			.map(propName => XElement.propToAttribName_(propName));
	}

	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = this.constructor.htmlTemplate;

		let properties = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
		Object.entries(this.constructor.attributeTypes).forEach(([propName, {boolean, allowRedundantAssignment}]) => {
			let attribName = XElement.propToAttribName_(propName);
			Object.defineProperty(this, XElement.setterName_(propName), properties[propName] || {set: () => 0});
			Object.defineProperty(this, propName, boolean ? {
				get: () => this.hasAttribute(attribName),
				set: value => {
					if (allowRedundantAssignment || !value === this.hasAttribute(attribName))
						if (value)
							this.setAttribute(attribName, '');
						else
							this.removeAttribute(attribName);
				}
			} : {
				get: () => this.getAttribute(attribName),
				set: value => {
					if (allowRedundantAssignment || value !== this.getAttribute(attribName))
						this.setAttribute(attribName, value);
				}
			});
		});

	}

	attributeChangedCallback(attribName, oldValue, newValue) {
		let propName = XElement.attribToPropName_(attribName);
		this[XElement.setterName_(propName)] = this[propName];
	}

	$(query) {
		return this.shadowRoot.querySelector(query);
	}

	$$(query) {
		return this.shadowRoot.querySelectorAll(query);
	}

	clearChildren(query) {
		XElement.clearChildren(this.$(query));
	}

	static clearChildren(element) {
		while (element.firstChild)
			element.removeChild(element.firstChild);
	}

	emit(eventName, detail, otherEventParams) {
		this.dispatchEvent(new CustomEvent(eventName, {detail, ...otherEventParams}))
	}

	static propToAttribName_(propName) {
		return propName.replace(/[A-Z]/g, a => `-${a.toLowerCase()}`);
	}

	static attribToPropName_(attribName) {
		return attribName.replace(/-(.)/g, (_, a) => a.toUpperCase());
	}

	static setterName_(propName) {
		return `xel2_${propName}_`;
	}
}

module.exports = XElement;
