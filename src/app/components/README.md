# Components

## Todo
- [ ] toolbar to manage actions for documents (Edit, Move, Delete)
- [ ] How to edit dossiers ?
- [ ] edit-document.js (do not forgot to allow editing date, parent dossiers and description)
- [ ] Moving can be done using the dossiers sidebar
- [x] Handle dossier create errors
- [ ] there can be other errors than create ones
- [x] ~~Update the file of an existing attachment: check `$post_type->get_rest_controller();` and use the `rest_pre_insert_attachment` filter.~~
- [x] Extend the WP_REST_Attachments_Controller to update the file of an existing attachment.
- [x] The filename can be different from the uploaded file once the upload is accomplished.
- [ ] Move some REST Attachment filters into the DocuThèques REST Controller.
