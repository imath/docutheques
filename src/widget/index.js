/**
 * External dependencies
 */
const { filter, find, reject, eachRight, concat, template, omit } = lodash;

/**
 * Widget.
 */
class Widget {
	constructor( { restRoot, restNonce, hierarchy, documentsTotal, currentParentId, dossierHasNoItems, orderBy } ) {
		this.dossiers = JSON.parse( hierarchy );
		this.root = restRoot;
		this.nonce = restNonce;
		this.current = currentParentId;
		this.docuThequeId = currentParentId;
		this.noItems = dossierHasNoItems;
		this.itemsContainer = document.querySelector( '.docutheque-elements' );
		this.docuTheque = document.querySelector( '.docutheque' );
		this.breadCrumbs = document.querySelector( '#fil-ariane-docutheque-' + this.docuThequeId );

		const initialHeaders = JSON.parse( documentsTotal );
		this.pagination = [ {
			parent: currentParentId,
			displayedPages: 1,
			totalItems: initialHeaders['X-WP-Total'],
			totalPages: initialHeaders['X-WP-TotalPages']
		} ];

		this.orderBy = JSON.parse( orderBy );
	}

	getTemplate( tmpl ) {
		const options = {
			evaluate:    /<#([\s\S]+?)#>/g,
			interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
			escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
			variable:    'data'
		};

		return template( document.querySelector( '#tmpl-' + tmpl ).innerHTML, options );
	}

	getAllParents( dossierID ) {
		const dossiers = this.dossiers;
		let dossier = find( dossiers, ['id', dossierID ] );
		let parents = filter( dossiers, { id: dossier.parent } );

		parents.forEach( ( parent ) => {
			if ( 0 !== parent.parent ) {
				const grandParents = this.getAllParents( parent.id );
				parents = [ ...parents, ...grandParents ];
			}
		} );

		return reject( parents, [ 'id', this.docuThequeId ] );
	}

	updatePagination( parent, displayedPages, totalItems, totalPages ) {
		this.pagination = [
			...reject( this.paginaiton, [ 'parent', parent ] ),
			{
				parent: parent,
				displayedPages: displayedPages,
				totalItems: totalItems,
				totalPages: totalPages
			}
		];
	}

	openDossier( element ) {
		const dossierId = parseInt( element.getAttribute( 'href' ).replace( '#dossier-', '' ), 10 );
		const dossierPagination = find( this.pagination, { parent: dossierId } );

		if ( dossierPagination && dossierPagination.parent ) {
			this.updatePagination( dossierPagination.parent, 1, dossierPagination.totalItems, dossierPagination.totalPages );
		}

		this.itemsContainer.innerHTML = '<li class="loading"></li>';

		return this.fetchItems( dossierId )
	}

	openDocutheque( element ) {
		const docuthequeId = parseInt( element.getAttribute( 'href' ).replace( '#docutheque-', '' ), 10 );
		const docuthequePagination = find( this.pagination, { parent: docuthequeId } );

		if ( docuthequePagination && docuthequePagination.parent ) {
			this.updatePagination( docuthequePagination.parent, 1, docuthequePagination.totalItems, docuthequePagination.totalPages );
		}

		this.itemsContainer.innerHTML = '<li class="loading"</li>';

		return this.fetchItems( docuthequeId )
	}

	fetchItems( parentID ) {
		const children = filter( this.dossiers, { parent: parentID } );
		const { by, order } = this.orderBy;
		this.current = parentID;
		let ancestors = [];
		this.breadCrumbs.innerHTML = '';

		if ( this.current !== this.docuThequeId ) {
			const parents = this.getAllParents( parentID );
			const current = find( this.dossiers, ['id', parentID ] );
			const BreadCrumbTemplate = this.getTemplate( 'docutheque-breadcrumbs' );

			eachRight( parents, ( parent ) => {
				parent.link = '#dossier-' + parent.id;
				ancestors = [ ...ancestors, parent ];
			} );

			ancestors = [ ...ancestors, omit( current, ['link'] ) ];

			ancestors.forEach( ( ancestor, index ) => {
				if ( 0 === index ) {
					this.breadCrumbs.innerHTML = BreadCrumbTemplate( ancestor );
				} else {
					const sousDossier = document.querySelector( '#sous-dossier-' + ancestors[ index - 1 ].id );
					sousDossier.innerHTML = BreadCrumbTemplate( ancestor );
				}
			} );
		}

		fetch( this.root + 'wp/v2/media?dossiers[]=' + parentID + '&per_page=20&docutheques_widget=1&context=view&orderby=' + by + '&order=' + order, {
			method: 'GET',
			headers: {
				'X-WP-Nonce' : this.nonce,
			}
		} ).then(
			( response ) => {
				if ( ! find( this.pagination, { parent: this.current } ) ) {
					this.pagination = [ {
						parent: this.current,
						displayedPages: 1,
						totalItems: parseInt( response.headers.get( 'X-WP-Total' ), 10 ),
						totalPages: parseInt( response.headers.get( 'X-WP-TotalPages' ), 10 )
					}, ...this.pagination ];
				}

				return response;
			}
		).then(
			( response ) => response.json()
		).then(
			( data ) => {
				const results = concat( children, data );
				const ItemTemplate = this.getTemplate( 'docutheque-element' );
				this.itemsContainer.innerHTML = '';

				if ( results.length ) {
					results.forEach( ( result ) => {
						this.itemsContainer.innerHTML += ItemTemplate( result );
					} );
				} else {
					this.itemsContainer.innerHTML = ItemTemplate( { noItems: this.noItems } );
				}
		} );
	}

	fetchMoreItems( parent, displayedPages, totalItems, totalPages ) {
		const { by, order } = this.orderBy;
		this.updatePagination( parent, displayedPages, totalItems, totalPages );

		fetch( this.root + 'wp/v2/media?dossiers[]=' + parent + '&per_page=20&page=' + displayedPages + '&docutheques_widget=1&context=view&orderby=' + by + '&order=' + order, {
			method: 'GET',
			headers: {
				'X-WP-Nonce' : this.nonce,
			}
		} ).then(
			( response ) => response.json()
		).then(
			( data ) => {
				const ItemTemplate = this.getTemplate( 'docutheque-element' );

				if ( data.length ) {
					data.forEach( ( result ) => {
						this.itemsContainer.innerHTML += ItemTemplate( result );
					} );
				}
		} );
	}

	start() {
		this.docuTheque.addEventListener( 'click', ( e ) => {
			let element = e.target;

			if ( 'A' !== element.nodeName && 'A' === element.parentNode.nodeName ) {
				element = element.parentNode;
			}

			if ( element.classList.contains( 'ouvre-dossier' ) ) {
				e.preventDefault();

				this.openDossier( element );
			} else if ( element.classList.contains( 'racine-docutheque' ) ) {
				e.preventDefault();

				this.openDocutheque( element );
			}
		} );

		this.itemsContainer.addEventListener( 'scroll', ( e ) => {
			const list = e.target;
			const listedDocuments = list.querySelectorAll( '.docutheque-document' );

			if ( list.scrollHeight - list.scrollTop === list.clientHeight ) {
				const { parent, displayedPages, totalItems, totalPages } = find( this.pagination, { parent: this.current } );

				if ( parent && listedDocuments.length !== totalItems ) {
					this.fetchMoreItems( parent, displayedPages + 1, totalItems, totalPages );
				}
			}
		} );
	}
};

const DocuThequesWidget = new Widget( DocuTheques.settings );

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', DocuThequesWidget.start() );
} else {
	DocuThequesWidget.start();
}
