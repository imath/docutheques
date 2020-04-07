/**
 * WordPress dependencies
 */
const { Component, createElement } = wp.element;
const { Dashicon } = wp.components;
const { __ } = wp.i18n;

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
							<Dashicon icon="media-default" />
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
