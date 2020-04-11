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

class DocuthequesHeader extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	setCurrentState( currentState ) {
		dispatch( 'docutheques' ).setCurrentState( currentState );
	}

	render() {
		const { user, isAdvancedEditMode } = this.props;
		let docuthequesActions = [];

		if ( get( user, ['capabilities', 'manage_categories'], false ) ) {
			docuthequesActions = [ {
				title: __( 'Ajouter un dossier', 'docutheques' ),
				icon: 'category',
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

				<hr className="wp-header-end" />
			</Fragment>
		);
	}
};

export default DocuthequesHeader;
