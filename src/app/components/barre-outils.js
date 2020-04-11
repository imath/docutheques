/**
 * WordPress dependencies
 */
const { Component, Fragment, createElement } = wp.element;
const { Button } = wp.components;
const { withSelect, dispatch } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

class DocuthequesToolbar extends Component {
	constructor() {
		super( ...arguments );
	}

	switchMode( e, mode ) {
		e.preventDefault();

		dispatch( 'docutheques' ).switchMode( mode );
	}

	render() {
		const { dossier, isAdvancedEditMode } = this.props;
		const documentsSelection = 0;
		let gridClass = 'view-grid';
		let avancedEditClass = 'view-list';

		if ( ! isAdvancedEditMode ) {
			gridClass += ' current';
		} else {
			avancedEditClass += ' current';
		}

		return (
			<div className="media-toolbar wp-filter">
				<div className="media-toolbar-secondary">
					<div className="view-switch media-grid-view-switch">
						<a href="#view-grid" className={ gridClass } onClick={ ( e ) => this.switchMode( e, false ) }>
							<span className="screen-reader-text">{ __( 'Afficher le mode d’édition simple', 'docutheques' ) }</span>
						</a>

						{ 0 !== dossier && (
							<a href="#edit-mode" className={ avancedEditClass } onClick={ ( e ) => this.switchMode( e, true ) }>
								<span className="screen-reader-text">{ __( 'Afficher le mode d’édition avancée', 'docutheques' ) }</span>
							</a>
						) }
					</div>

					{ isAdvancedEditMode && ! documentsSelection && (
						<Fragment>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button">
								{ __( 'Supprimer le dossier actif', 'docutheques' ) }
							</Button>
							<Button isLarge={ true } className="button media-button select-mode-toggle-button">
								{ __( 'Retirer les documents du dossier actif', 'docutheques' ) }
							</Button>
						</Fragment>
					) }
				</div>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		return {
			isAdvancedEditMode: select( 'docutheques' ).isAdvancedEditMode(),
		};
	} ),
] )( DocuthequesToolbar );
