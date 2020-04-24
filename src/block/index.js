/**
 * WordPress dependencies.
 */
const { registerBlockType } = wp.blocks;
const { createElement, Fragment } = wp.element;
const { Placeholder, Disabled, Toolbar, ToolbarButton } = wp.components;
const { BlockControls } = wp.blockEditor;
const { ServerSideRender } = wp.editor;
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import DocuThequesAutoCompleter from './components/autocompleter';

const editDocuThequesBrowser = ( { attributes, setAttributes } ) => {
	if ( ! attributes.dossierID ) {
		return (
			<Placeholder
				icon="portfolio"
				label={ __( 'DocuThèques', 'docutheques' ) }
				instructions={ __( 'Commencer à saisir le nom de la DocuThèque que vous souhaitez intégrer dans cette publication.', 'docutheques' ) }
			>
				<DocuThequesAutoCompleter
					onSelectDossier={ setAttributes }
				/>
			</Placeholder>
		);
	}

	return (
		<Fragment>
			<BlockControls>
				<Toolbar>
					<ToolbarButton
						icon="edit"
						title={ __( 'Choisir une autre DocuThèque', 'docutheques' ) }
						onClick={ () =>{
							setAttributes( { dossierID: 0 } );
						} }
					/>
				</Toolbar>
			</BlockControls>
			<Disabled>
				<ServerSideRender block="docutheques/browser" attributes={ attributes } />
			</Disabled>
		</Fragment>
	);
};

registerBlockType( 'docutheques/browser', {
	supports: {
		className: false,
		anchor: false,
		multiple: false,
		reusable: false,
	},

	title: __( 'DocuTheques', 'docutheques' ),

	description: __( 'Explorateur de documents.', 'docutheques' ),

	icon: 'portfolio',

	category: 'widgets',

	attributes: {
		dossierID: {
			type: 'integer',
			default: 0,
		},
	},

	edit: editDocuThequesBrowser,
} );
