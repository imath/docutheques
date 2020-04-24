/**
 * External dependencies
 */
const { filter, concat, template } = lodash;

/**
 * Widget.
 */
class Widget {
	constructor( { restRoot, restNonce, hierarchy } ) {
		this.dossiers = JSON.parse( hierarchy );
		this.root = restRoot;
		this.nonce = restNonce;
		this.itemsContainer = document.querySelector( '.docutheque-elements' );
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
		const children = filter( this.dossiers, { parent: dossierId } );

		fetch( this.root + 'wp/v2/media?dossiers[]=' + dossierId + '&per_page=20&docutheques_widget=1&context=view', {
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

				results.forEach( ( result ) => {
					this.itemsContainer.innerHTML += Template( result );
				} );
		} );
	}

	start() {
		this.itemsContainer.addEventListener( 'click', ( e ) => {
			let element = e.target;

			if ( 'A' !== element.nodeName && 'A' === element.parentNode.nodeName ) {
				element = element.parentNode;
			}

			if ( element.classList.contains( 'ouvre-dossier' ) ) {
				e.preventDefault();

				this.openDossier( element );
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
