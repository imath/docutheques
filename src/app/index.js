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
import DocuthequesToolbar from './components/barre-outils';
import DocuthequesDossiers from './components/terms-tree';
import DocuthequesDocuments from './components/documents';
import DocuthequesDossierForm from './components/ajout-dossier';
import DocuthequesDocumentForm  from './components/ajout-document';

class Docutheques extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		const { user, currentState, currentDossierId, isAdvancedEditMode } = this.props;

		return (
			<Fragment>
				<DocuthequesHeader
					user={ user }
					dossier={ currentDossierId }
					isAdvancedEditMode={ isAdvancedEditMode }
				/>
				<div className="corps-docutheques">
					<DocuthequesToolbar />
					<DocuthequesDossiers />

					{ 'documentForm' === currentState && (
						<DocuthequesDocumentForm
							user= { user }
							dossier={ currentDossierId }
						/>
					) }

					{ 'dossierForm' === currentState && (
						<DocuthequesDossierForm
							user= { user }
							dossier={ currentDossierId }
						/>
					) }

					{ 'documentsBrowser' === currentState && (
						<DocuthequesDocuments
							dossier={ currentDossierId }
						/>
					) }
				</div>
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
			isAdvancedEditMode: docuThequesStore.isAdvancedEditMode(),
		};
	} ),
] )( Docutheques );

render( <DocuthequesAdministration />, document.querySelector( '#docutheques' ) );
