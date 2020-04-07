/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Dashicon } = wp.components;
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
	}

	onMediaClick( id, e ) {
		e.preventDefault();
	}

	render() {
		const {
			id,
			title,
			createdDate,
			modifiedDate,
			link,
			type
		} = this.props;

		return (
			<div
				className="media-item"
				role="checkbox"
				onClick={ ( e ) => this.onMediaClick( id, e ) }
			>
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
			</div>
		);
	}
}

export default DocuthequesDocument;
