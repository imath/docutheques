<?php
/**
 * DocuThèques: des bibliothèques de documents dans votre WordPress.
 *
 * @package   docutheques
 * @author    imath
 * @license   GPL-2.0+
 * @link      https://imathi.eu
 *
 * @wordpress-plugin
 * Plugin Name:       DocuThèques
 * Plugin URI:        https://github.com/imath/docutheques
 * Description:       DocuThèques: des bibliothèques de documents dans votre WordPress.
 * Version:           1.0.0-alpha
 * Author:            imath
 * Author URI:        https://imathi.eu
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages/
 * Text Domain:       docutheques
 * GitHub Plugin URI: https://github.com/imath/docutheques
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main Class
 *
 * @since 1.0.0
 */
final class Docutheques {
	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	protected static $instance = null;

	/**
	 * Initializes the plugin.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		// Autoload Classes.
		spl_autoload_register( array( $this, 'autoload' ) );

		// Includes path.
		$inc_path = plugin_dir_path( __FILE__ ) . 'inc/';

		// Load Globals & Functions.
		require $inc_path . 'globals.php';
		require $inc_path . 'functions.php';

		// Load Admin.
		if ( is_admin() ) {
			require $inc_path . 'admin.php';
		}
	}

	/**
	 * Class Autoload function.
	 *
	 * @since  1.0.0
	 *
	 * @param  string $class The class name.
	 */
	public function autoload( $class ) {
		$name = str_replace( '_', '-', strtolower( $class ) );

		if ( 0 !== strpos( $name, 'docutheques' ) ) {
			return;
		}

		$path = plugin_dir_path( __FILE__ ) . "inc/classes/class-{$name}.php";

		// Sanity check.
		if ( ! file_exists( $path ) ) {
			return;
		}

		require $path;
	}

	/**
	 * Returns an instance of this class.
	 *
	 * @since 1.0.0
	 */
	public static function start() {
		// If the single instance hasn't been set, set it now.
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}

/**
 * Starts the plugin.
 *
 * @since 6.0.0
 *
 * @return Docutheques The main instance of the plugin.
 */
function docutheques() {
	return Docutheques::start();
}
add_action( 'plugins_loaded', 'docutheques', 9 );
