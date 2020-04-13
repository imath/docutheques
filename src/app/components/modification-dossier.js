/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { TextControl, TextareaControl, Button } = wp.components;
const { withSelect, dispatch, withDispatch } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

/**
 * External dependencies.
 */
const { get } = lodash;

/**
 * Internal dependencies
 */
import DocuthequesInfos from './infos';

const DEFAULT_STATE = {
	name: '',
	description: '',
	parent: 0,
}

class DocuthequesDossierEditForm extends Component {
	constructor() {
		super( ...arguments );

		this.state = DEFAULT_STATE;

		this.resetState = this.resetState.bind( this );
	}

	componentDidMount() {
		const { dossier } = this.props;

		if ( !! dossier  ) {
			this.setState( {
				name: dossier.name,
				description: dossier.description,
				parent: dossier.parent,
			} );
		}
	}

	resetState() {
		const { dossier } = this.props;

		this.setState( DEFAULT_STATE );
		dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );
		dispatch( 'docutheques' ).newDossierParent( 0 );
		dispatch( 'docutheques' ).setCurrentDossier( dossier.id );
	}

	closeForm( e ) {
		e.preventDefault();

		this.resetState();
	}

	submitForm( e ) {
		e.preventDefault();

		const { onUpdateDossier, dossier, newParent } = this.props;
		let editDossier = this.state;

		if ( 0 !== newParent ) {
			editDossier.parent = newParent;
		}

		onUpdateDossier( dossier, editDossier );

		this.resetState();
	}

	render() {
		const { user } = this.props;
		const { name, description, parent } = this.state;
		const titleForm = 0 !== parent ? __( 'Modifier un dossier', 'docutheques' ) : __( 'Modifier une DocuThèque', 'docutheques' );

		if ( ! get( user, ['capabilities', 'manage_categories'], false ) ) {
			return null;
		}

		return (
			<div className="formulaire-dossier">
				<button className="close dashicons dashicons-no" onClick={ ( e ) => this.closeForm( e ) }>
					<span className="screen-reader-text">{ __( 'Fermer le formulaire de modification d’un dossier', 'docutheques' ) }</span>
				</button>

				<h2 className="title">{ titleForm }</h2>

				<TextControl
					label={ 0 !== parent ? __( 'Nom du dossier (obligatoire)', 'docutheques' ) : __( 'Nom de la DocuThèque (obligatoire)', 'docutheques' ) }
					value={ name }
					onChange={ ( name ) => this.setState( { name: name } ) }
				/>

				<TextareaControl
					label={ __( 'Description', 'docutheques' ) }
					value={ description }
					onChange={ ( description ) => this.setState( { description: description } ) }
				/>

				{ 0 !== parent && (
					<DocuthequesInfos>
						{ __( 'Utiliser la barre latérale de gauche pour déplacer le dossier dans une nouvelle DocuThèque.', 'docutheques' ) }
					</DocuthequesInfos>
				) }

				<Button isLarge={ true } onClick={ ( e ) => this.closeForm( e ) }>
					{ __( 'Annuler', 'docutheques' ) }
				</Button>

				<Button isPrimary={ true } isLarge={ true } onClick={ ( e ) => this.submitForm( e ) }>
					{ __( 'Modifier', 'docutheques' ) }
				</Button>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const store = select( 'docutheques' );

		return {
			dossier: store.getCurrentDossier(),
			newParent: store.getNewDossierParentId(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		onUpdateDossier( previous, dossier ) {
			dispatch( 'docutheques' ).updateDossier( previous, dossier );
		},
	} ) ),
] )( DocuthequesDossierEditForm );
