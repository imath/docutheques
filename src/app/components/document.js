/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Dashicon, Popover } = wp.components;
const { withDispatch } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

/**
 * Internal dependencies.
 */
import MediaImage from './media-image';

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
	if ( 'image' === type ) {
		return <MediaImage />;
	}

	let icon = 'default';
	if ( MIME_TYPES[ type ] ) {
		icon = MIME_TYPES[ type ];
	}

	return <Dashicon icon={ 'media-' + icon } />;
}

class DocuthequesDocument extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			popoverIsVisible: false,
		};

		this.doClose = this.doClose.bind( this );
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
		const link = e.target;

		if ( link && link.getAttribute( 'href' ) ) {
			window.open( link.getAttribute( 'href' ), '_blank' );
		}
	}

	doClose( e ) {
		e.preventDefault();

		const { popoverIsVisible } = this.state;
		this.setState( { popoverIsVisible: ! popoverIsVisible } );
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
		} = this.props;
		const { popoverIsVisible } = this.state;
		let classes = 'media-item unselectable';

		if ( isAdvancedEditMode ) {
			classes = 'media-item selectable';

			if ( isSelected ) {
				classes += ' selected';
			}
		}

		return (
			<div
				className={ classes }
				role="checkbox"
				onClick={ ( e ) => this.onMediaClick( id, e ) }
			>
				{ popoverIsVisible && (
					<Popover focusOnMount="container" position="bottom center" onClick={ this.catchClick } onFocusOutside={ this.doClose }>
						<p><strong>{ __( 'Date de publication :', 'docutheques' ) }</strong> { createdDate }</p>
						<p><strong>{ __( 'Date de modification :', 'docutheques' ) }</strong> { modifiedDate }</p>
						<p><strong>{ __( 'Fichier source :', 'docutheques' ) }</strong><a href={ link } className="fichier-source">{ title }</a></p>
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
