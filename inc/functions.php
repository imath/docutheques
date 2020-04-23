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
			'wp-components',
			'wp-i18n',
			'wp-editor',
			'wp-block-editor',
			'wp-api-fetch',
		),
		$docutheques->version,
		true
	);

	// Registers the the Browser Block's style.
	wp_register_style(
		'docutheques-widget',
		trailingslashit( $docutheques->url ) . 'css/widget.css',
		array(),
		$docutheques->version
	);

	// Registers the Browser Block.
	register_block_type(
		'docutheques/browser',
		array(
			'editor_script'   => 'docutheques-browser',
			'style'           => 'docutheques-widget',
			'render_callback' => 'docutheques_render_block',
			'attributes'      => array(
				'dossierID' => array(
					'type'    => 'integer',
					'default' => 0,
				),
			),
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

	// Reset the Attachment REST controller.
	$attachment_post_type = get_post_type_object( 'attachment' );
	if ( isset( $attachment_post_type->rest_controller_class ) && 'DocuTheques_REST_Documents_Controller' !== $attachment_post_type->rest_controller_class ) {
		$attachment_post_type->rest_controller_class = 'DocuTheques_REST_Documents_Controller';
	}
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
 * Init the documents list for the deleted dossiers.
 *
 * @since 1.0.0
 *
 * @param int    $term     Term ID.
 * @param string $taxonomy Taxonomy Name.
 */
function docutheques_is_deleting_dossier( $term = 0, $taxonomy = '' ) {
	if ( 'dossiers' === $taxonomy ) {
		$docutheques = docutheques();

		$key_dossier = 'term_id_' . $term;
		if ( ! isset( $docutheques->deleting_dossier[ $key_dossier ] ) ) {
			$docutheques->deleting_dossier = array_merge( $docutheques->deleting_dossier, array( $key_dossier => array() ) );
		}
	}
}
add_action( 'pre_delete_term', 'docutheques_is_deleting_dossier', 10, 2 );

/**
 * Catch all documents to delete with the deleted dossiers.
 *
 * @since 1.0.0
 *
 * @param int   $term         Term ID.
 * @param int   $tt_id        Term taxonomy ID.
 * @param mixed $deleted_term Copy of the already-deleted term, in the form specified
 *                            by the parent function. WP_Error otherwise.
 * @param array $object_ids   List of term object IDs.
 */
function docutheques_deleted_dossier_get_documents( $term = 0, $tt_id = 0, $deleted_term = null, $object_ids ) {
	$docutheques = docutheques();
	$dossier_key = 'term_id_' . $term;

	if ( isset( $docutheques->deleting_dossier[ $dossier_key ] ) ) {
		$docutheques->deleting_dossier[ $dossier_key ] = $object_ids;
	}
}
add_action( 'delete_dossiers', 'docutheques_deleted_dossier_get_documents', 10, 4 );

/**
 * Completely deletes the content of a dossier.
 *
 * @since 1.0.0
 *
 * @param WP_Term          $term     The deleted term.
 * @param WP_REST_Response $response The response data.
 * @param WP_REST_Request  $request  The request sent to the API.
 */
function docutheques_delete_dossier( $term, $response, $request ) {
	$sous_dossiers    = $request->get_param( 'sousDossiers' );
	$delete_documents = $request->get_param( 'deleteDocuments' );

	if ( $sous_dossiers ) {
		foreach ( wp_parse_id_list( $sous_dossiers ) as $sous_dossier_id ) {
			wp_delete_term( $sous_dossier_id, 'dossiers' );
		}
	}

	if ( $delete_documents ) {
		$alldossiers  = array_merge( $sous_dossiers, array( $term->term_id ) );
		$alldocuments = docutheques()->deleting_dossier;

		foreach ( $alldossiers as $dossier_id ) {
			$key = 'term_id_' . $dossier_id;

			if ( isset( $alldocuments[ $key ] ) ) {
				foreach ( $alldocuments[ $key ] as $document_id ) {
					wp_delete_attachment( (int) $document_id, true );
				}
			}
		}
	}
}
add_action( 'rest_delete_dossiers', 'docutheques_delete_dossier', 10, 3 );

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
		// Ordering by date can generate errors due to attachments batch uploads.
		$args['orderby'] = 'ID';

		add_action( 'parse_query', 'docutheques_documents_reset_querried_dossiers' );
	}

	return $args;
}
add_filter( 'rest_attachment_query', 'docutheques_documents_rest_get_args', 10, 2 );

/**
 * Sets the dossier the document is attached to.
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

/**
 * Callback function to render the DocuThèques Block.
 *
 * @since 1.0.0
 *
 * @param array $attributes The block attributes.
 * @return string           HTML output.
 */
function docutheques_render_block( $attributes = array() ) {
	$block_args = wp_parse_args(
		$attributes,
		array(
			'dossierID' => 0,
		)
	);

	$docutheque_id    = (int) $block_args['dossierID'];
	$dossiers         = array();
	$documents        = array();
	$document_headers = array();
	$output           = '';

	if ( $docutheque_id ) {
		$dossiers_path  = sprintf( '/wp/v2/dossiers?parent=%d&context=view', $docutheque_id );
		$documents_path = sprintf( '/wp/v2/media?dossiers[]=%d&per_page=20&context=view', $docutheque_id );

		// Preloads Plugin's data.
		$preload_data = array_reduce(
			array(
				$dossiers_path,
				$documents_path,
			),
			'rest_preload_api_request',
			array()
		);

		if ( isset( $preload_data[ $documents_path ] ) && $preload_data[ $documents_path ] ) {
			$image_icon = sprintf(
				'<img width="48" height="64" src="%s" class="attachment-thumbnail size-thumbnail" alt="" loading="lazy">',
				esc_url( docutheques()->url . '/images/image.png' )
			);

			foreach ( $preload_data[ $documents_path ] as $document_elements => $document_data ) {
				if ( 'body' === $document_elements ) {
					foreach ( $document_data as $document ) {
						$icon = '';
						if ( 'image' !== $document['media_type'] ) {
							$icon = wp_get_attachment_image( $document['id'], 'thumbnail', true );
						} else {
							$icon = $image_icon;
						}

						$documents[] = sprintf(
							'<div class="docutheques-document">
								<div class="docutheques-vignette">
									<a href="%1$s" title="%2$s">
										%3$s
									</a>
								</div>
								<div class="docutheques-description">
									<div class="docutheques-title">
										<a href="%1$s" title="%2$s">
											%4$s
										</a>
									</div>
									<div class="docutheques-pubdate">
										<strong class="docutheques-label">%5$s</strong>
										<time datetime="%6$s">%7$s</time>
									</div>
								</div>
							</div>',
							esc_url( $document['link'] ),
							sprintf(
								/* translators: %s is the placeholder for the document title */
								esc_attr__( 'Télécharger %s', 'docutheques' ),
								esc_html( reset( $document['title'] ) )
							),
							$icon,
							reset( $document['title'] ),
							esc_html__( 'Publié le :', 'docuthèques' ),
							esc_attr( $document['date'] ),
							esc_html( date_i18n( get_option( 'date_format' ), strtotime( $document['date'] ) ) )
						);
					}
				} elseif ( 'headers' === $document_elements ) {
					$document_headers = $document_data;
				}
			}

			if ( isset( $preload_data[ $dossiers_path ] ) && $preload_data[ $documents_path ] ) {
				$dossier_icon = sprintf(
					'<img width="48" height="38" src="%s" class="attachment-thumbnail size-thumbnail" alt="" loading="lazy">',
					esc_url( docutheques()->url . '/images/category.png' )
				);

				foreach ( $preload_data[ $dossiers_path ] as $dossier_elements => $dossier_data ) {
					if ( 'body' !== $dossier_elements ) {
						continue;
					}

					foreach ( $dossier_data as $dossier ) {
						$dossiers[] = sprintf(
							'<div class="docutheques-dossier" id="dossier-%1$d">
								<div class="docutheques-vignette">
									<a href="#dossier-%1$d" title="%2$s">
										%3$s
									</a>
								</div>
								<div class="docutheques-description">
									<div class="docutheques-title">
										<a href="#dossier-%1$d" title="%2$s">
											%4$s
										</a>
									</div>
								</div>
							</div>',
							absint( $dossier['id'] ),
							sprintf(
								/* translators: %s is the placeholder for the name of the dossier */
								esc_attr__( 'Ouvrir le dossier %s', 'docutheques' ),
								esc_html( $dossier['name'] )
							),
							$dossier_icon,
							$dossier['name']
						);
					}
				}
			}

			// Merge Dossiers and Documents.
			$docutheque_items = array_merge( $dossiers, $documents );

			if ( $docutheque_items ) {
				$output = sprintf(
					'<ul class="docutheques" id="%d">%s</ul>',
					absint( $docutheque_id ),
					'<li>' . implode( '</li><li>', $docutheque_items ) . '</li>'
				);
			}
		}
	}

	/**
	 * Filter here to override the block output.
	 *
	 * @since 1.0.0
	 *
	 * @param string  $output        HTML Output.
	 * @param integer $docutheque_id The DocuThèque ID.
	 * @param array   $preload_data  The preloaded data for this DocuThèque.
	 */
	return apply_filters( 'docutheques_render_block_output', $output, $docutheque_id, $preload_data );
}
