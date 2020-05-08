/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Guide, GuidePage } = wp.components;
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import AjouterDocuThequeAnimation from './animations/ajouter-docutheque';
import RacineAnimation from './animations/racine';
import AjouterDossierAnimation from './animations/ajouter-dossier';

class DocuthequesGuide extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isOpen: false,
		}
	}

	openGuide( e ) {
		e.preventDefault();

		this.setState( { isOpen: true } );
	}

	render() {
		const { isOpen } = this.state;

		if ( ! isOpen ) {
			return (
				<button className="open dashicons dashicons-editor-help" onClick={ ( e ) => this.openGuide( e ) }>
					<span className="screen-reader-text">{ __( 'Ouvrir le guide d’utilisation', 'docutheques' ) }</span>
				</button>
			);
		}

		return (
			<Guide onFinish={ () => this.setState( { isOpen: false } ) } contentLabel={ __( 'Guide d’utilisation', 'docutheques' ) }>
				<GuidePage>
					<RacineAnimation />
					<p>{ __( 'Par défaut, l’écran d’administration des DocuThèques présente tous les media de WordPress qui ne sont pas attachés à une DocuThèque au niveau de la racine de l’arborescence affichée dans la barre latérale de gauche.', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
					<AjouterDocuThequeAnimation />
					<p>{ __( 'Pour ajouter une DocuThèque, cliquez sur le bouton en forme de « + », positionné juste après le titre de l’écran d’administration des DocuThèques, pour afficher le menu d’insertion de documents ou d’une DocuThèque.', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
					<AjouterDossierAnimation />
					<p>{ __( 'Pour ajouter un dossier ou un document à votre DocuThèque, activez dans un premier temps votre DocuThèque en cliquant sur son titre depuis l’arborescence. Ensuite, cliquez sur le bouton en forme de « + » pour afficher le menu d’insertion de documents ou d’un dossier.', 'docutheques' ) }</p>
				</GuidePage>
			</Guide>
		);
	}
}

export default DocuthequesGuide;
