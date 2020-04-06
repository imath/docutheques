/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { __ } = wp.i18n;

class DocuthequesDocumentForm extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { user, dossier } = this.props;

		return (
			<div className="formulaire-document">
				{ __( 'Formulaire d’envoi de fichiers.', 'docutheques' ) }
			</div>
		);
	}
}

export default DocuthequesDocumentForm;
