/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Dashicon } = wp.components;
const { __ } = wp.i18n;
const { withSelect, dispatch } = wp.data;
const { compose } = wp.compose;

/**
 * External dependencies.
 */
const { join, indexOf, groupBy, unescape, forEach, filter } = lodash;

class DocuthequesDossiers extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			dossierID: 0,
			dossierAncestors: [],
		};
	}

	getAncestors( parentID ) {
		const { dossiers } = this.props;
		let parents = filter( dossiers, { id: parentID } );

		forEach( parents, ( dossier ) => {
			const grandParents = this.getAncestors( dossier.parent );
			parents = [ ...parents, ...grandParents ];
		} );

		return parents;
	}

	componentDidMount() {
		const { currentDossier } = this.props;
		const currentDossierId = !! currentDossier ? currentDossier.id : 0;
		const { dossierID } = this.state;

		if ( ( !! currentDossierId || 0 === currentDossierId ) && currentDossierId !== dossierID ) {
			this.setState( { dossierID: currentDossierId } );
		}
	}

	componentDidUpdate( prevProps ) {
		const { currentState, currentDossier } = this.props;
		const { dossierAncestors } = this.state;

		if ( prevProps.currentState !== currentState && !! currentDossier ) {
			if ( -1 === indexOf( dossierAncestors, currentDossier.parent ) ) {
				const ancestors = this.getAncestors( currentDossier.parent ).map( ( ancestor ) => ancestor.id );

				this.setState( { dossierAncestors: ancestors } );
			}
		}
	}

	setDossier( id, parent, e ) {
		e.preventDefault();
		const { currentState, currentDossier } = this.props;
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

		if ( ( 'dossierEditForm' === currentState && !! currentDossier && 0 !== currentDossier.parent && 0 !== id ) || 'documentsEditForm' === currentState ) {
			dispatch( 'docutheques' ).newDossierParent( id );
		} else {
			dispatch( 'docutheques' ).setCurrentDossier( id );
			dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );
			dispatch( 'docutheques' ).switchMode( false );
		}
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
		const { currentDossier } = this.props;
		const currentDossierId = !! currentDossier ? currentDossier.id : 0;

		return renderedDossiers.map( ( dossier ) => {
			dossier.classes = ['sous-choix-dossiers'];

			if ( dossier.id === dossierID ) {
				dossier.classes = [...dossier.classes, 'has-parent-selected' ];
			} else if ( -1 !== indexOf( dossierAncestors, dossier.id ) ) {
				dossier.classes = [...dossier.classes, 'is-parent-selected' ];
			}

			return (
				<li key={ dossier.id } className={ currentDossierId === dossier.id ? "is-current-dossier choix-dossiers" : "choix-dossiers" }>
					<a href="#" onClick={ ( e ) => this.setDossier( dossier.id, dossier.parent, e ) }>
						<Dashicon icon={ 0 === dossier.parent ? 'portfolio' : 'category' } />
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
		const { dossiers, currentDossier } = this.props;
		const currentDossierId = !! currentDossier ? currentDossier.id : 0;
		const tree = this.buildTermsTree( dossiers );
		let renderedDossiers = null;

		if ( tree.length ) {
			renderedDossiers = this.renderDossiers( tree );
		}

		return (
			<ul className="arbre-des-dossiers">
				<li className={ currentDossierId === 0 ? "is-current-dossier choix-dossiers" : "choix-dossiers" }>
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
	withSelect( ( select ) => {
		const docuThequesStore = select( 'docutheques' );

		return {
			dossiers: docuThequesStore.getDossiers(),
			currentDossier: docuThequesStore.getCurrentDossier(),
		};
	} ),
] )( DocuthequesDossiers );
