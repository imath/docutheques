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
	currentState: 'browser',
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

	setCurrentState( currentState ) {
		return {
			type: 'SET_CURRENT_STATE',
			currentState,
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

			case 'SET_CURRENT_STATE':
				return {
					...state,
					currentState: action.currentState,
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

		getCurrentState( state ) {
			const { currentState } = state;
			return currentState;
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
			return actions.getDossiers( dossiers, '' );
		},
	},
} );
