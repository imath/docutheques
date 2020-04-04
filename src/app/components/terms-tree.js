/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Dashicon } = wp.components;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * External dependencies.
 */
const { join, indexOf, groupBy, unescape } = lodash;

class DocuthequesDossiers extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			dossierID: 0,
			dossierAncestors: [],
		};
	}

	setDossier( id, parent, e ) {
		e.preventDefault();
		let { dossierAncestors } = this.state;

		if ( 0 !== parent ) {
			dossierAncestors = [ parent, ...dossierAncestors ];
		} else {
			dossierAncestors = [];
		}

		this.setState( {
			dossierID: id,
			dossierAncestors: dossierAncestors,
		} );
	}

	buildTermsTree( flatTerms ) {
		const termsByParent = groupBy( flatTerms, 'parent' );
		const fillWithChildren = ( terms ) => {
			return terms.map( ( term ) => {
				const children = termsByParent[ term.id ];
				return {
					...term,
					children: children && children.length ?
						fillWithChildren( children ) :
						[],
				};
			} );
		};

		return fillWithChildren( termsByParent[ '0' ] || [] );
	}

	renderDossiers( renderedDossiers ) {
		const { dossierID, dossierAncestors } = this.state;

		return renderedDossiers.map( ( dossier ) => {
			dossier.classes = ['sous-choix-dossiers'];

			if ( dossier.id === dossierID ) {
				dossier.classes = [...dossier.classes, 'has-parent-selected' ];
			} else if ( -1 !== indexOf( dossierAncestors, dossier.id ) ) {
				dossier.classes = [...dossier.classes, 'is-parent-selected' ];
			}

			return (
				<li key={ dossier.id } className="choix-dossiers">
					<a href="#" onClick={ ( e ) => this.setDossier( dossier.id, dossier.parent, e ) }>
						<Dashicon icon="portfolio" />
						<span className="dossier-name">{ unescape( dossier.name ) }</span>
					</a>
					{ !! dossier.children.length && (
						<ul className={ join( dossier.classes, ' ' ) }>
							{ this.renderDossiers( dossier.children ) }
						</ul>
					) }
				</li>
			);
		} );
	}

	render() {
		const { dossiers } = this.props;
		const tree = this.buildTermsTree( dossiers );
		let renderedDossiers = null;

		if ( tree.length ) {
			renderedDossiers = this.renderDossiers( tree );
		}

		return (
			<ul className="arbre-des-dossiers">
				<li>
					<a href="#" onClick={ ( e ) => this.setDossier( 0, 0, e ) }>
						<Dashicon icon="admin-home" />
						<span className="dossier-root">{ __( 'Racine', 'docutheques' ) }</span>
					</a>
					<ul className="liste-dossiers">{ renderedDossiers }</ul>
				</li>
			</ul>
		);
	}
};

export default compose( [
	withSelect( ( select ) => ( {
		dossiers: select( 'docutheques' ).getDossiers(),
	} ) ),
] )( DocuthequesDossiers );