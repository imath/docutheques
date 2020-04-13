/**
 * WordPress dependencies.
 */
const { apiFetch } = wp;
const { registerStore } = wp.data;

/**
 * External dependencies.
 */
const { uniqueId, filter, reject, indexOf, orderBy, assignIn, forEach, find } = lodash;

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
	deleting: false,
	deleteEnded: false,
	updating: false,
	updateEnded: false,
	isSelectable: false,
	currentState: 'documentsBrowser',
	currentDossierId: 0,
	isAdvancedEditMode: false,
	newDossierParentId: 0,
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
		uploaded.submittedName = document.name;

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

function * updateDossier( previous, dossier ) {
	let updating = true, updated;

	yield { type: 'DOSSIER_UPDATE_START', updating, dossier };

	updating = false;
	try {
		updated = yield actions.updateFromAPI( '/wp/v2/dossiers/' + previous.id, dossier );
		yield { type: 'DOSSIER_UPDATE_END', updating };

		return actions.editDossier( updated );
	} catch ( error ) {
		updated = {
			id: uniqueId(),
			name: previous.name,
			error: error.message,
			type: 'dossier',
			actionType: 'update',
		};

		yield { type: 'DOSSIER_UPDATE_END', updating };

		return actions.traceErrors( updated );
	}
}

function getAllChildren( dossierID ) {
	const getStore = store.getState();
	const { dossiers } = getStore;
	let children = filter( dossiers, { parent: dossierID } );

	forEach( children, ( dossier ) => {
		const subChildren = getAllChildren( dossier.id );
		children = [ ...children, ...subChildren ];
	} );

	return children;
}

function * deleteDossier( dossierID, options = {} ) {
	let deleting = true, deleted;
	options.sousDossiers = getAllChildren( dossierID ).map( ( d ) => ( d.id ) );

	yield { type: 'DOSSIER_DELETE_START', deleting, dossierID };

	deleting = false;
	try {
		deleted = yield actions.deleteFromAPI( '/wp/v2/dossiers/' + dossierID , options );
		yield { type: 'DOSSIER_DELETE_END', deleting };

		return actions.removeDossier( deleted.previous, options );
	} catch ( error ) {
		deleted = {
			id: dossierID,
			name: '',
			error: error.message,
			type: 'dossier',
			actionType: 'delete',
		};

		yield { type: 'DOSSIER_DELETE_END', deleting };

		return actions.traceErrors( deleted );
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

	newDossierParent( parentId ) {
		return {
			type: 'NEW_DOSSIER_PARENT',
			parentId,
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

	updateDossier,
	updateFromAPI( path, options = {} ) {
		return {
			type: 'UPDATE_FROM_API',
			path,
			options,
		};
	},

	deleteDossier,
	deleteFromAPI( path, options = {} ) {
		return {
			type: 'DELETE_FROM_API',
			path,
			options,
		};
	},

	addDossier( dossier ) {
		return {
			type: 'ADD_DOSSIER',
			dossier,
		};
	},

	editDossier( dossier ) {
		return {
			type: 'EDIT_DOSSIER',
			dossier,
		};
	},

	addDocument( document ) {
		return {
			type: 'ADD_DOCUMENT',
			document,
		};
	},

	removeDossier( dossier, options ) {
		return {
			type: 'REMOVE_DOSSIER',
			dossier,
			options,
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
	},

	switchMode( isAdvancedEditMode ) {
		return {
			type: 'SWITCH_MODE',
			isAdvancedEditMode,
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

			case 'NEW_DOSSIER_PARENT':
				return {
					...state,
					newDossierParentId: action.parentId,
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

			case 'EDIT_DOSSIER':
				return {
					...state,
					dossiers: [
						...reject( state.dossiers, [ 'id', action.dossier.id ] ),
						action.dossier,
					],
					currentDossierId: action.dossier.id,
					isAdvancedEditMode: false,
				};

			case 'DOSSIER_UPDATE_START':
				return {
					...state,
					updating: action.updating,
				};

			case 'DOSSIER_UPDATE_END':
				return {
					...state,
					updating: action.updating,
					updateEnded: true,
				};

			case 'REMOVE_DOSSIER':
				let removedDossiers = [ action.dossier.id ];
				if ( action.options.sousDossiers ) {
					removedDossiers = [ ...action.options.sousDossiers, ...removedDossiers ];
				}
				const { documents } = state;
				let updatedDocuments;

				if ( action.options.deleteDocuments ) {
					forEach( removedDossiers, ( dossierID ) => {
						updatedDocuments = reject( documents, { 'dossiers': [ dossierID ] } );
					} );
				} else {
					updatedDocuments = documents.map( ( document ) => {
						if ( -1 !== indexOf( removedDossiers, document.dossiers[0] ) ) {
							document.dossiers = [];
						}

						return document;
					} );
				}

				return {
					...state,
					dossiers: reject( state.dossiers, ( dossier ) => {
						return -1 !== indexOf( removedDossiers, dossier.id );
					} ),
					documents: updatedDocuments,
					currentDossierId: 0,
					isAdvancedEditMode: false,
				};

			case 'DOSSIER_DELETE_START':
				return {
					...state,
					deleting: action.deleting,
				};

			case 'DOSSIER_DELETE_END':
				return {
					...state,
					deleting: action.deleting,
					deleteEnded: true,
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

						if ( action.uploaded && action.uploaded.submittedName ) {
							fileName = action.uploaded.submittedName;
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

			case 'SWITCH_MODE':
				return {
					...state,
					isAdvancedEditMode: action.isAdvancedEditMode,
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
			return orderBy( dossiers, ['name'], ['asc'] );
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

		getCurrentDossier( state ) {
			const { currentDossierId, dossiers } = state;
			return find( dossiers, { id: currentDossierId } );
		},

		getNewDossierParentId( state ) {
			const { newDossierParentId } = state;
			return newDossierParentId;
		},

		isAdvancedEditMode( state ) {
			const { isAdvancedEditMode } = state;
			return isAdvancedEditMode;
		}
	},

	controls: {
		FETCH_FROM_API( action ) {
			return apiFetch( { path: action.path, parse: action.parse } );
		},

		CREATE_FROM_API( action ) {
			return apiFetch( { path: action.path, method: 'POST', body: action.formData } );
		},

		UPDATE_FROM_API( action ) {
			return apiFetch( { path: action.path, method: 'PUT', data: action.options } );
		},

		DELETE_FROM_API( action ) {
			let options = { path: action.path, method: 'DELETE', data: { force: true } };

			if ( action.options ) {
				options.data = assignIn( options.data, action.options );
			}

			return apiFetch( options );
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

		* getDocuments( currentDossierId = 0 ) {
			const path = '/wp/v2/media?dossiers[]=' + currentDossierId + '&per_page=20&context=edit';
			const documents = yield actions.fetchFromAPI( path, true );
			return actions.getDocuments( documents );
		},
	},
} );
