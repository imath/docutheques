/**
 * WordPress dependencies.
 */
const { registerBlockType } = wp.blocks;
const { createElement, Fragment } = wp.element;
const { Placeholder, Disabled, Toolbar, ToolbarButton, PanelBody, SelectControl } = wp.components;
const { BlockControls, InspectorControls } = wp.blockEditor;
const { ServerSideRender } = wp.editor;
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import DocuThequesAutoCompleter from './components/autocompleter';

const editDocuThequesBrowser = ( { attributes, setAttributes } ) => {
	const { orderDocumentsBy, orderDossiersBy } = attributes;

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
			<InspectorControls>
				<PanelBody title={ __( 'Réglages', 'docutheques' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Classer les dossiers :', 'docutheques' ) }
						value={ orderDossiersBy }
						onChange={ ( order ) => {
							setAttributes( { orderDossiersBy: order } );
						} }
						options={ [
							{ label: __( 'Alphabétiquement (A - Z)', 'docutheques' ), value: 'name' },
							{ label: __( 'Les plus récents en premier (31 - 1)', 'docutheques' ), value: 'newer' },
							{ label: __( 'Les moins récents en premier (1 - 31)', 'docutheques' ), value: 'older' },
						] }
					/>
					<SelectControl
						label={ __( 'Classer les documents selon leur :', 'docutheques' ) }
						value={ orderDocumentsBy }
						onChange={ ( order ) => {
							setAttributes( { orderDocumentsBy: order } );
						} }
						options={ [
							{ label: __( 'Date de publication (31 - 1)', 'docutheques' ), value: 'date' },
							{ label: __( 'Date de modification (31 - 1)', 'docutheques' ), value: 'modified' },
							{ label: __( 'Nom (A - Z)', 'docutheques' ), value: 'title' },
						] }
					/>
				</PanelBody>
			</InspectorControls>
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

	title: __( 'DocuThèques', 'docutheques' ),

	description: __( 'Explorateur de documents.', 'docutheques' ),

	icon: 'portfolio',

	category: 'widgets',

	attributes: {
		dossierID: {
			type: 'integer',
			default: 0,
		},
		orderDocumentsBy: {
			type: 'string',
			default: 'date',
			enum: ['date', 'modified', 'title'],
		},
		orderDossiersBy: {
			type: 'string',
			default: 'name',
			enum: ['newer', 'older', 'name'],
		},
	},

	edit: editDocuThequesBrowser,
} );
