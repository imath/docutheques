/**
 * WordPress dependencies
 */
const { Component, Fragment, createElement } = wp.element;
const { Button, Modal } = wp.components;
const { withSelect, dispatch } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

class DocuthequesToolbar extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isDeleteDossierModalOpen: false,
			isDeleteDocumentModalOpen: false,
		};

		this.openDossierModal = this.openDossierModal.bind( this );
		this.closeDossierModal = this.closeDossierModal.bind( this );
		this.deleteDossier = this.deleteDossier.bind( this );
	}

	switchMode( e, mode ) {
		e.preventDefault();

		dispatch( 'docutheques' ).switchMode( mode );
	}

	openDossierModal() {
		this.setState( { isDeleteDossierModalOpen: true } );
	}

	closeDossierModal() {
		this.setState( { isDeleteDossierModalOpen: false } );
	}

	deleteDossier() {
		const { dossier } = this.props;

		// @todo handle Dossier delete.

		this.setState( { isDeleteDossierModalOpen: false } );
	}

	render() {
		const { dossier, isAdvancedEditMode } = this.props;
		const { isDeleteDossierModalOpen } = this.state;
		const documentsSelection = 0;
		let gridClass = 'view-grid';
		let avancedEditClass = 'view-list';

		if ( ! isAdvancedEditMode ) {
			gridClass += ' current';
		} else {
			avancedEditClass += ' current';
		}

		return (
			<div className="media-toolbar wp-filter">
				<div className="media-toolbar-secondary">
					<div className="view-switch media-grid-view-switch">
						<a href="#view-grid" className={ gridClass } onClick={ ( e ) => this.switchMode( e, false ) }>
							<span className="screen-reader-text">{ __( 'Afficher le mode d’édition simple', 'docutheques' ) }</span>
						</a>

						{ 0 !== dossier && (
							<a href="#edit-mode" className={ avancedEditClass } onClick={ ( e ) => this.switchMode( e, true ) }>
								<span className="screen-reader-text">{ __( 'Afficher le mode d’édition avancée', 'docutheques' ) }</span>
							</a>
						) }
					</div>

					{ isAdvancedEditMode && ! documentsSelection && (
						<Fragment>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button">
								{ __( 'Modifier le dossier actif', 'docutheques' ) }
							</Button>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button" onClick={ this.openDossierModal }>
								{ __( 'Supprimer le dossier actif', 'docutheques' ) }
							</Button>
							{ isDeleteDossierModalOpen && (
								<Modal
									title={ __( 'Suppression du dossier actif', 'docutheques' ) }
									onRequestClose={ this.closeDossierModal }
									className="delete-dossier-confirmation"
								>

									{ __( 'Cette action supprimera tous les éventuels dossiers et documents contenus dans ce dossier, vous confirmez ?', 'docutheques' ) }

									<div className="confirmation-buttons">
										<Button isLarge={ false } isPrimary={ true } onClick={ this.deleteDossier }>
											{ __( 'Supprimer', 'docutheques' ) }
										</Button>

										<Button isLarge={ false } isSecondary={ true } onClick={ this.closeDossierModal }>
											{ __( 'Annuler', 'docutheques' ) }
										</Button>
									</div>

								</Modal>
							) }
						</Fragment>
					) }
				</div>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		return {
			isAdvancedEditMode: select( 'docutheques' ).isAdvancedEditMode(),
		};
	} ),
] )( DocuthequesToolbar );
