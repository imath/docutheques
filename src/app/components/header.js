/**
 * WordPress dependencies.
 */
const { Component, createElement, Fragment } = wp.element;
const { __ } = wp.i18n;

/**
 * External dependencies.
 */
const { get } = lodash;

class DocuthequesHeader extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		const { user } = this.props;

		return (
			<Fragment>
				<h1 className="wp-heading-inline">{ __( 'Administration des DocuThèques', 'docutheques' ) }</h1>

				{ get( user, ['capabilities', 'upload_files'], false ) && (
					<a href="#" className="page-title-action">
						{ __( 'Ajouter', 'docutheques' ) }
					</a>
				) }

				<hr className="wp-header-end" />
			</Fragment>
		);
	}
};

export default DocuthequesHeader;
