/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Dashicon, Notice, Animate } = wp.components;
const { sprintf, __ } = wp.i18n;

class DocuthequesChargement extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { chargements } = this.props;
		const numberChargements = chargements && chargements.length ? chargements.length : 0;

		if ( ! numberChargements ) {
			return null;
		}

		// Looks like WP CLI can't find _n() usage.
		let uploadingDocuments = __( 'Téléversement d’un document en cours, merci de patienter.', 'docutheques' );
		if ( numberChargements > 1 ) {
			/* translators: %d: number of documents being uploaded. */
			uploadingDocuments = sprintf( __( 'Téléversement de %d documents en cours, merci de patienter.', 'docutheques' ), numberChargements );
		}

		return (
			<div className="chargement-de-documents">
				<Animate
					type="loading"
				>
					{ ( { className } ) => (
						<Notice
							status="warning"
							isDismissible={ false }
						>
							<p className={ className }>
								<Dashicon icon="update" />
								{ uploadingDocuments }
							</p>
						</Notice>
					) }
				</Animate>
			</div>
		);
	}
}

export default DocuthequesChargement;
