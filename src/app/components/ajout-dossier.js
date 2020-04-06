/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { TextControl, TextareaControl, Button } = wp.components;
const { dispatch } = wp.data;
const { __ } = wp.i18n;

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

	resetState() {
		this.setState( DEFAULT_STATE );
	}

	closeForm( e ) {
		e.preventDefault();

		this.resetState();
		dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );
	}

	submitForm( e ) {
		e.preventDefault();
	}

	render() {
		const { user, dossier } = this.props;
		const { name, description } = this.state;

		return (
			<div className="formulaire-dossier">
				<button className="close dashicons dashicons-no" onClick={ ( e ) => this.closeForm( e ) }>
					<span className="screen-reader-text">{ __( 'Fermer le formulaire d’ajout de dossier', 'docutheques' ) }</span>
				</button>

				<h2 className="title">{ __( 'Créer un nouveau dossier', 'docutheques' ) }</h2>

				<TextControl
					label={ __( 'Nom du dossier (obligatoire)', 'docutheques' ) }
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

export default DocuthequesDossierForm;
