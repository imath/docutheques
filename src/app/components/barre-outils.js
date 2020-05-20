/**
 * WordPress dependencies
 */
const { Component, Fragment, createElement } = wp.element;
const { Button, Modal, CheckboxControl, TextControl } = wp.components;
const { withSelect, withDispatch, dispatch } = wp.data;
const { compose } = wp.compose;
const { __, sprintf } = wp.i18n;

/**
 * Internal dependencies.
 */
import DocuThequesConfirmerSuppression from './confirmer-suppression';

class DocuthequesToolbar extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isDeleteDossierModalOpen: false,
			isDeleteDocumentModalOpen: false,
			options: {
				deleteDocuments: false,
			},
			search: '',
		};

		this.openDossierModal = this.openDossierModal.bind( this );
		this.closeDossierModal = this.closeDossierModal.bind( this );
		this.deleteDossier = this.deleteDossier.bind( this );
		this.openDocumentModal = this.openDocumentModal.bind( this );
		this.closeDocumentModal = this.closeDocumentModal.bind( this );
		this.deleteDocument = this.deleteDocument.bind( this );
		this.setSearchTerms = this.setSearchTerms.bind( this );
	}

	switchMode( e, mode ) {
		e.preventDefault();

		dispatch( 'docutheques' ).switchMode( mode );

		if ( false === mode ) {
			this.cancelDocumentsSelection();

			const { currentState } = this.props;
			const isEditForm = -1 !== ['documentsEditForm', 'dossierEditForm'].indexOf( currentState );

			if ( isEditForm ) {
				this.setCurrentState( 'documentsBrowser' );
			}
		}
	}

	openDossierModal() {
		this.setState( { isDeleteDossierModalOpen: true } );
	}

	openDocumentModal() {
		this.setState( { isDeleteDocumentModalOpen: true } );
	}

	closeDossierModal() {
		this.setState( { isDeleteDossierModalOpen: false } );
	}

	closeDocumentModal() {
		this.setState( { isDeleteDocumentModalOpen: false } );
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

	deleteDocument() {
		const { selectedDocuments, onDeleteDocuments } = this.props;

		onDeleteDocuments( selectedDocuments );

		this.setState( { isDeleteDocumentModalOpen: false } );
	}

	setCurrentState( currentState ) {
		dispatch( 'docutheques' ).setCurrentState( currentState );

		if ( 'documentsEditForm' === currentState ) {
			dispatch( 'docutheques' ).resetUploads();
		}
	}

	cancelDocumentsSelection() {
		dispatch( 'docutheques' ).resetDocumentsSelection();
	}

	setSearchTerms( search ) {
		this.setState( { search: search } );

		dispatch( 'docutheques' ).setSearchTerms( search );
	}

	render() {
		const { dossier, isAdvancedEditMode, currentState, selectedDocuments } = this.props;
		const { isDeleteDossierModalOpen, isDeleteDocumentModalOpen, options, search } = this.state;
		const isNewForm = -1 !== ['documentForm', 'dossierForm'].indexOf( currentState );

		let gridClass = 'view-grid';
		let avancedEditClass = 'view-list';

		if ( ! isAdvancedEditMode ) {
			gridClass += ' current';
		} else {
			avancedEditClass += ' current';
		}

		// Looks like WP CLI can't find _n() usage.
		let confirmMessage = __( 'Cette action est irréversible, merci de confirmer que vous souhaitez supprimer un document.', 'docutheques' );
		if ( selectedDocuments.length && selectedDocuments.length > 1 ) {
			/* translators: %d: number of documents to delete. */
			confirmMessage = sprintf( __( 'Cette action est irréversible, merci de confirmer que vous souhaitez supprimer %d documents.', 'docutheques' ), selectedDocuments.length );
		}

		return (
			<div className="media-toolbar wp-filter">
				<div className="media-toolbar-secondary">
					<div className="view-switch media-grid-view-switch">
						<a href="#view-grid" className={ gridClass } onClick={ ( e ) => this.switchMode( e, false ) }>
							<span className="screen-reader-text">{ __( 'Afficher le mode d’édition simple', 'docutheques' ) }</span>
						</a>

						{ ! isNewForm && (
							<a href="#edit-mode" className={ avancedEditClass } onClick={ ( e ) => this.switchMode( e, true ) }>
								<span className="screen-reader-text">{ __( 'Afficher le mode d’édition avancée', 'docutheques' ) }</span>
							</a>
						) }
					</div>

					{ isAdvancedEditMode && !! dossier && ! selectedDocuments.length && ! isNewForm && (
						<Fragment>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button" onClick={ () => this.setCurrentState( 'dossierEditForm' ) }>
								{ 0 === dossier.parent ? __( 'Modifier la DocuThèque', 'docutheques' ) : __( 'Modifier le dossier', 'docutheques' ) }
							</Button>
							<Button isLarge={ true } disabled={ 'dossierEditForm' === currentState } className="button media-button select-mode-toggle-button" onClick={ this.openDossierModal }>
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

					{ isAdvancedEditMode && 0 !== selectedDocuments.length && ! isNewForm && (
						<Fragment>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button" onClick={ () => this.setCurrentState( 'documentsEditForm' ) }>
								{ 1 === selectedDocuments.length ? __( 'Modifier le document', 'docutheques' ) : __( 'Déplacer les documents', 'docutheques' ) }
							</Button>
							<Button isLarge={ true } disabled={ 'documentsEditForm' === currentState } className="button media-button select-mode-toggle-button" onClick={ this.openDocumentModal }>
								{ 1 === selectedDocuments.length ? __( 'Supprimer le document', 'docutheques' ) : __( 'Supprimer les documents', 'docutheques' ) }
							</Button>
							{ isDeleteDocumentModalOpen && (
								<DocuThequesConfirmerSuppression
									title={ 1 === selectedDocuments.length ? __( 'Suppression d’un document', 'docutheques' ) : __( 'Suppression de documents', 'docutheques' ) }
									onRequestClose={ this.closeDocumentModal }
									confirmMessage={ confirmMessage }
									onConfirm={ this.deleteDocument }
									onCancel={ this.closeDocumentModal }
								/>
							) }
							{ selectedDocuments.length >= 1 && (
								<Button isLarge={ true } disabled={ 'documentsEditForm' === currentState } className="button media-button select-mode-toggle-button" onClick={ () => this.cancelDocumentsSelection() }>
									{ __( 'Annuler la sélection', 'docutheques' ) }
								</Button>
							) }
						</Fragment>
					) }
				</div>
				{ ! isAdvancedEditMode && (
					<div className="media-toolbar-primary search-form">
						<TextControl
							label={ __( 'Rechercher un document', 'docutheques' ) }
							value={ search }
							onChange={ ( search ) => this.setSearchTerms( search ) }
							className="search"
							type="search"
						/>
					</div>
				) }
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
			selectedDocuments: store.getSelectedDocuments(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onDeleteDossier( dossier, options = null ) {
			dispatch( 'docutheques' ).deleteDossier( dossier, options );
		},
		onDeleteDocuments( documents ) {
			documents.forEach( document => {
				dispatch( 'docutheques' ).deleteDocument( document.id, document.title.raw );
			} );
		},
	} ) ),
] )( DocuthequesToolbar );
