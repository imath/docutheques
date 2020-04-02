/**
 * WordPress dependencies.
 */
const { registerBlockType } = wp.blocks;
const { createElement } = wp.element;
const { __ } = wp.i18n;

registerBlockType( 'docutheques/browser', {
	title: __( 'Explorateur', 'docutheques' ),

	description: __( 'Explorateur de documents.', 'docutheques' ),

	icon: 'portfolio',

	category: 'widgets',

	attributes: {},

	edit: function( { attributes, setAttributes } ) {
		return(
			<p>{ __( 'Explorateur de documents.', 'docutheques' ) }</p>
		)
	}
} );
