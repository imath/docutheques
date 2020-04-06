/**
 * WordPress dependencies.
 */
const { apiFetch } = wp;
const { registerStore } = wp.data;

const DEFAULT_STATE = {
	user: {},
	documents: [],
	dossiers: [],
	uploaded: [],
	errored: [],
	uploading: false,
	ended: false,
	isSelectable: false,
	currentState: 'documentsBrowser',
	currentDossierId: 0,
};

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
					documents: action.documents,
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
			return documents;
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

		* getDocuments() {
			const { currentDossierId } = store.getState();
			const path = '/wp/v2/media?dossiers[]=' + currentDossierId + '&context=edit';

			const documents = yield actions.fetchFromAPI( path, true );
			return actions.getDocuments( documents );
		},
	},
} );
