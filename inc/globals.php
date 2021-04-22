<?php
/**
 * DocuThèques Globals.
 *
 * @package docutheques
 * @subpackage \inc\globals
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register plugin globals.
 *
 * @since 1.0.0
 */
function docutheques_globals() {
	$docutheques = docutheques();

	$docutheques->version = '1.0.1';

	// Path.
	$docutheques->dir = plugin_dir_path( dirname( __FILE__ ) );

	// Templates dir.
	$docutheques->tmpl = trailingslashit( $docutheques->dir ) . 'templates';

	// Languages path.
	$docutheques->lang_path = trailingslashit( dirname( dirname( __FILE__ ) ) ) . 'languages';

	// URL.
	$docutheques->url = plugin_dir_url( dirname( __FILE__ ) );

	// List of catched objects when the dossier is being deleted.
	$docutheques->deleting_dossier = array();
}
add_action( 'plugins_loaded', 'docutheques_globals' );
