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
		add_filter( 'rest_pre_insert_attachment', array( $this, 'update_attachment' ), 10, 2 );
		add_action( 'edit_attachment', array( $this, 'edit_attachment_guid' ), 10, 1 );

		$response = parent::update_item( $request );

		remove_filter( 'rest_pre_insert_attachment', array( $this, 'update_attachment' ), 10, 2 );
		remove_action( 'edit_attachment', array( $this, 'edit_attachment_guid' ), 10, 1 );

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
		$is_docutheque_widget = 1 === (int) $request->get_param( 'docutheques_widget' );
		$response             = parent::prepare_item_for_response( $post, $request );

		if ( ! $is_docutheque_widget ) {
			return $response;
		}

		$data = $response->get_data();
		if ( 'image' !== $data['media_type'] ) {
			$icon_data = wp_get_attachment_image_src( $post->ID, 'thumbnail', true );
			if ( $icon_data ) {
				$icon_url = reset( $icon_data );
				$data['docutheques_icon_url'] = $icon_url;
			}

		} else {
			$data['docutheques_icon_url'] = docutheques_get_default_image_src();
		}

		$data['docutheques_pub_date'] = date_i18n( get_option( 'date_format' ), strtotime( $data['date'] ) );
		$data['docutheques_download'] = sprintf(
			/* translators: %s is the placeholder for the document title */
			__( 'Télécharger %s', 'docutheques' ),
			reset( $data['title'] )
		);

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
}
