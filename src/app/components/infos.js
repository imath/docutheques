/**
 * WordPress dependencies.
 */
const { Component, createElement } = wp.element;
const { Notice, Dashicon } = wp.components;
const { __ } = wp.i18n;

class DocuthequesInfos extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		return (
			<div className="docutheques-infos">
				<Notice
					status="info"
					isDismissible={ false }
				>
					<p>
						<Dashicon icon="info" />
						{ __( 'Ce dossier ne contient aucun document pour le moment.', 'docutheques' ) }
					</p>
				</Notice>
			</div>
		);
	}
}

export default DocuthequesInfos;
