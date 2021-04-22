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
 * Loads translations.
 *
 * @since 1.0.0
 */
function docutheques_translate() {
	load_plugin_textdomain( 'docutheques', false, trailingslashit( basename( docutheques()->dir ) ) . 'languages' );
}
add_action( 'plugins_loaded', 'docutheques_translate', 20 );

/**
 * Returns the plugin's current version.
 *
 * @since 1.0.0
 */
function docutheques_version() {
	return docutheques()->version;
}

/**
 * Get the JS minified suffix.
 *
 * @since  1.0.0
 *
 * @return string the JS minified suffix.
 */
function docutheques_min_suffix() {
	$min = '.min';

	if ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) {
		$min = '';
	}

	/**
	 * Filter here to edit the minified suffix.
	 *
	 * @since  1.0.0
	 *
	 * @param  string $min The minified suffix.
	 */
	return apply_filters( 'docutheques_min_suffix', $min );
}

/**
 * Registers DocuThèques taxonomy, scripts and styles.
 *
 * @since 1.0.0
 */
function docutheques_init() {
	$docutheques  = docutheques();
	$min          = docutheques_min_suffix();
	$spinner      = admin_url( 'images/spinner-2x.gif' );
	$fetching_css = array(
		sprintf( 'background-image: url(%s);', esc_url( $spinner ) ),
		'background-position: center;',
		'height: 100px;',
		'background-repeat: no-repeat;',
	);

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
		trailingslashit( $docutheques->url ) . "css/app{$min}.css",
		array(
			'wp-components',
		),
		$docutheques->version
	);

	wp_add_inline_style(
		'docutheques-app',
		sprintf(
			'#docutheques .liste-documents div.docutheques-fetching {
				%s
			}',
			join( "\n", $fetching_css )
		)
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
		trailingslashit( $docutheques->url ) . "css/widget{$min}.css",
		array(),
		$docutheques->version
	);

	wp_add_inline_style(
		'docutheques-widget',
		sprintf(
			'.docutheque ul.docutheque-elements li.loading {
				%s
			}',
			join( "\n", $fetching_css )
		)
	);

	// Registers the Browser Block.
	register_block_type(
		'docutheques/browser',
		array(
			'editor_script'   => 'docutheques-browser',
			'style'           => 'docutheques-widget',
			'render_callback' => 'docutheques_render_block',
			'attributes'      => array(
				'dossierID'        => array(
					'type'    => 'integer',
					'default' => 0,
				),
				'orderDocumentsBy' => array(
					'type'    => 'string',
					'default' => 'date',
					'enum'    => array( 'date', 'modified', 'title' ),
				),
				'orderDossiersBy'  => array(
					'type'    => 'string',
					'default' => 'name',
					'enum'    => array( 'newer', 'older', 'name' ),
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
				'back_to_items'         => _x( 'Revenir sur tous les dossiers', 'Back to all Taxonomy terms', 'docutheques' ),
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

	// Add a postmeta to track downloads count.
	register_post_meta(
		'attachment',
		'_docutheques_downloads_count',
		array(
			'single'       => true,
			'type'         => 'boolean',
			'show_in_rest' => array(
				'name'   => 'docutheques_downloads_count',
				'schema' => array(
					'type'    => 'integer',
					'default' => 0,
				),
			),
		)
	);

	// Download Rewrite rule.
	add_rewrite_tag( '%docutheques%', '([^/]+)' );
	add_rewrite_rule( 'docutheques/([^/]+)/?$', 'index.php?docutheques=$matches[1]', 'top' );
	add_permastruct(
		'docutheques',
		'docutheques/%docutheques%',
		array(
			'with_front'  => false,
			'ep_mask'     => EP_NONE,
			'paged'       => false,
			'feed'        => false,
			'forcomments' => false,
			'walk_dirs'   => false,
			'endpoints'   => false,
		)
	);
}
add_action( 'init', 'docutheques_init', 20 );

/**
 * Registers the Widget script only on front end.
 *
 * @since 1.0.0
 */
function docutheques_register_widget_script() {
	$docutheques = docutheques();

	// Registers the Widget's JavaScript file.
	wp_register_script(
		'docutheques-widget',
		trailingslashit( $docutheques->url ) . 'js/widget/index.js',
		array( 'lodash' ),
		$docutheques->version,
		true
	);

	$companion_style_path = get_theme_file_path( 'css/docutheques.css' );

	// Registers the Widget's companion styles if available.
	if ( file_exists( $companion_style_path ) ) {
		wp_register_style(
			'docutheques-widget-companion',
			esc_url_raw( get_theme_file_uri( 'css/docutheques.css' ) ),
			array(),
			$docutheques->version
		);
	}
}
add_action( 'wp_enqueue_scripts', 'docutheques_register_widget_script', 1 );

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
function docutheques_deleted_dossier_get_documents( $term = 0, $tt_id = 0, $deleted_term = null, $object_ids = array() ) {
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
 * Gets the URL to a needed default image.
 *
 * @since 1.0.0
 *
 * @param string $name The name of the default image to get the URL for.
 * @return string The URL to the needed default image.
 */
function docutheques_get_default_image_src( $name = 'image' ) {
	if ( ! in_array( $name, array( 'image', 'category' ), true ) ) {
		return '';
	}

	return docutheques()->url . sprintf( 'images/%s.png', $name );
}

/**
 * Loads the needed DocuThèques template.
 *
 * @since 1.0.0
 *
 * @param string $name The DocuThèques template name.
 */
function docutheques_get_template( $name = 'docutheques-document' ) {
	$template = sprintf( '%s.php', $name );

	$located = locate_template( $template, false );

	if ( ! $located ) {
		$located = docutheques()->tmpl . '/' . $template;
	}

	load_template( $located, false );
}

/**
 * Buffers the needed DocuThèques template.
 *
 * @since 1.0.0
 *
 * @param string $name The DocuThèques template name.
 * @return string HTML Output.
 */
function docutheques_buffer_template( $name = 'docutheques-document' ) {
	ob_start();

	docutheques_get_template( $name );

	// Get the output buffer contents.
	return ob_get_clean();
}

/**
 * Outputs the DocuThèques JS templates into the site's footer.
 *
 * @since 1.0.0
 */
function docutheques_templates() {
	?>
	<script type="html/template" id="tmpl-docutheque-breadcrumbs">
		<ol>
			<# if ( data.link ) { #>
				<li>
					<a href="#dossier-{{ data.id }}" title="<?php esc_attr_e( 'Ouvrir le dossier', 'docutheques' ); ?>" class="ouvre-dossier">
						<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="docutheque-icon" role="img" aria-hidden="true" focusable="false">
							<path d="M5 7h13v10H2V4h7l2 2H4v9h1V7z" style="fill-rule: nonzero;"></path>
						</svg>
					</a>
					<a href="#dossier-{{ data.id }}" title="<?php esc_attr_e( 'Ouvrir le dossier', 'docutheques' ); ?>" class="ouvre-dossier">
						{{{ data.name }}}
					</a>
				</li>
				<li class="fil-ariane-docutheque-items" id="sous-dossier-{{ data.id }}"></li>
			<# } else { #>
				<li>
					<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="docutheque-icon" role="img" aria-hidden="true" focusable="false">
						<path d="M5 7h13v10H2V4h7l2 2H4v9h1V7z" style="fill-rule: nonzero;"></path>
					</svg>
					{{{ data.name }}}
				</li>
			<# } #>
		</ol>
	</script>

	<script type="html/template" id="tmpl-docutheque-element">
		<li>
			<# if ( data.noItems ) { #>
				<div class="docutheque-feedback">
					<p>{{ data.noItems }}</p>
				</div>
			<# } else if ( data.title ) { #>
				<?php docutheques_get_template( 'docutheques-document', true ); ?>
			<# } else { #>
				<?php docutheques_get_template( 'docutheques-dossier', true ); ?>
			<# } #>
		</li>
	</script>
	<?php
}

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
			'dossierID'        => 0,
			'orderDocumentsBy' => 'date',
			'orderDossiersBy'  => 'name',
		)
	);

	$docutheque_id      = (int) $block_args['dossierID'];
	$order_documents_by = $block_args['orderDocumentsBy'];
	$order_documents    = 'desc';
	$order_dossiers_by  = $block_args['orderDossiersBy'];
	$order_dossiers     = 'asc';

	// Validate the documents sort order.
	if ( ! in_array( $order_documents_by, array( 'date', 'modified', 'title' ), true ) ) {
		$order_documents_by = 'date';
	}

	// Validate the dossiers sort order.
	if ( ! in_array( $order_dossiers_by, array( 'newer', 'older', 'name' ), true ) ) {
		$order_dossiers_by = 'name';
	}

	if ( 'newer' === $order_dossiers_by || 'older' === $order_dossiers_by ) {
		if ( 'newer' === $order_dossiers_by ) {
			$order_dossiers = 'desc';
		}

		$order_dossiers_by = 'id';
	}

	if ( 'title' === $order_documents_by ) {
		$order_documents = 'asc';
	}

	// Init variables.
	$docutheque_name      = __( 'Docuthèque', 'docutheques' );
	$docutheque_hierarchy = array();
	$dossiers             = array();
	$documents            = array();
	$document_headers     = array();
	$output               = '';
	$preload_data         = array();

	if ( $docutheque_id ) {
		$dossier_includes    = array( $docutheque_id );
		$docutheque_children = get_term_children( $docutheque_id, 'dossiers' );

		if ( ! is_wp_error( $docutheque_children ) ) {
			$dossier_includes = array_merge( $dossier_includes, $docutheque_children );
		}

		$dossiers_path  = sprintf( '/wp/v2/dossiers?context=view&orderby=%1$s&order=%2$s&include[]=%3$s', $order_dossiers_by, $order_dossiers, implode( '&include[]=', $dossier_includes ) );
		$documents_path = sprintf( '/wp/v2/media?dossiers[]=%1$d&per_page=20&docutheques_widget=1&context=view&orderby=%2$s&order=%3$s', $docutheque_id, $order_documents_by, $order_documents );

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
			$default_icon_url  = includes_url( 'images/media/default.png' );
			$document_template = docutheques_buffer_template( 'docutheques-document' );

			foreach ( $preload_data[ $documents_path ] as $document_elements => $document_data ) {
				if ( 'body' === $document_elements ) {
					foreach ( $document_data as $document ) {
						if ( isset( $document['docutheques_icon_url'] ) && $document['docutheques_icon_url'] ) {
							$icon_url = $document['docutheques_icon_url'];
						} else {
							$icon_url = $default_icon_url;
						}

						$documents[] = str_replace(
							array(
								'{{ data.docutheques_download_url }}',
								'{{ data.docutheques_download }}',
								'{{ data.docutheques_icon_url }}',
								'{{{ data.title.rendered }}}',
								'{{ data.date }}',
								'{{ data.docutheques_pub_date }}',
								'{{ data.modified }}',
								'{{ data.docutheques_mod_date }}',
							),
							array(
								esc_url( $document['docutheques_download_url'] ),
								esc_attr( $document['docutheques_download'] ),
								esc_url( $icon_url ),
								reset( $document['title'] ),
								esc_attr( $document['date'] ),
								esc_html( $document['docutheques_pub_date'] ),
								esc_attr( $document['modified'] ),
								esc_html( $document['docutheques_mod_date'] ),
							),
							$document_template
						);
					}
				} elseif ( 'headers' === $document_elements ) {
					$document_headers = $document_data;
				}
			}

			if ( isset( $preload_data[ $dossiers_path ] ) && $preload_data[ $documents_path ] ) {
				$dossier_template = docutheques_buffer_template( 'docutheques-dossier' );

				foreach ( $preload_data[ $dossiers_path ] as $dossier_elements => $dossier_data ) {
					if ( 'body' !== $dossier_elements ) {
						continue;
					}

					foreach ( $dossier_data as $dossier ) {
						$docutheque_hierarchy[] = array(
							'id'     => (int) $dossier['id'],
							'parent' => (int) $dossier['parent'],
							'name'   => esc_html( $dossier['name'] ),
						);

						if ( $docutheque_id !== (int) $dossier['parent'] ) {
							if ( $docutheque_id === (int) $dossier['id'] ) {
								$docutheque_name = $dossier['name'];
							}

							continue;
						}

						$dossiers[] = str_replace(
							array(
								'{{ data.id }}',
								'{{{ data.name }}}',
							),
							array(
								absint( $dossier['id'] ),
								esc_html( $dossier['name'] ),
							),
							$dossier_template
						);
					}
				}
			}

			// Merge Dossiers and Documents.
			$docutheque_items = array_merge( $dossiers, $documents );

			if ( $docutheque_items ) {
				$output = sprintf(
					'<div class="docutheque" id="docutheque-%1$d">
						<ol class="fil-ariane-docutheque">
							<li>
								<a href="#docutheque-%1$d" class="racine-docutheque racine-docutheque-icon">
									<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="docutheque-icon" role="img" aria-hidden="true" focusable="false">
										<path d="M4 5H.78c-.37 0-.74.32-.69.84l1.56 9.99S3.5 8.47 3.86 6.7c.11-.53.61-.7.98-.7H10s-.7-2.08-.77-2.31C9.11 3.25 8.89 3 8.45 3H5.14c-.36 0-.7.23-.8.64C4.25 4.04 4 5 4 5zm4.88 0h-4s.42-1 .87-1h2.13c.48 0 1 1 1 1zM2.67 16.25c-.31.47-.76.75-1.26.75h15.73c.54 0 .92-.31 1.03-.83.44-2.19 1.68-8.44 1.68-8.44.07-.5-.3-.73-.62-.73H16V5.53c0-.16-.26-.53-.66-.53h-3.76c-.52 0-.87.58-.87.58L10 7H5.59c-.32 0-.63.19-.69.5 0 0-1.59 6.7-1.72 7.33-.07.37-.22.99-.51 1.42zM15.38 7H11s.58-1 1.13-1h2.29c.71 0 .96 1 .96 1z" style="fill-rule: nonzero;"></path>
									</svg>
								</a>
								<a href="#docutheque-%1$d" class="racine-docutheque">
									%2$s
								</a>
								<li class="fil-ariane-docutheque-items" id="fil-ariane-docutheque-%1$s"></li>
							</li>
						</ol>
						<ul class="docutheque-elements" id="docutheque-elements-%1$d">%3$s</ul>
					</div>',
					absint( $docutheque_id ),
					esc_html( $docutheque_name ),
					'<li>' . implode( '</li><li>', $docutheque_items ) . '</li>'
				);
			}
		}
	}

	wp_enqueue_script( 'docutheques-widget' );
	wp_localize_script(
		'docutheques-widget',
		'DocuTheques',
		array(
			'settings' => array(
				'restRoot'          => esc_url_raw( get_rest_url() ),
				'restNonce'         => wp_create_nonce( 'wp_rest' ),
				'hierarchy'         => wp_json_encode( $docutheque_hierarchy ),
				'documentsTotal'    => wp_json_encode( $document_headers ),
				'currentParentId'   => $docutheque_id,
				'dossierHasNoItems' => __( 'Ce dossier ne contient aucun élément pour le moment.', 'docutheques' ),
				'orderBy'           => wp_json_encode(
					array(
						'by'    => $order_documents_by,
						'order' => $order_documents,
					)
				),
			),
		)
	);

	// Enqueue the Widget companion styles if available.
	wp_enqueue_style( 'docutheques-widget-companion' );

	// Set JS translations.
	wp_set_script_translations( 'docutheques-widget', 'docutheques', docutheques()->lang_path );

	add_action( 'wp_footer', 'docutheques_templates' );

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

/**
 * Returns the download URL for a DocuThèques Item.
 *
 * @since 1.0.0
 *
 * @param WP_Post $document The DocuThèques Item object.
 * @return string The download URL for the DocuThèques Item.
 */
function docutheques_get_download_url( $document = null ) {
	$document = get_post( $document );

	if ( ! isset( $document->post_name ) || ! $document->post_name ) {
		return '';
	}

	global $wp_rewrite;

	// Pretty permalinks.
	if ( $wp_rewrite->using_permalinks() ) {
		$url = $wp_rewrite->root . 'docutheques/%docutheques%';
		$url = str_replace( '%docutheques%', $document->post_name, $url );
		$url = home_url( user_trailingslashit( $url ) );
	} else {
		// Unpretty permalinks.
		$url = add_query_arg( array( 'docutheques' => $document->post_name ), home_url( '/' ) );
	}

	return $url;
}

/**
 * Downloads a given The DocuThèques Item's attached file.
 *
 * @since 1.0.0
 *
 * @param WP_Post $document The DocuThèques Item object.
 */
function docutheque_download( $document = null ) {
	if ( empty( $document->attached_file ) || ! file_exists( $document->attached_file ) ) {
		return false;
	}

	$filesize = filesize( $document->attached_file );
	$filedata = wp_check_filetype( $document->attached_file );

	if ( empty( $filedata['ext'] ) || empty( $filedata['type'] ) ) {
		return false;
	}

	$filename = sprintf( '%1$s.%2$s', $document->post_name, $filedata['ext'] );
	$filetype = $filedata['type'];

	$downloads = (int) get_post_meta( $document->ID, '_docutheques_downloads_count', true );
	if ( ! $downloads ) {
		$downloads = 0;
	}

	// Update the downloads count.
	update_post_meta( $document->ID, '_docutheques_downloads_count', ++$downloads );

	/**
	 * Hook here to run custom actions before download.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post $document The DocuThèques Item object.
	 * @param integer $filesize  The file size.
	 * @param string $filename  The file name.
	 */
	do_action( 'docutheques_before_download', $document, $filesize, $filename );

	status_header( 200 );
	header( 'Cache-Control: cache, must-revalidate' );
	header( 'Pragma: public' );
	header( 'Content-Description: File Transfer' );
	header( 'Content-Length: ' . $filesize );
	header( 'Content-Disposition: attachment; filename=' . $filename );
	header( 'Content-Type: ' . $filetype );

	while ( ob_get_level() > 0 ) {
		ob_end_flush();
	}

	readfile( $document->attached_file ); // phpcs:ignore
	die();
}

/**
 * Checks whether the current URL is a DocuThèque download one.
 * If so download the document attached file.
 *
 * @since  1.0.0
 *
 * @param WP_Query $query The WordPress Main Query.
 */
function docutheque_parse_query( WP_Query $query ) {
	$bail = false;

	if ( ! $query->is_main_query() || true === $query->get( 'suppress_filters' ) ) {
		$bail = true;
	}

	if ( ! $bail && is_admin() ) {
		$bail = ! wp_doing_ajax();
	}

	if ( $bail ) {
		return;
	}

	$document_name = $query->get( 'docutheques' );
	if ( ! $document_name || true === $query->is_embed ) {
		return;
	}

	// Set the document being requested.
	$document = get_posts(
		array(
			'name'      => $document_name,
			'post_type' => 'attachment',
		)
	);

	if ( $document && is_array( $document ) && 1 === count( $document ) ) {
		$document_object = get_post( $document[0] );

		$attached_file = get_attached_file( $document_object->ID );
		if ( ! $attached_file ) {
			$query->set_404();
			return;
		} else {
			$document_object->attached_file = $attached_file;
			if ( ! docutheque_download( $document_object ) ) {
				$query->set_404();
				return;
			}
		}
	} else {
		$query->set_404();
		return;
	}
}
add_action( 'parse_query', 'docutheque_parse_query' );
