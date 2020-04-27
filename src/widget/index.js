/**
 * External dependencies
 */
const { filter, find, reject, eachRight, concat, template } = lodash;

/**
 * Widget.
 */
class Widget {
	constructor( { restRoot, restNonce, hierarchy, currentParentId, dossierHasNoItems } ) {
		this.dossiers = JSON.parse( hierarchy );
		this.root = restRoot;
		this.nonce = restNonce;
		this.current = currentParentId;
		this.docuThequeId = currentParentId;
		this.noItems = dossierHasNoItems;
		this.itemsContainer = document.querySelector( '.docutheque-elements' );
		this.docuTheque = document.querySelector( '.docutheque' );
		this.breadCrumbs = document.querySelector( '#fil-ariane-docutheque-' + this.docuThequeId );
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

	openDossier( element ) {
		const dossierId = parseInt( element.getAttribute( 'href' ).replace( '#dossier-', '' ), 10 );

		return this.fetchItems( dossierId )
	}

	openDocutheque( element ) {
		const docuthequeId = parseInt( element.getAttribute( 'href' ).replace( '#docutheque-', '' ), 10 );

		return this.fetchItems( docuthequeId )
	}

	fetchItems( parentID ) {
		const children = filter( this.dossiers, { parent: parentID } );
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

			ancestors = [ ...ancestors, current ];

			ancestors.forEach( ( ancestor, index ) => {
				if ( 0 === index ) {
					this.breadCrumbs.innerHTML = BreadCrumbTemplate( ancestor );
				} else {
					const sousDossier = document.querySelector( '#sous-dossier-' + ancestors[ index - 1 ].id );
					sousDossier.innerHTML = BreadCrumbTemplate( ancestor );
				}
			} );
		}

		fetch( this.root + 'wp/v2/media?dossiers[]=' + parentID + '&per_page=20&docutheques_widget=1&context=view', {
			method: 'GET',
			headers: {
				'X-WP-Nonce' : this.nonce,
			}
		} ).then(
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
	}
};

const DocuThequesWidget = new Widget( DocuTheques.settings );

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', DocuThequesWidget.start() );
} else {
	DocuThequesWidget.start();
}
