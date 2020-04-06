/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;

class DocuthequesDocuments extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { documents } = this.props;

		return (
			<div className="liste-documents">
				{ __( 'Liste des documents.', 'docutheques' ) }
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, { dossier } ) => {
		return {
			documents: select( 'docutheques' ).getDocuments( dossier ),
		};
	} ),
] )( DocuthequesDocuments );
