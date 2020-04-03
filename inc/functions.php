<?php
/**
 * Docutheques Functions.
 *
 * @package   docutheques
 * @subpackage \inc\functions
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Returns the plugin's current version.
 *
 * @since 1.0.0
 */
function docutheques_version() {
	return docutheques()->version;
}

/**
 * Registers DocuThèques taxonomy, scripts and styles.
 *
 * @since 1.0.0
 */
function docutheques_init() {
	$docutheques = docutheques();

	// Registers the App's JavaScript file.
	wp_register_script(
		'docutheques-app',
		trailingslashit( $docutheques->url ) . 'js/app/index.js',
		array(
			'wp-element',
			'wp-i18n',
		),
		$docutheques->version,
		true
	);

	// Registers the Browser Block's JavaScript file.
	wp_register_script(
		'docutheques-browser',
		trailingslashit( $docutheques->url ) . 'js/block/index.js',
		array(
			'wp-blocks',
			'wp-element',
			'wp-i18n',
		),
		$docutheques->version,
		true
	);

	// Registers the Browser Block.
	register_block_type(
		'docutheques/browser',
		array(
			'editor_script' => 'docutheques-browser',
		)
	);
}
add_action( 'init', 'docutheques_init', 20 );
