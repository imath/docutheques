<?php
/**
 * REST API: DocuTheques_REST_Documents_Controller class.
 *
 * @package DocuTheques
 * @subpackage \inc\classes\class-docutheques-rest-documents-controller
 * @since 1.0.0
 */

/**
 * Controller used to access documents via the REST API.
 *
 * @since 1.0.0
 *
 * @see WP_REST_Attachments_Controller
 */
class DocuTheques_REST_Documents_Controller extends WP_REST_Attachments_Controller {
	/**
	 * The updated document.
	 *
	 * @since 1.0.0
	 * @var stdClass
	 */
	protected $updated_document;

	/**
	 * Is this REST request a DocuThèques one?
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request The REST request used.
	 * @param string          $type    The context to check (`'widget'`, `'admin'` or any of these `''`).
	 * @return boolean                 True if the REST request is a DocuThèques one. False otherwise.
	 */
	public function is_docutheques( $request, $type = '' ) {
		$headers = $request->get_headers();
		$referer = '';
		if ( isset( $headers['referer'] ) ) {
			$referer = reset( $headers['referer'] );
		}

		$is_docutheque_admin  = add_query_arg( 'page', 'docutheques', admin_url( 'admin.php' ) ) === $referer;
		$is_docutheque_widget = 1 === (int) $request->get_param( 'docutheques_widget' );

		if ( 'admin' === $type ) {
			return $is_docutheque_admin;
		} elseif ( 'widget' === $type ) {
			return $is_docutheque_widget;
		}

		return $is_docutheque_admin || $is_docutheque_widget;
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
	public function documents_set_args( $args, $request ) {
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

	/**
	 * Retrieves a collection of attachments or documents.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$is_docutheques = $this->is_docutheques( $request );

		if ( $is_docutheques ) {
			add_filter( 'rest_attachment_query', array( $this, 'documents_set_args' ), 10, 2 );
		}

		$response = parent::get_items( $request );

		if ( $is_docutheques ) {
			remove_filter( 'rest_attachment_query', array( $this, 'documents_set_args' ), 10, 2 );
		}

		return $response;
	}

	/**
	 * Sets the dossier the document is attached to.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post         $document Inserted or updated document
	 *                                  object.
	 * @param WP_REST_Request $request  The request sent to the API.
	 */
	public function save_document( $document, $request ) {
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

	/**
	 * Creates a single attachment or document.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$is_docutheques = $this->is_docutheques( $request, 'admin' );

		if ( $is_docutheques ) {
			add_action( 'rest_insert_attachment', array( $this, 'save_document' ), 10, 2 );
		}

		$response = parent::create_item( $request );

		if ( $is_docutheques ) {
			remove_filter( 'rest_insert_attachment', array( $this, 'save_document' ), 10, 2 );
		}

		return $response;
	}

	/**
	 * Updates the attachment guid field.
	 *
	 * @since 1.0.0
	 *
	 * @param integer $document_id The document ID.
	 */
	public function edit_attachment_guid( $document_id ) {
		if ( isset( $this->updated_document->ID, $this->updated_document->guid ) && (int) $this->updated_document->ID === (int) $document_id ) {
			global $wpdb;

			$wpdb->update(
				$wpdb->posts,
				array(
					'guid' => $this->updated_document->guid,
				),
				array(
					'ID' => $document_id,
				)
			);

			clean_post_cache( $document_id );

			if ( isset( $this->updated_document->file ) ) {
				// Include media and image functions to get access to wp_generate_attachment_metadata().
				require_once ABSPATH . 'wp-admin/includes/media.php';
				require_once ABSPATH . 'wp-admin/includes/image.php';

				// Post-process the upload (create image sub-sizes, make PDF thumbnails, etc.) and insert attachment meta.
				wp_update_attachment_metadata( $document_id, wp_generate_attachment_metadata( $document_id, $this->updated_document->file ) );
			}
		}

		// Reset.
		unset( $this->updated_document );
	}

	/**
	 * Delete attachment files.
	 *
	 * @since 1.0.0
	 *
	 * @param integer $document_id The Document ID.
	 * @return boolean True if files were deleted. False otherwise.
	 */
	public function delete_attachment_files( $document_id ) {
		$meta         = wp_get_attachment_metadata( $document_id );
		$backup_sizes = get_post_meta( $document_id, '_wp_attachment_backup_sizes', true );
		$file         = get_attached_file( $document_id );

		if ( is_multisite() ) {
			delete_transient( 'dirsize_cache' );
		}

		return wp_delete_attachment_files( $document_id, $meta, $backup_sizes, $file );
	}

	/**
	 * Updates the attachment file.
	 *
	 * @since 1.0.0
	 *
	 * @param stdClass        $document An object representing a single post prepared
	 *                                  for inserting or updating the database.
	 * @param WP_REST_Request $request  Request object.
	 * @return stdClass                 The updated document object.
	 */
	public function update_attachment( $document, $request ) {
		$files   = $request->get_file_params();
		$headers = $request->get_headers();

		if ( ! empty( $files ) && ! empty( $document->ID ) ) {
			// Delete document's previous files.
			$this->delete_attachment_files( $document->ID );

			$file = $this->upload_from_file( $files, $headers );

			if ( is_wp_error( $file ) ) {
				return $file;
			}

			$document->file           = $file['file'];
			$document->post_mime_type = $file['type'];

			// The guid field is not saved in `wp_insert_post()` when updating an attachement.
			$this->updated_document       = $document;
			$this->updated_document->guid = $file['url'];
		}

		return $document;
	}

	/**
	 * Updates a document.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, WP_Error object on failure.
	 */
	public function update_item( $request ) {
		$is_docutheques = $this->is_docutheques( $request, 'admin' );

		if ( $is_docutheques ) {
			add_filter( 'rest_pre_insert_attachment', array( $this, 'update_attachment' ), 10, 2 );
			add_action( 'edit_attachment', array( $this, 'edit_attachment_guid' ), 10, 1 );
			add_action( 'rest_insert_attachment', array( $this, 'save_document' ), 10, 2 );
		}

		$response = parent::update_item( $request );

		if ( $is_docutheques ) {
			remove_filter( 'rest_pre_insert_attachment', array( $this, 'update_attachment' ), 10, 2 );
			remove_action( 'edit_attachment', array( $this, 'edit_attachment_guid' ), 10, 1 );
			remove_action( 'rest_insert_attachment', array( $this, 'save_document' ), 10, 2 );
		}

		return $response;
	}

	/**
	 * Prepares a single document output for response.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post         $post    Attachment object.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ) {
		$is_docutheques = $this->is_docutheques( $request );
		$response       = parent::prepare_item_for_response( $post, $request );

		if ( ! $is_docutheques ) {
			return $response;
		}

		$data = $response->get_data();

		if ( $this->is_docutheques( $request, 'widget' ) ) {
			if ( 'image' !== $data['media_type'] ) {
				$icon_data = wp_get_attachment_image_src( $post->ID, 'thumbnail', true );
				if ( $icon_data ) {
					$icon_url = reset( $icon_data );
					$data['docutheques_icon_url'] = $icon_url;
				}

			} else {
				$data['docutheques_icon_url'] = docutheques_get_default_image_src();
			}

			$data['docutheques_download'] = sprintf(
				/* translators: %s is the placeholder for the document title */
				__( 'Télécharger %s', 'docutheques' ),
				reset( $data['title'] )
			);
			$data['docutheques_download_url'] = docutheques_get_download_url( $post );
		}

		$data['docutheques_pub_date'] = date_i18n( get_option( 'date_format' ), strtotime( $data['date'] ) );
		$data['docutheques_mod_date'] = date_i18n( get_option( 'date_format' ), strtotime( $data['modified'] ) );

		$data['docutheques_source_name'] = '';
		if ( isset( $data['source_url'] ) && $data['source_url'] ) {
			$data['docutheques_source_name'] = wp_basename( $data['source_url'] );
		}

		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );

		/**
		 * Filters a document returned from the REST API.
		 *
		 * @since 1.0.0
		 *
		 * @param WP_REST_Response $response The response object.
		 * @param WP_Post          $post     The original document post.
		 * @param WP_REST_Request  $request  Request used to generate the response.
		 */
		return apply_filters( 'docutheques_rest_prepare_document', $response, $post, $request );
	}

	/**
	 * Prepares a single document for create or update.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return stdClass|WP_Error Post object.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_attachment = parent::prepare_item_for_database( $request );
		$files               = $request->get_file_params();

		// Replace simple quotes to avoid HTML characters in Document names.
		if ( isset( $files['file']['name'] ) ) {
			$document_name                   = preg_replace( '/\.[^.]+$/', '', wp_basename( $files['file']['name'] ) );
			$prepared_attachment->post_title = str_replace( '\'', '’', $document_name );
		} else {
			$prepared_attachment->post_title = str_replace( '\'', '’', $prepared_attachment->post_title );
		}

		return $prepared_attachment;
	}
}
