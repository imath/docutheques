/**
 * WordPress dependencies.
 */
const { apiFetch } = wp;
const { registerStore } = wp.data;

/**
 * External dependencies.
 */
const { filter } = lodash;

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

	traceErrors( item ) {
		return {
			type: 'ADD_ERROR',
			item,
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

			case 'ADD_ERROR':
				const updateErrors = item.type && 'attachment' === item.type ? {
					documents: [
						...state.errored.documents,
						action.item,
					]
				} : {
					dossiers: [
						...state.errored.dossiers,
						action.item,
					]
				};

				return {
					...state,
					errored: updateErrors,
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
			const { documents, currentDossierId } = state;

			if ( 0 === currentDossierId ) {
				return filter( documents, { 'dossiers': [] } );
			}

			return filter( documents, { 'dossiers': [ currentDossierId ] } );
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
			const path = '/wp/v2/media?dossiers[]=' + currentDossierId + '&context=edit';
			const documents = yield actions.fetchFromAPI( path, true );
			return actions.getDocuments( documents );
		},
	},
} );
