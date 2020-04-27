/**
 * External dependencies
 */
const { filter, concat, template } = lodash;

/**
 * Widget.
 */
class Widget {
	constructor( { restRoot, restNonce, hierarchy, currentParentId, dossierHasNoItems } ) {
		this.dossiers = JSON.parse( hierarchy );
		this.root = restRoot;
		this.nonce = restNonce;
		this.current = currentParentId;
		this.noItems = dossierHasNoItems;
		this.itemsContainer = document.querySelector( '.docutheque-elements' );
		this.docuTheque = document.querySelector( '.docutheque' );
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
				const Template = this.getTemplate( 'docutheque-element' );
				this.itemsContainer.innerHTML = '';

				if ( results.length ) {
					results.forEach( ( result ) => {
						this.itemsContainer.innerHTML += Template( result );
					} );
				} else {
					this.itemsContainer.innerHTML = Template( { noItems: this.noItems } );
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
