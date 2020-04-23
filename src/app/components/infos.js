/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Notice, Dashicon } = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;
const { sprintf, __ } = wp.i18n;

class DocuthequesInfos extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { dossier, children, searchTerms } = this.props;
		let message = __( 'Il n’existe aucun document directement rattaché à la racine pour le moment.', 'docutheques' );

		if ( !! dossier && 0 === dossier.parent ) {
			message = __( 'Cette DocuThèque ne contient aucun document directement rattaché pour le moment.', 'docutheques' )
		}

		if ( !! dossier && 0 !== dossier.parent ) {
			message = __( 'Ce dossier ne contient aucun document directement rattaché pour le moment.', 'docutheques' )
		}

		if ( searchTerms ) {
			message = sprintf(
				/* translators: %s is the placeholder for the searched terms */
				__( 'Aucun document dont le nom contient « %s » n‘a été trouvé à cet emplacement.', 'docutheques' ),
				searchTerms
			);
		}

		return (
			<div className="docutheques-infos">
				<Notice
					status="info"
					isDismissible={ false }
				>
					<p>
						<Dashicon icon="info" />
						{ children || message }
					</p>
				</Notice>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		return {
			dossier: select( 'docutheques' ).getCurrentDossier(),
		};
	} ),
] )( DocuthequesInfos );
