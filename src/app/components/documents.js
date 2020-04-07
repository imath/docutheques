/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * Internal dependencies.
 */
import DocuthequesDocument from './document';

class DocuthequesDocuments extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { documents } = this.props;
		let documentItems;

		if ( documents && documents.length ) {
			documentItems = documents.map( ( document ) => {
				return (
					<DocuthequesDocument
						key={ 'media-item-' + document.id }
						id={ document.id }
						title={ document.title.rendered }
						createdDate={ document.date }
						modifiedDate={ document.modified }
						link={ document.link }
						type={ document.media_type }
					/>
				);
			} );
		} else {
			return (
				<div className="liste-documents">
					{ __( 'Ce dossier ne contient aucun document', 'docutheques' ) }
				</div>
			);
		}

		return (
			<div className="liste-documents">
				{ documentItems }
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
