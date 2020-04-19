/**
 * WordPress dependencies.
 */
const { Component, Fragment, createElement } = wp.element;
const { Popover } = wp.components;
const { apiFetch } = wp;
const { __ } = wp.i18n;

class DocuThequesAutoCompleter extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			search: '',
			dossiers: [],
			error: '',
		};

		this.searchDossierName = this.searchDossierName.bind( this );
		this.selectDossierName = this.selectDossierName.bind( this );
	}

	searchDossierName( value ) {
		const { search } = this.state;
		this.setState( { search: value } );

		if ( value.length < search.length ) {
			this.setState( { dossiers: [] } );
		}

		let path= '/wp/v2/dossiers?parent=0';

		if ( value ) {
			path += '&search=' + encodeURIComponent( value );
		}

		apiFetch( { path:  path } ).then( dossiers => {
			this.setState( { dossiers: dossiers } );
		}, error => {
			this.setState( { error: error.message } );
		} );
	}

	selectDossierName( event, dossierID ) {
		const { onSelectDossier } = this.props;
		event.preventDefault();

		this.setState( {
			search: '',
			dossiers: [],
			error: '',
		} );

		return onSelectDossier( { dossierID: dossierID } );
	}

	render() {
		const { search, dossiers } = this.state;
		const ariaLabel = __( 'Nom du dossier', 'docutheques' );
		const placeholder = __( 'Entrer le nom du dossier ici…', 'docutheques' );
		let dossiersList;

		if ( dossiers.length ) {
			dossiersList = dossiers.map( ( dossier ) => {
				return (
					<button
						type="button" key={ 'editor-autocompleters__item-item-' + dossier.id }
						role="option"
						aria-selected="true"
						className="components-button components-autocomplete__result editor-autocompleters__user"
						onClick={ ( event ) => this.selectDossierName( event, dossier.id ) }
					>
						<span key="name" className="editor-autocompleters__user-name">{ dossier.name }</span>
					</button>
				);
			} );
		}

		return (
			<Fragment>
				<input
					type="text"
					value={ search }
					className="components-placeholder__input"
					aria-label={ ariaLabel }
					placeholder={ placeholder }
					onChange={ ( event ) => this.searchDossierName( event.target.value ) }
				/>
				{ 0 !== dossiers.length &&
					<Popover
						className="components-autocomplete__popover"
						focusOnMount={ false }
						position="bottom left"
					>
						<div className="components-autocomplete__results">
							{ dossiersList }
						</div>
					</Popover>
				}
			</Fragment>
		);
	}
}

export default DocuThequesAutoCompleter;
