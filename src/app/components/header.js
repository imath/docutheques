/**
 * WordPress dependencies
 */
const { Component, createElement, Fragment } = wp.element;
const { __ } = wp.i18n;

class DocuthequesHeader extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		return (
			<Fragment>
				<h1 className="wp-heading-inline">{ __( 'Administration des DocuThèques', 'docutheques' ) }</h1>
				<hr className="wp-header-end"></hr>
			</Fragment>
		);
	}
};

export default DocuthequesHeader;
