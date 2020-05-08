/**
 * WordPress dependencies.
 */
const { Component, createElement, Fragment } = wp.element;
const { DropdownMenu } = wp.components;
const { __ } = wp.i18n;
const { dispatch } = wp.data;

/**
 * External dependencies.
 */
const { get } = lodash;

/**
 * Internal dependencies.
 */
import DocuthequesGuide from './guide';

class DocuthequesHeader extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	setCurrentState( currentState ) {
		dispatch( 'docutheques' ).setCurrentState( currentState );

		if ( 'documentForm' === currentState ) {
			dispatch( 'docutheques' ).resetUploads();
		}
	}

	render() {
		const { user, isAdvancedEditMode, dossier } = this.props;
		let docuthequesActions = [];

		if ( get( user, ['capabilities', 'manage_categories'], false ) ) {
			docuthequesActions = [ {
				title: 0 === dossier ? __( 'Ajouter une DocuThèque', 'docutheques' ) : __( 'Ajouter un dossier', 'docutheques' ),
				icon: 0 === dossier ? 'portfolio' : 'category',
				onClick: () => this.setCurrentState( 'dossierForm' ),
			}, ...docuthequesActions ];
		}

		if ( get( user, ['capabilities', 'upload_files'], false ) ) {
			docuthequesActions = [ {
				title: __( 'Ajouter un document', 'docutheques' ),
				icon: 'media-text',
				onClick: () => this.setCurrentState( 'documentForm' ),
			}, ...docuthequesActions ];
		}

		if ( ! docuthequesActions ) {
			return null;
		}

		return (
			<Fragment>
				<h1 className="wp-heading-inline">{ __( 'Administration des DocuThèques', 'docutheques' ) }</h1>

				{ ! isAdvancedEditMode && (
					<DropdownMenu
						icon="insert"
						label={ __( 'Ajouter', 'docutheques' ) }
						controls={ docuthequesActions }
					/>
				) }

				<DocuthequesGuide />

				<hr className="wp-header-end" />
			</Fragment>
		);
	}
};

export default DocuthequesHeader;
