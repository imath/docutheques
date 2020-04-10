/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * External dependencies.
 */
const { filter } = lodash;

/**
 * Internal dependencies.
 */
import DocuthequesDocument from './document';
import DocuthequesChargement from './chargement';
import DocuthequesErreurs from './erreurs';
import DocuthequesInfos from './infos';

class DocuthequesDocuments extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { documents, chargements, dossier } = this.props;
		const hasChargements = chargements && chargements.length ? true : false;
		let documentsByDossier, documentItems;

		if ( documents && documents.length ) {
			if ( 0 === dossier ) {
				documentsByDossier = filter( documents, ( document ) => {
					return ! document.dossiers.length;
				} );
			} else {
				documentsByDossier = filter( documents, { 'dossiers': [ dossier ] } );
			}

			documentItems = documentsByDossier.map( ( document ) => {
				return (
					<DocuthequesDocument
						key={ 'media-item-' + document.id }
						id={ document.id }
						title={ document.title.rendered }
						createdDate={ document.date }
						modifiedDate={ document.modified }
						link={ document.link }
						type={ 'image' === document.media_type ? document.media_type : document.mime_type }
					/>
				);
			} );
		}

		if ( ( ! documentsByDossier || ! documentsByDossier.length ) && ! hasChargements ) {
			return (
				<div className="liste-documents">
					<DocuthequesErreurs />
					<DocuthequesInfos />
				</div>
			);
		}

		return (
			<div className="liste-documents">
				<DocuthequesErreurs />
				<DocuthequesChargement chargements={ chargements } />
				<div className="media-items">
					{ documentItems }
				</div>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, { dossier } ) => {
		const store = select( 'docutheques' );

		return {
			documents: store.getDocuments( dossier ),
			chargements: store.getUploads(),
		};
	} ),
] )( DocuthequesDocuments );
