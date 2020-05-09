/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Guide, GuidePage } = wp.components;
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import DocuThequeAnimation from './animations/docutheque';
import RacineAnimation from './animations/racine';
import AjouterDocuThequeAnimation from './animations/ajouter-docutheque';
import AjouterDossierAnimation from './animations/ajouter-dossier';
import ModifierDossierAnimation from './animations/modifier-dossier';
import ModifierDocumentsAnimation from './animations/modifier-documents';

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
			<Guide className="guide-docutheques" onFinish={ () => this.setState( { isOpen: false } ) } contentLabel={ __( 'Guide d’utilisation', 'docutheques' ) }>
				<GuidePage>
					<strong className="titre-guidepage">{ __( 'Découvrez DocuThèques', 'docutheques' ) }</strong>
					<DocuThequeAnimation />
					<p>{ __( 'Une DocuThèque ressemble à un répertoire de fichiers pouvant contenir autant de dossiers qu’il vous semble nécessaires pour y organiser vos documents et les rendre disponibles en téléchargement aux visiteurs de votre site.', 'docutheques' ) }</p>
					<p>{ __( 'Vous pouvez créer autant de DocuThèques que vous le souhaitez. Notez toutefois qu’une seule DocuThèque peut être insérée dans une même page de votre site.', 'docutheques' ) }</p>
					<p>{ __( 'Cet espace est dédié à la gestion de vos DocuThèques. Pour les insérer dans des pages de votre site, il s’agit d’utilier le bloc DocuThèques de votre éditeur de contenus WordPress.', 'docutheques' ) }</p>
					<p>{ __( 'Les documents ajoutés à une DocuThèque bénéficient d’un lien de téléchargement unique, invariable et ce jusqu’à leurs éventuelles suppressions définitives.', 'docutheques' ) }</p>
					<p>{ __( 'La barre latérale de gauche de cet écran d’administration affiche l’arborescence de vos DocuThèques. L’élément actif de cette dernière (texte blanc sur fond bleu) vous indique l’emplacement dans lequel vous ajouterez vos nouveaux dossiers et documents.', 'docuthéques' ) }</p>
				</GuidePage>

				<GuidePage>
					<strong className="titre-guidepage">{ __( 'État initial de l’interface', 'docutheques' ) }</strong>
					<RacineAnimation />
					<p>{ __( 'Par défaut, l’écran d’administration des DocuThèques présente tous les media de WordPress qui ne sont pas attachés à une DocuThèque au niveau de la racine de l’arborescence affichée dans la barre latérale de gauche.', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
					<strong className="titre-guidepage">{ __( 'Créer une DocuThèque', 'docutheques' ) }</strong>
					<AjouterDocuThequeAnimation />
					<p>{ __( 'Pour ajouter une DocuThèque, cliquez sur le bouton en forme de « + », positionné juste après le titre de l’écran d’administration des DocuThèques. Un menu d’insertion de documents ou d’une DocuThèque vous sera alors proposé.', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
					<strong className="titre-guidepage">{ __( 'Ajouter des éléments à une DocuThèque', 'docutheques' ) }</strong>
					<AjouterDossierAnimation />
					<p>{ __( 'Pour ajouter un dossier ou un document à votre DocuThèque, activez dans un premier temps votre DocuThèque en cliquant sur son titre depuis l’arborescence. Ensuite, cliquez sur le bouton en forme de « + » pour afficher le menu d’insertion de documents ou d’un dossier.', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
					<strong className="titre-guidepage">{ __( 'Modifier une DocuThèque ou un de ses dossiers', 'docutheques' ) }</strong>
					<ModifierDossierAnimation />
					<p>{ __( 'Activez dans un premier temps l’élément de votre choix en cliquant sur son titre depuis l’arborescence. Ensuite, cliquez sur le bouton en forme d’écrou de la barre d’outils pour basculer en mode d’édition avancée. La barre d’outils vous proposera alors deux nouveaux boutons pour modifier ou supprimer votre élément.', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
					<strong className="titre-guidepage">{ __( 'Modifier un ou plusieurs documents', 'docutheques' ) }</strong>
					<ModifierDocumentsAnimation />
					<p>{ __( 'En cliquant sur le bouton en forme d’écrou de la barre d’outils, vous basculez en mode d’édition avancée afin de pouvoir modifier, déplacer ou supprimer un ou plusieurs documents. Les boutons d’action apparaissent dans la barre d’outils lorsque vous cliquez sur la vignette des documents.', 'docutheques' ) }</p>
				</GuidePage>

			</Guide>
		);
	}
}

export default DocuthequesGuide;
