/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { __ } = wp.i18n;

class DocuthequesDossierForm extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { user, dossier } = this.props;

		return (
			<div className="formulaire-dossier">
				{ __( 'Formulaire d’envoi de dossiers.', 'docutheques' ) }
			</div>
		);
	}
}

export default DocuthequesDossierForm;
