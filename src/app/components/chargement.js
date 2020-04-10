/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Dashicon, Animate } = wp.components;
const { sprintf, _n } = wp.i18n;

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

		return (
			<div className="chargement-de-documents">
				<Animate
					type="loading"
				>
					{ ( { className } ) => (
						<p className={ className }>
							<Dashicon icon="update" />
							{ sprintf(
								/* translators: %s: number of documents being uploaded. */
								_n(
									'Chargement de %d document en cours, merci de patienter.',
									'Chargement de %d documents en cours, merci de patienter.',
									numberChargements,
									'docutheques'
								),
								numberChargements
							) }
						</p>
					) }
				</Animate>
			</div>
		);
	}
}

export default DocuthequesChargement;
