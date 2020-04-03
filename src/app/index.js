/**
 * WordPress dependencies.
 */
const { Component, render, createElement, Fragment } = wp.element;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
 * Internal dependencies.
 */
import './store';
import DocuthequesHeader from './components/header';
import DocuthequesDossiers from './components/terms-tree'

class Docutheques extends Component {
	constructor() {
		super( ...arguments );

		this.state = {};
	}

	render() {
		const { user } = this.props;

		return (
			<Fragment>
				<DocuthequesHeader
					user={ user }
				/>
				<DocuthequesDossiers />
			</Fragment>
		);
	}
};

const DocuthequesAdministration = compose( [
	withSelect( ( select ) => {
		return {
			user: select( 'docutheques' ).getCurrentUser(),
		};
	} ),
] )( Docutheques );

render( <DocuthequesAdministration />, document.querySelector( '#docutheques' ) );
