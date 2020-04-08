/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { DropZoneProvider, DropZone, FormFileUpload } = wp.components;
const { __ } = wp.i18n;
const { withDispatch, dispatch } = wp.data;
const { compose } = wp.compose;

class DocuthequesDocumentForm extends Component {
	constructor() {
		super( ...arguments );
	}

	resetState() {
		dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );
	}

	closeForm( e ) {
		e.preventDefault();

		this.resetState();
	}

	submitUpload( e ) {
		const { onFilesDropped } = this.props;
		let files;

		if ( e.currentTarget && e.currentTarget.files ) {
			files = [ ...e.currentTarget.files ];
		} else {
			files = e;
		}

		onFilesDropped( files );
		this.resetState();
	}

	render() {
		const { user, dossier } = this.props;
		const dzClass = 'enabled';
		const dzLabel = __( 'Déposer votre ou vos document(s) ici.', 'docutheques' );

		return (
			<div className="formulaire-document">
				<button className="close dashicons dashicons-no" onClick={ ( e ) => this.closeForm( e ) }>
					<span className="screen-reader-text">{ __( 'Fermer le formulaire d’ajout de document(s)', 'docutheques' ) }</span>
				</button>

				<h2 className="title">{ __( 'Téléverser un ou plusieurs nouveau(x) document(s) dans le dossier actif', 'docutheques' ) }</h2>

				<div className={ 'uploader-container ' + dzClass }>
					<DropZoneProvider>
						<div className="dropzone-label">
							{ __( 'Utiliser le bouton ci-dessous pour sélectionner votre ou vos documents ou déposer les directement dans la zone délimitée par des tirets pour les téléverser dans le dossier actif.', 'docutheques' ) }
							<FormFileUpload
								onChange={ ( e ) => this.submitUpload( e ) }
								icon="upload"
								multiple={ true }
							>
								{ __( 'Téléverser', 'docutheques' ) }
							</FormFileUpload>
						</div>
						<DropZone
							label={ __( 'Déposer votre ou vos document(s) ici.', 'docutheques' ) }
							onFilesDrop={ ( e ) => this.submitUpload( e ) }
							className="uploader-inline"
						/>
					</DropZoneProvider>
				</div>
			</div>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch, { dossier } ) => ( {
		onFilesDropped( documents ) {
			documents.forEach( document => {
				dispatch( 'docutheques' ).insertDocument( document, dossier );
			} );
		},
	} ) ),
] )( DocuthequesDocumentForm );
