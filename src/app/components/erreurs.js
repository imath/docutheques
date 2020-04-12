/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Notice, Dashicon } = wp.components;
const { withSelect, dispatch } = wp.data;
const { compose } = wp.compose;
const { sprintf, __ } = wp.i18n;

class DocuthequesErreurs extends Component {
	constructor() {
		super( ...arguments );
	}

	onRemoveError( type, id ) {
		dispatch( 'docutheques' ).dismissError( type, id )
	}

	render() {
		const { erreurs } = this.props;
		let documentErrors, dossierErrors;

		if ( ! erreurs.documents.length && ! erreurs.dossiers.length ) {
			return null;
		}

		if ( erreurs.documents.length ) {
			documentErrors = erreurs.documents.map( ( error ) => {
				return (
					<Notice
						key={ 'error-' + error.id }
						status="error"
						onRemove={ () => this.onRemoveError( 'documents', error.id ) }
						isDismissible={ true }
					>
						<p>
							<Dashicon icon="warning" />
							{ sprintf(
								/* translators: 1: file name. 2: error message. */
								__( 'Le document « %1$s » n‘a pas pu être téléchargé en raison de cette erreur : %2$s', 'docutheques' ),
								error.name,
								error.error
							) }
						</p>
					</Notice>
				);
			} );
		}

		if ( erreurs.dossiers.length ) {
			dossierErrors = erreurs.dossiers.map( ( error ) => {
				return (
					<Notice
						key={ 'error-' + error.id }
						status="error"
						onRemove={ () => this.onRemoveError( 'dossiers', error.id ) }
						isDismissible={ true }
					>
						<p>
							<Dashicon icon="warning" />
							{ ! error.actionType && sprintf(
								/* translators: 1: file name. 2: error message. */
								__( 'Le dossier « %1$s » n‘a pas pu être créé en raison de cette erreur : %2$s', 'docutheques' ),
								error.name,
								error.error
							) }

							{ error.actionType && 'delete' === error.actionType && sprintf(
								/* translators: %s is the error message. */
								__( 'Le dossier actif n‘a pas pu être supprimé en raison de cette erreur : %s', 'docutheques' ),
								error.error
							) }
						</p>
					</Notice>
				);
			} );
		}

		return (
			<div className="docutheques-erreurs">
				{ documentErrors }
				{ dossierErrors }
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		return {
			erreurs: select( 'docutheques' ).getErrors(),
		};
	} ),
] )( DocuthequesErreurs );
