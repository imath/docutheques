/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { TextControl, TextareaControl, Button, DatePicker, ExternalLink, Dashicon, FormFileUpload } = wp.components;
const { withSelect, dispatch, withDispatch } = wp.data;
const { compose } = wp.compose;
const { sprintf, __ } = wp.i18n;

/**
 * External dependencies.
 */
const { get, first, pick, join } = lodash;

/**
 * Internal dependencies
 */
import DocuthequesInfos from './infos';

const DEFAULT_STATE = {
	documents: [],
	document: {},
	replaceFile: false,
	file: null,
}

class DocuthequesDocumentsEditForm extends Component {
	constructor() {
		super( ...arguments );

		this.state = DEFAULT_STATE;

		this.resetState = this.resetState.bind( this );
	}

	componentDidMount() {
		const { documents, dossier } = this.props;

		if ( !! documents.length  ) {
			this.setState( {
				documents: documents,
			} );

			if ( 1 === documents.length ) {
				this.setState( {
					document: first( documents ),
				} );
			}

			dispatch( 'docutheques' ).newDossierParent( dossier );
		}
	}

	resetState() {
		const { dossier } = this.props;

		this.setState( DEFAULT_STATE );
		dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );
		dispatch( 'docutheques' ).newDossierParent( 0 );
		dispatch( 'docutheques' ).setCurrentDossier( dossier );
	}

	closeForm( e ) {
		e.preventDefault();

		this.resetState();
	}

	submitForm( e ) {
		e.preventDefault();

		const { onUpdateDocuments, newParent, dossier } = this.props;
		const { document, file } = this.state;
		let { documents } = this.state;
		let editDocuments = [];

		if ( !! document.id ) {
			if ( file ) {
				document.file = file;
			}

			documents = [ document ];
		}

		editDocuments = documents.map( ( document ) => {
			const editedDocument = pick( document, ['id', 'title', 'description', 'dossiers', 'date', 'file'] );

			if ( dossier !== newParent.id ) {
				if ( 0 !== newParent.id ) {
					editedDocument.dossiers = [ newParent.id ];
				} else {
					editedDocument.dossiers = [];
				}
			}

			return editedDocument;
		} );

		onUpdateDocuments( editDocuments );

		this.resetState();
	}

	render() {
		const { user, newParent } = this.props;
		const { documents, document, replaceFile } = this.state;
		const titleForm = 1 === documents.length ? __( 'Modifier un document', 'docutheques' ) : __( 'Modifier des documents', 'docutheques' );
		let newParentName = '', documentNames = [], currentParent = 0;

		if ( 0 === newParent.id ) {
			newParentName = __( 'Racine', 'docutheques' );
		} else {
			newParentName = newParent.name;
		}

		if ( documents && documents.length ) {
			documentNames = documents.map( ( doc ) => {
				return doc.title.raw;
			} );

			currentParent = first( first( documents ).dossiers );
			if ( undefined === currentParent ) {
				currentParent = 0;
			}
		}

		if ( ! get( user, ['capabilities', 'upload_files'], false ) ) {
			return null;
		}

		// Looks like WP CLI can't find _n() usage.
		const docList = join( documentNames, ', ' );

		/* translators: %s: the comma separated list of document names. */
		let howToMove = sprintf( __( 'Utiliser la barre latérale de gauche pour déplacer le document « %s » dans une nouvelle DocuThèque.', 'docutheques' ), docList );

		/* translators: 1: the comma separated list of document names. 2: the name of the destination folder. */
		let informMove = sprintf( __( 'Le document « %1$s » sera déplacé dans « %2$s ».', 'docutheques' ), docList, newParentName );

		if ( documents.length && documents.length > 1 ) {
			/* translators: %s: the comma separated list of document names. */
			howToMove = sprintf( __( 'Utiliser la barre latérale de gauche pour déplacer les documents « %s » dans une nouvelle DocuThèque.', 'docutheques' ), docList );

			/* translators: 1: the comma separated list of document names. 2: the name of the destination folder. */
			informMove = sprintf( __( 'Les documents « %1$s » seront déplacés dans « %2$s ».', 'docutheques' ), docList, newParentName );
		}

		return (
			<div className="formulaire-modification-document">
				<button className="close dashicons dashicons-no" onClick={ ( e ) => this.closeForm( e ) }>
					<span className="screen-reader-text">{ __( 'Fermer le formulaire de modification de documents', 'docutheques' ) }</span>
				</button>

				<h2 className="title">{ titleForm }</h2>

				{ document.id && (
					<div className="detail-document">
						<div className="description-document">
							<TextControl
								label={ __( 'Nom du document (obligatoire)', 'docutheques' ) }
								value={ document.title.raw }
								onChange={ ( title ) => this.setState( {
									document: { ...document, ...{ title: { ...document.title, ...{ raw: title } } } }
								} ) }
							/>

							<TextareaControl
								label={ __( 'Description', 'docutheques' ) }
								value={ document.description.raw }
								onChange={ ( description ) => this.setState( {
									document: { ...document, ...{ description: { ...document.description, ...{ raw: description } } } }
								} ) }
							/>

							{ ! replaceFile && (
								<div className="document-source">
									{ '' !== document.source_url && ! document.new_source_url &&
										<ExternalLink href={ document.source_url }>{ __( 'Télécharger le fichier associé', 'docutheques' ) }</ExternalLink>
									}

									{ !! document.new_source_url &&
										<div className="components-base-control">
											<div className="components-base-control__field">
												<label className="components-base-control__label">{ __( 'Nouvelle version du document', 'docutheques' ) }</label>
												<div>
													<strong className="components-text-control__input">{ document.new_source_url }</strong>
												</div>
											</div>
										</div>
									}

									<Button isSecondary={ true } onClick={ ( e ) => this.setState( { replaceFile: true } ) }>
										<Dashicon icon="upload" />
										{ __( 'Remplacer le fichier associé', 'docutheques' ) }
									</Button>
								</div>
							) }

							{ replaceFile && (
								<FormFileUpload
									onChange={ ( e ) => this.setState( {
										replaceFile: false,
										file: e.currentTarget.files[0],
										document: { ...document, ...{ new_source_url: e.currentTarget.files[0].name } }
									} ) }
									icon="upload"
									multiple={ false }
								>
									{ __( 'Téléverser la nouvelle version du document', 'docutheques' ) }
								</FormFileUpload>
							) }
						</div>

						<div className="date-document">
							<span className="label">{ __( 'Date de publication', 'docutheques' ) }</span>
							<DatePicker
								key="date"
								currentDate={ document.date }
								onChange={ ( date ) => this.setState( {
									document: { ...document, ...{ date: date } }
								} ) }
							/>
						</div>
					</div>
				) }

				{ ( '' === newParentName || newParent.id === currentParent ) && (
					<DocuthequesInfos>
						{ howToMove }
					</DocuthequesInfos>
				) }

				{ '' !== newParentName && newParent.id !== currentParent && (
					<DocuthequesInfos>
						{ informMove }
					</DocuthequesInfos>
				) }

				<Button isLarge={ true } onClick={ ( e ) => this.closeForm( e ) }>
					{ __( 'Annuler', 'docutheques' ) }
				</Button>

				<Button isPrimary={ true } isLarge={ true } onClick={ ( e ) => this.submitForm( e ) }>
					{ __( 'Modifier', 'docutheques' ) }
				</Button>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const store = select( 'docutheques' );

		return {
			documents: store.getSelectedDocuments(),
			newParent: store.getNewDossierParent(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onUpdateDocuments( documents ) {
			documents.forEach( document => {
				dispatch( 'docutheques' ).updateDocument( document );
			} );
		},
	} ) ),
] )( DocuthequesDocumentsEditForm );
