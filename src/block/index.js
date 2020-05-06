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
	const { orderBy } = attributes;

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
						label={ __( 'Classer les documents et dossiers selon leur :', 'reception' ) }
						value={ orderBy }
						onChange={ ( order ) => {
							setAttributes( { orderBy: order } );
						} }
						options={ [
							{ label: __( 'date de modification (31 - 1)', 'docutheques' ), value: 'date' },
							{ label: __( 'nom (A - Z)', 'docutheques' ), value: 'name' },
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

	title: __( 'DocuTheques', 'docutheques' ),

	description: __( 'Explorateur de documents.', 'docutheques' ),

	icon: 'portfolio',

	category: 'widgets',

	attributes: {
		dossierID: {
			type: 'integer',
			default: 0,
		},
		orderBy: {
			type: 'string',
			default: 'date',
			enum: ['date', 'name'],
		},
	},

	edit: editDocuThequesBrowser,
} );
