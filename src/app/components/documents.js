/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { __ } = wp.i18n;
const { withSelect, withDispatch } = wp.data;
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

		this.loadMoreDocuments = this.loadMoreDocuments.bind( this );
	}

	loadMoreDocuments( e ) {
		const { documents, total, onSetCurrentPage, currentPage } = this.props;
		const list = e.target;

		if ( list.scrollHeight - list.scrollTop === list.clientHeight && total > documents.length ) {
			onSetCurrentPage( currentPage + 1 );
		}
	}

	render() {
		const { documents, chargements, dossier, isAdvancedEditMode } = this.props;
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
						link={ document.source_url }
						type={ 'image' === document.media_type ? document.media_type : document.mime_type }
						isSelected= { document.selected || false }
						isAdvancedEditMode={ isAdvancedEditMode }
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
				<div className={ isAdvancedEditMode ? 'media-items mode-select' : 'media-items' } onScroll={ ( e ) => this.loadMoreDocuments( e ) }>
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
			currentPage: store.getDocumentsCurrentPage(),
			total: store.getTotalDocuments(),
			chargements: store.getUploads(),
		};
	} ),
	withDispatch( ( dispatch, { dossier } ) => ( {
		onSetCurrentPage( page ) {
			dispatch( 'docutheques' ).getDocumentsNextPage( dossier, page );
		},
	} ) ),
] )( DocuthequesDocuments );
