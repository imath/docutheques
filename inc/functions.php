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
			'wp-components',
			'wp-compose',
			'wp-i18n',
			'wp-data',
			'wp-api-fetch',
			'lodash',
		),
		$docutheques->version,
		true
	);

	// Registers the App's style.
	wp_register_style(
		'docutheques-app',
		trailingslashit( $docutheques->url ) . 'css/app.css',
		array(
			'wp-components',
		),
		$docutheques->version
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

	// Registers the dossiers taxonomy.
	register_taxonomy(
		'dossiers',
		'attachment',
		array(
			'labels'             => array(
				'name'                  => _x( 'Dossiers', 'Taxonomy name', 'docutheques' ),
				'singular_name'         => _x( 'Dossier', 'Taxonomy singular name', 'docutheques' ),
				'search_items'          => _x( 'Rechercher des dossiers', 'Taxonomy search items label', 'docutheques' ),
				'all_items'             => _x( 'Tous les dossiers', 'Taxonomy all items label', 'docutheques' ),
				'parent_item'           => _x( 'Dossier parent', 'Taxonomy parent item label', 'docutheques' ),
				'parent_item_colon'     => _x( 'Dossier parent&nbsp;:', 'Taxonomy parent item colon label', 'docutheques' ),
				'edit_item'             => _x( 'Modifier le dossier', 'Taxonomy edit item label', 'docutheques' ),
				'view_item'             => _x( 'Afficher le dossier', 'Taxonomy view item label', 'docutheques' ),
				'update_item'           => _x( 'Mettre à jour le dossier', 'Taxonomy update item label', 'docutheques' ),
				'add_new_item'          => _x( 'Ajouter un dossier', 'Taxonomy add new item label', 'docutheques' ),
				'new_item_name'         => _x( 'Nom du dossier à ajouter', 'Taxonomy new item name label', 'docutheques' ),
				'not_found'             => _x( 'Aucun dossier trouvé', 'Taxonomy not found label', 'docutheques' ),
				'no_terms'              => _x( 'Aucun dossier affecté', 'Taxonomy no terms label', 'docutheques' ),
				'items_list_navigation' => _x( 'Navigation de la liste des dossiers', 'Taxonomy items list navigation label', 'docutheques' ),
				'items_list'            => _x( 'Liste des dossiers', 'Taxonomy items list label', 'docutheques' ),
				'most_used'             => _x( 'Les plus affectés', 'Taxonomy most used label', 'docutheques' ),
				'back_to_items'         => _x( 'Revenir sur tous les dossiers', 'Taxonomy most used label', 'docutheques' ),
			),
			'description'        => __( 'Catégorie permettant de référencer et de hiérarchiser les documents dans des dossiers.', 'docutheques' ),
			'public'             => true,
			'publicly_queryable' => false,
			'hierarchical'       => true,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'show_in_nav_menus'  => false,
			'show_in_rest'       => true,
			'show_in_quick_edit' => false,
			'show_admin_column'  => false,
			'capabilities'       => array(
				'manage_terms' => 'manage_categories',
				'edit_terms'   => 'manage_categories',
				'delete_terms' => 'manage_categories',
				'assign_terms' => 'upload_files',
			),
			'rewrite'            => true,
			'query_var'          => 'docutheques-dossier',
		)
	);
}
add_action( 'init', 'docutheques_init', 20 );

/**
 * Forces the REST GET requests to return all dossiers.
 *
 * @since 1.0.0
 *
 * @param array $args Array of arguments to be passed to get_terms().
 */
function docutheques_dossiers_rest_get_args( $args = array() ) {
	$number = (int) wp_count_terms( 'dossiers' );

	if ( ! $number ) {
		return $args;
	}

	return array_merge(
		$args,
		array(
			'number' => wp_count_terms( 'dossiers' ),
			'offset' => 0,
		)
	);
}
add_filter( 'rest_dossiers_query', 'docutheques_dossiers_rest_get_args' );

/**
 * Resets the queried dossiers as 0 was requested.
 *
 * @since 1.0.0
 *
 * @param WP_Query $wp_query The WP_Query instance.
 */
function docutheques_documents_reset_querried_dossiers( $wp_query ) {
	remove_action( 'parse_query', 'docutheques_documents_reset_querried_dossiers' );

	if ( isset( $wp_query->query['tax_query'] ) ) {
		foreach ( $wp_query->query['tax_query'] as $kq_tq => $q_tax_query ) {
			if ( 'dossiers' !== $q_tax_query['taxonomy'] ) {
				continue;
			}

			unset( $wp_query->query['tax_query'][ $kq_tq ]['field'], $wp_query->query['tax_query'][ $kq_tq ]['terms'] );
			$wp_query->query['tax_query'][ $kq_tq ]['operator'] = 'NOT EXISTS';
		}
	}

	if ( isset( $wp_query->query_vars['tax_query'] ) ) {
		foreach ( $wp_query->query_vars['tax_query'] as $kqv_tq => $qv_tax_query ) {
			if ( 'dossiers' !== $qv_tax_query['taxonomy'] ) {
				continue;
			}

			unset( $wp_query->query_vars['tax_query'][ $kqv_tq ]['field'], $wp_query->query_vars['tax_query'][ $kqv_tq ]['terms'] );
			$wp_query->query_vars['tax_query'][ $kqv_tq ]['operator'] = 'NOT EXISTS';
		}
	}

	if ( isset( $wp_query->tax_query ) ) {
		foreach ( $wp_query->tax_query->queries as $ktq => $tax_query ) {
			if ( 'dossiers' !== $tax_query['taxonomy'] ) {
				continue;
			}

			$wp_query->tax_query->queries[ $ktq ]['terms']    = array();
			$wp_query->tax_query->queries[ $ktq ]['operator'] = 'NOT EXISTS';
		}

		if ( isset( $wp_query->tax_query->queried_terms['dossiers'] ) ) {
			$wp_query->tax_query->queried_terms['dossiers'] = array( 'field' => 'term_id' );
		}
	}
}

/**
 * Filters the attachment query arguments for a `get_items` request.
 *
 * @since 1.0.0
 *
 * @param array           $args    Key value array of query var to query value.
 * @param WP_REST_Request $request The request used.
 * @return array                   Unchanged arguments.
 */
function docutheques_documents_rest_get_args( $args = array(), $request ) {
	$has_dossiers_param = $request->get_param( 'dossiers' );

	if ( ! $has_dossiers_param ) {
		return $args;
	}

	if ( ! array_filter( $has_dossiers_param ) ) {
		add_action( 'parse_query', 'docutheques_documents_reset_querried_dossiers' );
	}

	return $args;
}
add_filter( 'rest_attachment_query', 'docutheques_documents_rest_get_args', 10, 2 );

/**
 * Saves the dossier the document is attached to.
 *
 * @since 1.0.0
 *
 * @param WP_Post         $document Inserted or updated document
 *                                  object.
 * @param WP_REST_Request $request  The request sent to the API.
 */
function docutheques_rest_save_document( $document, $request ) {
	$dossiers = $request->get_param( 'dossiers' );

	if ( $dossiers ) {
		$dossier = (int) reset( $dossiers );

		if ( $dossier ) {
			$result = wp_set_object_terms( $document->ID, $dossier, 'dossiers' );

			if ( is_wp_error( $result ) ) {
				return $result;
			}
		}
	}
}
add_action( 'rest_insert_attachment', 'docutheques_rest_save_document', 10, 2 );
