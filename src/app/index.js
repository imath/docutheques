/**
 * WordPress dependencies
 */
const { Component, render, createElement } = wp.element;
const { __ } = wp.i18n;

class Docutheques extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		return (
		<p>{ __( 'DocuThèques', 'docutheques' ) }</p>
		);
	}
};

render( <Docutheques />, document.querySelector( '#docutheques' ) );
