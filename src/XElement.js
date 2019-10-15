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
		Object.entries(this.constructor.attributeTypes).forEach(([propName, boolean]) => {
			let attribName = XElement.propToAttribName_(propName);
			Object.defineProperty(this, XElement.setterName_(propName), properties[propName] || {set: () => 0});
			Object.defineProperty(this, propName, boolean ? {
				get: () => this.hasAttribute(attribName),
				set: value => value ?
					this.setAttribute(attribName, '') :
					this.removeAttribute(attribName)
			} : {
				get: () => this.getAttribute(attribName),
				set: value => this.setAttribute(attribName, value)
			});
		});

	}

	attributeChangedCallback(attribName, oldValue, newValue) {
		let propName = XElement.attribToPropName_(attribName);
		if (this.constructor.attributeTypes[propName])
			this[XElement.setterName_(propName)] = this.hasAttribute(attribName);
		else
			this[XElement.setterName_(propName)] = newValue;
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

	emit(eventName, detail) {
		this.dispatchEvent(new CustomEvent(eventName, {detail}))
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
