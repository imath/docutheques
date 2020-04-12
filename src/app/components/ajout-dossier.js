/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { TextControl, TextareaControl, Button } = wp.components;
const { dispatch, withDispatch } = wp.data;
const { __ } = wp.i18n;
const { compose } = wp.compose;

/**
 * External dependencies.
 */
const { get } = lodash;

const DEFAULT_STATE = {
	name: '',
	description: '',
	parent: 0,
}

class DocuthequesDossierForm extends Component {
	constructor() {
		super( ...arguments );

		this.state = DEFAULT_STATE;

		this.resetState = this.resetState.bind( this );
	}

	componentDidMount() {
		const { dossier } = this.props;

		if ( !! dossier || 0 === dossier ) {
			this.setState( { parent: dossier } );
		}
	}

	resetState() {
		this.setState( DEFAULT_STATE );
		dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );
	}

	closeForm( e ) {
		e.preventDefault();

		this.resetState();
	}

	submitForm( e ) {
		e.preventDefault();

		const { onCreateDossier } = this.props;

		onCreateDossier( this.state );

		this.resetState();
	}

	render() {
		const { user, dossier } = this.props;
		const { name, description } = this.state;
		const titleForm = 0 !== dossier ? __( 'Créer un nouveau dossier', 'docutheques' ) : __( 'Créer une nouvelle DocuThèque', 'docutheques' );

		if ( ! get( user, ['capabilities', 'manage_categories'], false ) ) {
			return null;
		}

		return (
			<div className="formulaire-dossier">
				<button className="close dashicons dashicons-no" onClick={ ( e ) => this.closeForm( e ) }>
					<span className="screen-reader-text">{ __( 'Fermer le formulaire d’ajout de dossier', 'docutheques' ) }</span>
				</button>

				<h2 className="title">{ titleForm }</h2>

				<TextControl
					label={  0 !== dossier ? __( 'Nom du dossier (obligatoire)', 'docutheques' ) : __( 'Nom de la DocuThèque (obligatoire)', 'docutheques' ) }
					value={ name }
					onChange={ ( name ) => this.setState( { name: name } ) }
				/>

				<TextareaControl
					label={ __( 'Description', 'docutheques' ) }
					value={ description }
					onChange={ ( description ) => this.setState( { description: description } ) }
				/>

				<Button isLarge={ true } onClick={ ( e ) => this.closeForm( e ) }>
					{ __( 'Annuler', 'docutheques' ) }
				</Button>

				<Button isPrimary={ true } isLarge={ true } onClick={ ( e ) => this.submitForm( e ) }>
					{ __( 'Ajouter', 'docutheques' ) }
				</Button>
			</div>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch ) => ( {
		onCreateDossier( dossier ) {
			dispatch( 'docutheques' ).insertDossier( dossier );
		},
	} ) ),
] )( DocuthequesDossierForm );
