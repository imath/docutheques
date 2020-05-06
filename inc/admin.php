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
 * Adds an Administration menu item for the plugin.
 *
 * @since 1.0.0
 */
function docutheques_admin_menu() {
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

/**
 * Only allow the DocuThèques block in WordPress pages.
 *
 * @since 1.0.0
 *
 * @param boolean|array $allowed_block_types Array of block type slugs, or
 *                                           boolean to enable/disable all.
 * @param WP_Post       $post                The post resource data.
 * @return boolean|array The allowed block types.
 */
function docutheques_browser_block_is_allowed( $allowed_block_types, $post ) {
	if ( 'page' !== get_post_type( $post ) ) {
		unregister_block_type( 'docutheques/browser' );
	}

	return $allowed_block_types;
}
add_filter( 'allowed_block_types', 'docutheques_browser_block_is_allowed', 10, 2 );

/**
 * Installs the plugin.
 *
 * @since 1.0.0
 */
function docutheques_admin_install() {
	// Simply make sure permalinks will be refreshed at next page load.
	delete_option( 'rewrite_rules' );
}

/**
 * Checks whether the plugin needs to be updated.
 *
 * @since 1.0.0
 */
function docutheques_admin_updater() {
	$db_version      = get_option( '_docutheques_version', '' );
	$current_version = docutheques_version();

	// DocuThèques is up to date.
	if ( $db_version && version_compare( $db_version, $current_version, '=' ) ) {
		return;
	}

	if ( ! $db_version ) {
		docutheques_admin_install();
	} elseif ( version_compare( $db_version, $current_version, '<' ) ) {
		wp_die( esc_html__( 'Il n’y a qu’une seule version stable de pour l’extension DocuThèques', 'docutheques' ) );
	}

	// Bump DocuThèques version.
	update_option( '_docutheques_version', $current_version );
}
add_action( 'admin_init', 'docutheques_admin_updater', 1999 );
