<?php
/**
 * DocuThèques Dossier template.
 *
 * @package docutheques
 * @subpackage \templates\docutheques-dossier
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="docutheque-dossier" id="dossier-{{ data.id }}">
	<div class="docutheque-vignette">
		<a href="#dossier-{{ data.id }}" title="<?php esc_attr_e( 'Ouvrir le dossier', 'docutheques' ); ?>" class="ouvre-dossier">
			<img width="48" height="38" src="<?php echo esc_url( docutheques_get_default_image_src( 'category' ) ); ?>" class="attachment-thumbnail size-thumbnail" alt="" loading="lazy">
		</a>
	</div>
	<div class="docutheque-description">
		<div class="docutheque-title">
			<a href="#dossier-{{ data.id }}" title="<?php esc_attr_e( 'Ouvrir le dossier', 'docutheques' ); ?>" class="ouvre-dossier">
				{{{ data.name }}}
			</a>
		</div>
	</div>
</div>
