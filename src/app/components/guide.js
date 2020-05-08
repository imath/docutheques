/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Guide, GuidePage } = wp.components;
const { __ } = wp.i18n;

class DocuthequesGuide extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isOpen: false,
		}
	}

	openGuide( e ) {
		e.preventDefault();

		this.setState( { isOpen: true } );
	}

	render() {
		const { isOpen } = this.state;

		if ( ! isOpen ) {
			return (
				<button className="open dashicons dashicons-editor-help" onClick={ ( e ) => this.openGuide( e ) }>
					<span className="screen-reader-text">{ __( 'Ouvrir le guide d’utilisation', 'docutheques' ) }</span>
				</button>
			);
		}

		return (
			<Guide onFinish={ () => this.setState( { isOpen: false } ) } contentLabel={ __( 'Guide d’utilisation', 'docutheques' ) }>
				<GuidePage>
					<p>{ __( 'Première page du guide d’utilisation', 'docutheques' ) }</p>
				</GuidePage>

				<GuidePage>
				<p>{ __( 'Deuxième page du guide d’utilisation', 'docutheques' ) }</p>
				</GuidePage>
			</Guide>
		);
	}
}

export default DocuthequesGuide;
