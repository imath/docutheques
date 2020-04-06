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
		const { user } = this.props;

		return (
			<Fragment>
				<h1 className="wp-heading-inline">{ __( 'Administration des DocuThèques', 'docutheques' ) }</h1>

				{ get( user, ['capabilities', 'upload_files'], false ) && (
					<DropdownMenu
						icon="insert"
						label={ __( 'Ajouter', 'docutheques' ) }
						controls={ [
							{
								title: __( 'Ajouter un fichier', 'docutheques' ),
								icon: 'media-text',
								onClick: () => this.setCurrentState( 'documentForm' ),
							},
							{
								title: __( 'Ajouter un dossier', 'docutheques' ),
								icon: 'category',
								onClick: () => this.setCurrentState( 'dossierForm' ),
							},
						] }
					/>
				) }

				<hr className="wp-header-end" />
			</Fragment>
		);
	}
};

export default DocuthequesHeader;
