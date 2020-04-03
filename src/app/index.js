/**
 * WordPress dependencies
 */
const { Component, render, createElement } = wp.element;
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import DocuthequesHeader from './components/header';

class Docutheques extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		return (
			<DocuthequesHeader/>
		);
	}
};

render( <Docutheques />, document.querySelector( '#docutheques' ) );
