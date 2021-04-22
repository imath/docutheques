/**
 * WordPress dependencies.
 */
const { Component, Fragment, createElement } = wp.element;
const { Popover } = wp.components;
const { withDispatch, dispatch } = wp.data;
const { compose } = wp.compose;
const { __, sprintf } = wp.i18n;

/**
 * Internal dependencies.
 */
import DocuThequeVignette from './vignette';
import DocuThequesConfirmerSuppression from './confirmer-suppression';

const MIME_TYPES = {
	'application/msword': 'document',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
	'application/pdf': 'document',
	'application/vnd.ms-excel': 'spreadsheet',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
	'application/vnd.ms-powerpoint': 'interactive',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'interactive',
	'audio/mpeg': 'audio',
	'audio/wav': 'audio',
	'video/avi': 'video',
	'video/quicktime': 'video',
	'video/mp4': 'video',
	'video/x-ms-wmv': 'video',
	'video/mpeg': 'video',
	'application/zip': 'archive',
}

const Icon = ( { type } ) => {
	let icon = 'default';

	if ( 'image' === type ) {
		icon = 'image';
	} else if ( MIME_TYPES[ type ] ) {
		icon = MIME_TYPES[ type ];
	}

	return <DocuThequeVignette icon={ 'media-' + icon } />;
}

class DocuthequesDocument extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			popoverIsVisible: false,
			isDeleteDocumentModalOpen: false,
		};

		this.doClose = this.doClose.bind( this );
		this.catchClick = this.catchClick.bind( this );
		this.closeConfirmationModal = this.closeConfirmationModal.bind( this );
		this.doDeleteDocument = this.doDeleteDocument.bind( this );
	}

	onMediaClick( id, e ) {
		e.preventDefault();

		const { isAdvancedEditMode, toggleDocumentSelection, isSelected } = this.props;
		const { popoverIsVisible } = this.state;

		if ( ! isAdvancedEditMode ) {
			this.setState( { popoverIsVisible: ! popoverIsVisible } );
			return;
		}

		return toggleDocumentSelection( id, ! isSelected );
	}

	catchClick( e ) {
		const element = e.target;

		if ( element ) {
			if ( element.getAttribute( 'href' ) ) {
				window.open( element.getAttribute( 'href' ), '_blank' );
			} else if ( element.getAttribute( 'data-action' ) ) {
				this.documentAction( element.getAttribute( 'data-action' ) );
			}
		}
	}

	doClose( e ) {
		e.preventDefault();

		const { popoverIsVisible } = this.state;
		this.setState( { popoverIsVisible: ! popoverIsVisible } );
	}

	documentAction( action ) {
		const { toggleDocumentSelection, isSelected, id } = this.props;

		dispatch( 'docutheques' ).switchMode( true );
		toggleDocumentSelection( id, ! isSelected );

		if ( 'delete' === action ) {
			this.setState( { isDeleteDocumentModalOpen: true } );

		} else {
			dispatch( 'docutheques' ).setCurrentState( 'documentsEditForm' );
			dispatch( 'docutheques' ).resetUploads();
		}
	}

	closeConfirmationModal() {
		const { toggleDocumentSelection, isSelected, id } = this.props;

		dispatch( 'docutheques' ).switchMode( false );
		toggleDocumentSelection( id, ! isSelected );
		dispatch( 'docutheques' ).setCurrentState( 'documentsBrowser' );

		this.setState( { isDeleteDocumentModalOpen: false } );
	}

	doDeleteDocument() {
		const { id, title } = this.props;

		dispatch( 'docutheques' ).deleteDocument( id, title );

		this.setState( { isDeleteDocumentModalOpen: false } );
	}

	render() {
		const {
			id,
			title,
			createdDate,
			modifiedDate,
			link,
			type,
			isSelected,
			isAdvancedEditMode,
			downloads,
			sourceName,
		} = this.props;
		const { popoverIsVisible, isDeleteDocumentModalOpen } = this.state;
		let classes = 'media-item unselectable';
		let sourceFileName = sourceName ? sourceName : title;

		if ( isAdvancedEditMode ) {
			classes = 'media-item selectable';

			if ( isSelected ) {
				classes += ' selected';
			}
		}

		// Looks like WP CLI can't find _n() usage.

		/* translators: %d: is the number of times the file was downloaded. */
		let downloadsCount = sprintf( __( 'Nombre de téléchargement : %d', 'docutheques' ), downloads );
		if ( parseInt( downloads, 10 ) > 1 ) {
			/* translators: %d: is the number of times the file was downloaded. */
			downloadsCount = sprintf( __( 'Nombre de téléchargements : %d', 'docutheques' ), downloads );
		}

		return (
			<Fragment>
				<div
					className={ classes }
					role="checkbox"
					onClick={ ( e ) => this.onMediaClick( id, e ) }
				>
					{ popoverIsVisible && (
						<Popover focusOnMount="container" position="bottom center" onClick={ this.catchClick } onFocusOutside={ this.doClose }>
							<p><strong>{ __( 'Date de publication :', 'docutheques' ) }</strong> { createdDate }</p>
							<p><strong>{ __( 'Date de modification :', 'docutheques' ) }</strong> { modifiedDate }</p>
							<p><strong>{ __( 'Fichier source :', 'docutheques' ) }</strong><a href={ link } className="fichier-source">{ sourceFileName }</a></p>
							<p>
							{ downloadsCount }
							</p>
							<p className="document-action">
								<button type="button" className="button-link edit-document" data-action="edit">{ __( 'Modifier', 'docutheques' ) }</button>
								<button type="button" className="button-link delete-document" data-action="delete">{ __( 'Supprimer', 'docutheques' ) }</button>
							</p>
						</Popover>
					) }
					<div className="item-preview">
						<div className="vignette">
							<div className="centered">
								<Icon type={ type } />
							</div>
							<div className="media-name">
								<div>{ title }</div>
							</div>
						</div>
					</div>
					{ isAdvancedEditMode && isSelected && (
						<button type="button" className="check" tabIndex="-1">
							<span className="media-modal-icon"></span>
							<span className="screen-reader-text">{ __( 'Retirer de la sélection.', 'docutheques' ) }</span>
						</button>
					) }
				</div>

				{ isDeleteDocumentModalOpen && (
					<DocuThequesConfirmerSuppression
						title={ __( 'Supprimer le document', 'docutheques' ) }
						onRequestClose={ this.closeConfirmationModal }
						confirmMessage={ __( 'Cette action est irréversible, merci de confirmer que vous souhaitez supprimer un document.', 'docutheques' ) }
						onConfirm={ this.doDeleteDocument }
						onCancel={ this.closeConfirmationModal }
					/>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch ) => ( {
		toggleDocumentSelection( id, isSelected ) {
			dispatch( 'docutheques' ).toggleDocumentSelection( id, isSelected );
		},
	} ) ),
] )( DocuthequesDocument );
