/**
 * WordPress dependencies
 */
const { createElement } = wp.element;
const { Button, Modal } = wp.components;
const { __ } = wp.i18n;

const DocuThequesConfirmerSuppression = ( { title, onRequestClose, confirmMessage, onConfirm, onCancel } ) => {
	return (
		<Modal
			title={ title }
			onRequestClose={ onRequestClose }
			className="delete-document-confirmation"
		>

			<p>{ confirmMessage }</p>

			<div className="confirmation-buttons">
				<Button isLarge={ false } isPrimary={ true } onClick={ onConfirm }>
					{ __( 'Confirmer', 'docutheques' ) }
				</Button>

				<Button isLarge={ false } isSecondary={ true } onClick={ onCancel }>
					{ __( 'Annuler', 'docutheques' ) }
				</Button>
			</div>

		</Modal>
	);
};

export default DocuThequesConfirmerSuppression;
