<?php
/**
 * DocuThèques Document template.
 *
 * @package docutheques
 * @subpackage \templates\docutheques-document
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="docutheque-document">
	<div class="docutheque-vignette">
		<a href="{{ data.docutheques_download_url }}" title="{{ data.docutheques_download }}">
			<img width="48" height="64" src="{{ data.docutheques_icon_url }}" class="attachment-thumbnail size-thumbnail" alt="" loading="lazy">
		</a>
	</div>
	<div class="docutheque-description">
		<div class="docutheque-title">
			<a href="{{ data.docutheques_download_url }}" title="{{ data.docutheques_download }}">
				{{{ data.title.rendered }}}
			</a>
		</div>
		<div class="docutheque-dates">
			<div class="docutheque-date">
				<strong class="docutheque-label"><?php esc_html_e( 'Publié le :', 'docutheques' ); ?></strong>
				<time datetime="{{ data.date }}">{{ data.docutheques_pub_date }}</time>
			</div>
			<div class="docutheque-update">
				<span><?php esc_html_e( 'Mis à jour le :', 'deocutheques' ); ?></span>
				<time datetime="{{ data.modified }}">{{ data.docutheques_mod_date }}</time>
			</div>
		</div>
	</div>
</div>
