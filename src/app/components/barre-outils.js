/**
 * WordPress dependencies
 */
const { Component, Fragment, createElement } = wp.element;
const { Button, Modal, CheckboxControl } = wp.components;
const { withSelect, withDispatch, dispatch } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

class DocuthequesToolbar extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isDeleteDossierModalOpen: false,
			isDeleteDocumentModalOpen: false,
			options: {
				deleteDocuments: false,
			},
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

	setDossierDeleteOption( checked ) {
		this.setState( { options: {
			deleteDocuments: checked,
		} } )
	}

	deleteDossier() {
		const { dossier, onDeleteDossier } = this.props;
		const { options } = this.state;

		onDeleteDossier( dossier.id, options );

		this.setState( { isDeleteDossierModalOpen: false } );
	}

	render() {
		const { dossier, isAdvancedEditMode } = this.props;
		const { isDeleteDossierModalOpen, options } = this.state;
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

						{ !! dossier && (
							<a href="#edit-mode" className={ avancedEditClass } onClick={ ( e ) => this.switchMode( e, true ) }>
								<span className="screen-reader-text">{ __( 'Afficher le mode d’édition avancée', 'docutheques' ) }</span>
							</a>
						) }
					</div>

					{ isAdvancedEditMode && ! documentsSelection && (
						<Fragment>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button">
								{ 0 === dossier.parent ? __( 'Modifier la DocuThèque', 'docutheques' ) : __( 'Modifier le dossier', 'docutheques' ) }
							</Button>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button" onClick={ this.openDossierModal }>
								{ 0 === dossier.parent ? __( 'Supprimer la DocuThèque', 'docutheques' ) : __( 'Supprimer le dossier', 'docutheques' ) }
							</Button>
							{ isDeleteDossierModalOpen && (
								<Modal
									title={ 0 === dossier.parent ? __( 'Suppression de la DocuThèque', 'docutheques' ) : __( 'Suppression du dossier', 'docutheques' ) }
									onRequestClose={ this.closeDossierModal }
									className="delete-dossier-confirmation"
								>

									<p>{ 0 === dossier.parent ? __( 'Cette action supprimera tous les éventuels dossiers contenus dans cette DocuThèque.', 'docutheques' ) : __( 'Cette action supprimera tous les éventuels dossiers contenus dans ce dossier.', 'docutheques' ) }</p>

									<CheckboxControl
										label={ 0 === dossier.parent ? __( 'Supprimer tous les documents contenus dans cette DocuThèque.', 'docutheques' ) : __( 'Supprimer tous les documents contenus dans ce dossier.', 'docutheques' ) }
										checked={ options.deleteDocuments }
										onChange={ ( checked ) => this.setDossierDeleteOption( checked ) }
									/>

									<div className="confirmation-buttons">
										<Button isLarge={ false } isPrimary={ true } onClick={ this.deleteDossier }>
											{ __( 'Confirmer', 'docutheques' ) }
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
		const store = select( 'docutheques' );
		return {
			isAdvancedEditMode: store.isAdvancedEditMode(),
			dossier: store.getCurrentDossier(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onDeleteDossier( dossier, options = null ) {
			dispatch( 'docutheques' ).deleteDossier( dossier, options );
		},
	} ) ),
] )( DocuthequesToolbar );
