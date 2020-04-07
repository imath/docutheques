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
 * Outputs plugin's Administration page.
 *
 * @since 1.0.0
 */
function docutheques_admin() {
	wp_enqueue_script( 'docutheques-app' );
	wp_enqueue_style( 'docutheques-app' );

	// Preloads Plugin's data.
	$preload_data = array_reduce(
		array(
			'/wp/v2/users/me?context=edit',
			'/wp/v2/dossiers?context=edit',
			'/wp/v2/media?dossiers[]=0&per_page=20&context=edit',
		),
		'rest_preload_api_request',
		array()
	);

	// Create the Fetch API Preloading middleware.
	wp_add_inline_script(
		'wp-api-fetch',
		sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
		'after'
	);

	printf( '<div class="wrap" id="docutheques"></div>' );
}

/**
 * Outputs plugin's options page.
 *
 * @since 1.0.0
 */
function docutheques_admin_options() {
	printf(
		'<div class="wrap"><h1 class="wp-heading-inline">%s</h1><hr class="wp-header-end"></div>',
		esc_html__( 'Réglages des DocuThèques', 'docutheques' )
	);
}

/**
 * Adds menu items for the plugin.
 *
 * @since 1.0.0
 */
function docutheques_admin_menu() {
	add_options_page(
		__( 'Réglages des DocuThèques', 'docutheques' ),
		__( 'DocuThèques', 'docutheques' ),
		'manage_options',
		'docutheques-options',
		'docutheques_admin_options',
		5
	);

	add_menu_page(
		__( 'Administration des DocuThèques', 'docutheques' ),
		__( 'DocuThèques', 'docutheques' ),
		'manage_categories',
		'docutheques',
		'docutheques_admin',
		'dashicons-portfolio',
		12
	);
}
add_action( 'admin_menu', 'docutheques_admin_menu' );
