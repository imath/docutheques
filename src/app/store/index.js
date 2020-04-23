/**
 * WordPress dependencies.
 */
const { apiFetch } = wp;
const { registerStore } = wp.data;

/**
 * External dependencies.
 */
const {
	uniqueId,
	filter,
	reject,
	indexOf,
	orderBy,
	assignIn,
	forEach,
	find,
	keys,
	uniqWith,
	first,
	hasIn
} = lodash;

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
	totalDocuments: [],
	search: '',
};

async function parseDocuments( response ) {
	const documents = await response.json().then( ( data ) => {
		return data;
	} );

	store.dispatch(
		actions.getDocuments( documents )
	);
}

function * getDocumentsNextPage( dossier, page ) {
	const path = '/wp/v2/media?dossiers[]=' + dossier + '&page=' + page + '&per_page=20&context=edit';
	const nextPageDocuments = yield actions.fetchFromAPI( path, true );

	if ( nextPageDocuments.length ) {
		yield { type: 'SET_DOCUMENTS_CURRENT_PAGE', dossier, page };
	}

	return actions.getDocuments( nextPageDocuments );
}

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

function * updateDocument( editedDocument ) {
	let uploading = true, updated, updating, uploaded;
	let document = editedDocument.file || null;

	if ( document ) {
		yield { type: 'UPLOAD_START', uploading, document };
	} else {
		updating = true;
		yield { type: 'DOCUMENT_UPDATE_START', updating };
	}

	const formData = new FormData();
	formData.append( 'id', editedDocument.id );
	formData.append( 'file', document );
	formData.append( 'title', editedDocument.title.raw );
	formData.append( 'description', editedDocument.description.raw );
	formData.append( 'dossiers', editedDocument.dossiers );
	formData.append( 'date', editedDocument.date );

	uploading = false;
	updating = false;
	try {
		updated = yield actions.updateFromAPI( '/wp/v2/media/' + editedDocument.id, null, formData );
		updated.uploaded = true;

		if ( document ) {
			uploaded = updated;
			uploaded.submittedName = document.name;
			yield { type: 'UPLOAD_END', uploading, uploaded };
		} else {
			yield { type: 'DOCUMENT_UPDATE_END', updating };
		}

		return actions.editDocument( updated );
	} catch ( error ) {
		updated = {
			id: uniqueId(),
			name: document && document.name ? document.name : editedDocument.title.raw,
			error: error.message,
			type: 'attachment',
			actionType: 'update',
		};

		if ( document ) {
			uploaded = updated;
			yield { type: 'UPLOAD_END', uploading, uploaded };
		} else {
			yield { type: 'DOCUMENT_UPDATE_END', updating };
		}

		return actions.traceErrors( updated );
	}
}

function * deleteDocument( documentID, documentName ) {
	let deleting = true, deleted;

	yield { type: 'DOCUMENT_DELETE_START', deleting, documentID };

	deleting = false;
	try {
		deleted = yield actions.deleteFromAPI( '/wp/v2/media/' + documentID, { force: true } );
		yield { type: 'DOCUMENT_DELETE_END', deleting };

		return actions.removeDocument( deleted.previous );
	} catch ( error ) {
		deleted = {
			id: documentID,
			name: documentName,
			error: error.message,
			type: 'attachment',
			actionType: 'delete',
		};

		yield { type: 'DOCUMENT_DELETE_END', deleting };

		return actions.traceErrors( deleted );
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
			id: previous.id,
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

	setTotalDocuments( dossier, total ) {
		return {
			type: 'SET_TOTAL_DOCUMENTS',
			dossier,
			total,
		};
	},

	getDocumentsNextPage,
	getDocuments( documents ) {
		return {
			type: 'GET_DOCUMENTS',
			documents,
		};
	},
	setSearchTerms( search ) {
		return {
			type: 'SET_SEARCH_TERMS',
			search,
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

	updateDocument,
	updateDossier,
	updateFromAPI( path, options, formData ) {
		return {
			type: 'UPDATE_FROM_API',
			path,
			options,
			formData,
		};
	},

	deleteDocument,
	deleteDossier,
	deleteFromAPI( path, options = {} ) {
		return {
			type: 'DELETE_FROM_API',
			path,
			options,
		};
	},

	addDocument( document ) {
		return {
			type: 'ADD_DOCUMENT',
			document,
		};
	},

	editDocument( document ) {
		return {
			type: 'EDIT_DOCUMENT',
			document,
		};
	},

	removeDocument( document ) {
		return {
			type: 'REMOVE_DOCUMENT',
			document,
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

	removeDossier( dossier, options ) {
		return {
			type: 'REMOVE_DOSSIER',
			dossier,
			options,
		};
	},

	resetUploads() {
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

	toggleDocumentSelection( id, isSelected ) {
		return {
			type: 'TOGGLE_DOCUMENT_SELECTION',
			id,
			isSelected,
		};
	},
	resetDocumentsSelection() {
		return {
			type: 'RESET_DOCUMENTS_SELECTION',
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

			case 'SET_TOTAL_DOCUMENTS':
				let total = state.totalDocuments;

				if ( ! find( total, [ 'id', action.dossier ] ) ) {
					total = [
						...state.totalDocuments,
						{ id: action.dossier, total: action.total, currentPage: 1 },
					]
				}

				return {
					...state,
					totalDocuments: total,
				};

			case 'SET_DOCUMENTS_CURRENT_PAGE':
				const previousTotal = find( state.totalDocuments, [ 'id', action.dossier ] );
				let updatedTotal = state.totalDocuments;

				if ( previousTotal && previousTotal.currentPage ) {
					updatedTotal = [
						...reject( state.totalDocuments, [ 'id', action.dossier ] ),
						{ id: action.dossier, total: previousTotal.total, currentPage: action.page },
					];
				}

				return {
					...state,
					totalDocuments: updatedTotal,
				}

			case 'GET_DOCUMENTS':
				const documentsUniques = uniqWith( [ ...state.documents, ...action.documents ], ( vState, vAction ) => ( vState.id === vAction.id ) );

				return {
					...state,
					documents: documentsUniques,
				};

			case 'SET_SEARCH_TERMS':
				return {
					...state,
					search: action.search,
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
			case 'DOCUMENT_UPDATE_START':
				return {
					...state,
					updating: action.updating,
				};

			case 'DOSSIER_UPDATE_END':
			case 'DOCUMENT_UPDATE_END':
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

			case 'DOCUMENT_DELETE_START':
			case 'DOSSIER_DELETE_START':
				return {
					...state,
					deleting: action.deleting,
				};

			case 'DOCUMENT_DELETE_END':
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

			case 'EDIT_DOCUMENT':
				const dossierID = first( action.document.dossiers );

				return {
					...state,
					documents: [
						...reject( state.documents, [ 'id', action.document.id ] ),
						action.document,
					],
					currentDossierId: dossierID ? dossierID : 0,
					isAdvancedEditMode: false,
				};

			case 'REMOVE_DOCUMENT':
				return {
					...state,
					documents: reject( state.documents, [ 'id', action.document.id ] ),
					isAdvancedEditMode: false,
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

			case 'TOGGLE_DOCUMENT_SELECTION':
				return {
					...state,
					documents: state.documents.map( document => {
						if ( action.id === document.id ) {
							document.selected = action.isSelected;
						}

						return document;
					} ),
				};

			case 'RESET_DOCUMENTS_SELECTION':
				return {
					...state,
					documents: state.documents.map( document => {
						if ( document.selected && true === document.selected ) {
							document.selected = false;
						}

						return document;
					} ),
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

		getSearchTerms( state ) {
			const { isAdvancedEditMode, search } = state;
			return ! isAdvancedEditMode ? search : '';
		},

		getSelectedDocuments( state ) {
			const { documents } = state;
			return filter( documents, { selected: true } );
		},

		getTotalDocuments( state ) {
			const { currentDossierId, totalDocuments } = state;
			const totalDossier = find( totalDocuments, ['id', currentDossierId ] );
			return totalDossier && totalDossier.total ? totalDossier.total : 0;
		},

		getDocumentsCurrentPage( state ) {
			const { currentDossierId, totalDocuments } = state;
			const currentDossierPaginate = find( totalDocuments, ['id', currentDossierId ] );
			return currentDossierPaginate && currentDossierPaginate.currentPage ? currentDossierPaginate.currentPage : 1;
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

		getNewDossierParent( state ) {
			const { newDossierParentId, dossiers } = state;

			if ( 0 === newDossierParentId ) {
				return { id: 0, name: 'root' };
			}

			return find( dossiers, { id: newDossierParentId } );
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
			let options = { path: action.path };

			if ( null !== action.options ) {
				options.method = 'PUT';
				options.data = action.options;
			}

			if ( action.formData ) {
				options.method = 'POST';
				options.body = action.formData;
			}

			return apiFetch( options );
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
			const response = yield actions.fetchFromAPI( path, false );
			let total;

			if ( hasIn( response, [ 'headers', 'get' ] ) ) {
				total = parseInt( response.headers.get( 'X-WP-Total' ), 10 );
			} else {
				total = parseInt( get( response, ['headers', 'X-WP-Total'], 0 ), 10 );
			}

			yield actions.setTotalDocuments( currentDossierId, total );

			return parseDocuments( response );
		},
	},
} );
