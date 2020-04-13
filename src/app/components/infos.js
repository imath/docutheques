/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Notice, Dashicon } = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

class DocuthequesInfos extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { dossier, children } = this.props;
		let message = __( 'Il n’existe aucun document directement rattaché à la racine pour le moment.', 'docutheques' );

		if ( !! dossier && 0 === dossier.parent ) {
			message = __( 'Cette DocuThèque ne contient aucun document directement rattaché pour le moment.', 'docutheques' )
		}

		if ( !! dossier && 0 !== dossier.parent ) {
			message = __( 'Ce dossier ne contient aucun document directement rattaché pour le moment.', 'docutheques' )
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
