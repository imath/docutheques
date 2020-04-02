<?php
/**
 * DocuThèques Admin.
 *
 * @package docutheques
 * @subpackage \inc\admin
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Outputs plugin's options page.
 *
 * @since 1.0.0
 */
function docutheques_admin() {
	wp_enqueue_script( 'docutheques-app' );

	printf(
		'<div class="wrap"><h1 class="wp-heading-inline">%s</h1><hr class="wp-header-end"><div id="docutheques"></div></div>',
		esc_html__( 'Réglages des DocuThèques', 'docutheques' )
	);
}

/**
 * Adds an option page for the plugin.
 *
 * @since 1.0.0
 */
function docutheques_options_page() {
	add_options_page(
		__( 'Réglages des DocuThèques', 'docutheques' ),
		__( 'DocuThèques', 'docutheques' ),
		'manage_options',
		'docutheques',
		'docutheques_admin'
	);
}
add_action( 'admin_menu', 'docutheques_options_page' );
