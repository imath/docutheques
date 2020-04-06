/**
 * WordPress dependencies.
 */
const { Component, render, createElement, Fragment } = wp.element;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * Internal dependencies.
 */
import './store';
import DocuthequesHeader from './components/header';
import DocuthequesDossiers from './components/terms-tree'

class Docutheques extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		const { user, currentState, currentDossierId } = this.props;

		return (
			<Fragment>
				<DocuthequesHeader
					user={ user }
				/>
				<DocuthequesDossiers />

				{ 'documentForm' === currentState && (
					<div>{ __( 'Formulaire d’envoi de fichiers.', 'docutheques' ) }</div>
				) }

				{ 'dossierForm' === currentState && (
					<div>{ __( 'Formulaire d’envoi de dossiers.', 'docutheques' ) }</div>
				) }

				{ 'documentsBrowser' === currentState && (
					<div>{ __( 'Liste des documents.', 'docutheques' ) }</div>
				) }
			</Fragment>
		);
	}
};

const DocuthequesAdministration = compose( [
	withSelect( ( select ) => {
		const docuThequesStore = select( 'docutheques' );

		return {
			user: docuThequesStore.getCurrentUser(),
			currentState: docuThequesStore.getCurrentState(),
			currentDossierId: docuThequesStore.getCurrentDossierId(),
		};
	} ),
] )( Docutheques );

render( <DocuthequesAdministration />, document.querySelector( '#docutheques' ) );
