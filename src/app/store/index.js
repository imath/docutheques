/**
 * WordPress dependencies.
 */
const { apiFetch } = wp;
const { registerStore } = wp.data;

/**
 * External dependencies.
 */
const { uniqueId, filter, reject, last, orderBy } = lodash;

const DEFAULT_STATE = {
	user: {},
	documents: [],
	uploaded: [],
	dossiers: [],
	created: [],
	errored: {
		documents: [],
		dossiers: [],
	},
	uploading: false,
	uploadEnded: false,
	creating: false,
	createEnded: false,
	isSelectable: false,
	currentState: 'documentsBrowser',
	currentDossierId: 0,
};

function * insertDocument( document, dossier = 0 ) {
	let uploading = true, uploaded;

	yield { type: 'UPLOAD_START', uploading, document };

	const formData = new FormData();
	formData.append( 'file', document );

	if ( 0 !== dossier ) {
		formData.append( 'dossiers', [ dossier ] );
	}

	uploading = false;
	try {
		uploaded = yield actions.createFromAPI( '/wp/v2/media', formData );
		yield { type: 'UPLOAD_END', uploading, uploaded };
		uploaded.uploaded = true;

		return actions.addDocument( uploaded );
	} catch ( error ) {
		uploaded = {
			id: uniqueId(),
			name: document.name,
			error: error.message,
			type: 'attachment',
		};

		yield { type: 'UPLOAD_END', uploading, uploaded };

		return actions.traceErrors( uploaded );
	}
}

function * insertDossier( dossier ) {
	let creating = true, created;

	yield { type: 'DOSSIER_CREATE_START', creating, dossier };

	const formData = new FormData();
	formData.append( 'name', dossier.name );
	formData.append( 'description', dossier.description );
	formData.append( 'parent', dossier.parent );

	creating = false;
	try {
		created = yield actions.createFromAPI( '/wp/v2/dossiers', formData );
		yield { type: 'DOSSIER_CREATE_END', creating };

		return actions.addDossier( created );
	} catch ( error ) {
		created = {
			id: uniqueId(),
			name: dossier.name,
			error: error.message,
			type: 'dossier',
		};

		yield { type: 'DOSSIER_CREATE_END', creating };

		return actions.traceErrors( created );
	}
}

const actions = {
	getCurrentUser( user ) {
		return {
			type: 'GET_CURRENT_USER',
			user,
		};
	},

	getDossiers( dossiers ) {
		return {
			type: 'GET_DOSSIERS',
			dossiers,
		};
	},

	getDocuments( documents ) {
		return {
			type: 'GET_DOCUMENTS',
			documents,
		};
	},

	setCurrentState( currentState ) {
		return {
			type: 'SET_CURRENT_STATE',
			currentState,
		};
	},

	setCurrentDossier( currentDossierId ) {
		return {
			type: 'SET_CURRENT_DOSSIER',
			currentDossierId,
		};
	},

	fetchFromAPI( path, parse ) {
		return {
			type: 'FETCH_FROM_API',
			path,
			parse,
		};
	},

	insertDocument,
	insertDossier,
	createFromAPI( path, formData ) {
		return {
			type: 'CREATE_FROM_API',
			path,
			formData,
		};
	},

	addDossier( dossier ) {
		return {
			type: 'ADD_DOSSIER',
			dossier,
		};
	},

	addDocument( document ) {
		return {
			type: 'ADD_DOCUMENT',
			document,
		};
	},

	reset_uploads() {
		return {
			type: 'RESET_UPLOADS',
		};
	},

	traceErrors( item ) {
		return {
			type: 'ADD_ERROR',
			item,
		};
	},

	dismissError( errorType, id ) {
		return {
			type: 'REMOVE_ERROR',
			errorType,
			id,
		};
	}
};

const store = registerStore( 'docutheques', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'GET_CURRENT_USER':
				return {
					...state,
					user: action.user,
				};

			case 'GET_DOSSIERS':
				return {
					...state,
					dossiers: action.dossiers,
				};

			case 'GET_DOCUMENTS':
				return {
					...state,
					documents: [ ...state.documents, ...action.documents ],
				};

			case 'SET_CURRENT_STATE':
				return {
					...state,
					currentState: action.currentState,
				};

			case 'SET_CURRENT_DOSSIER':
				return {
					...state,
					currentDossierId: action.currentDossierId,
				};

			case 'DOSSIER_CREATE_START':
				return {
					...state,
					creating: action.creating,
				};

			case 'DOSSIER_CREATE_END':
				return {
					...state,
					creating: action.creating,
					createEnded: true,
				};

			case 'ADD_DOSSIER':
				return {
					...state,
					dossiers: [
						...state.dossiers,
						action.dossier,
					],
					currentDossierId: action.dossier.id,
				};

			case 'UPLOAD_START':
				return {
					...state,
					uploading: action.uploading,
					uploaded: [
						...state.uploaded,
						action.document,
					],
				};

			case 'UPLOAD_END':
				return {
					...state,
					uploading: action.uploading,
					uploaded: reject( state.uploaded, ( document ) => {
						let fileName = '';

						if ( action.uploaded && action.uploaded.source_url ) {
							fileName = last( action.uploaded.source_url.split( '/' ) );
						} else if ( action.uploaded && action.uploaded.error ) {
							fileName = action.uploaded.name;
						}

						return document.name === fileName;
					} ),
					ended: true,
				};

			case 'ADD_DOCUMENT':
				return {
					...state,
					documents: [
						...reject( state.documents, [ 'id', action.document.id ] ),
						action.document,
					],
				};

			case 'RESET_UPLOADS':
				return {
					...state,
					uploading: false,
					uploaded: [],
					errored: {
						dossiers: state.errored.dossiers,
						documents: [],
					},
					uploadEnded: false,
				};

			case 'ADD_ERROR':
				const updateErrors = action.item.type && 'attachment' === action.item.type ? {
					documents: [
						...state.errored.documents,
						action.item,
					],
					dossiers: state.errored.dossiers,
				} : {
					documents: state.errored.documents,
					dossiers: [
						...state.errored.dossiers,
						action.item,
					]
				};

				return {
					...state,
					errored: updateErrors,
				};

			case 'REMOVE_ERROR':
				const dismissError = action.errorType === 'documents' ? {
					documents: reject( state.errored.documents, [ 'id', action.id ] ),
					dossiers: state.errored.dossiers,
				} : {
					documents: state.errored.documents,
					dossiers: reject( state.errored.dossiers, [ 'id', action.id ] ),
				};

				return {
					...state,
					errored: dismissError,
				};
		}

		return state;
	},

	actions,

	selectors: {
		getCurrentUser( state ) {
			const { user } = state;
			return user;
		},

		getDossiers( state ) {
			const { dossiers } = state;
			return dossiers;
		},

		getDocuments( state ) {
			const { documents } = state;
			return orderBy( documents, ['modified'], ['desc'] );
		},

		getUploads( state ) {
			const { uploaded } = state;
			return uploaded;
		},

		getErrors( state ) {
			const { errored } = state;
			return errored;
		},

		getCurrentState( state ) {
			const { currentState } = state;
			return currentState;
		},

		getCurrentDossierId( state ) {
			const { currentDossierId } = state;
			return currentDossierId;
		},
	},

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( { path: action.path, parse: action.parse } );
		},

		CREATE_FROM_API( action ) {
			return apiFetch( { path: action.path, method: 'POST', body: action.formData } );
		}
	},

	resolvers: {
		* getCurrentUser() {
			const path = '/wp/v2/users/me?context=edit';
			const user = yield actions.fetchFromAPI( path, true );
			yield actions.getCurrentUser( user );
		},

		* getDossiers() {
			const path = '/wp/v2/dossiers?context=edit';
			const dossiers = yield actions.fetchFromAPI( path, true );
			return actions.getDossiers( dossiers );
		},

		* getDocuments( currentDossierId = 0 ) {
			const path = '/wp/v2/media?dossiers[]=' + currentDossierId + '&per_page=20&context=edit';
			const documents = yield actions.fetchFromAPI( path, true );
			return actions.getDocuments( documents );
		},
	},
} );
