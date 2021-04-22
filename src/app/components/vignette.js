/**
 * WordPress dependencies
 */
const { Path, SVG } = wp.components;
const MEDIA_ICONS = {
	'media-archive': 'M12 2l4 4v12h-12v-16h8zM12 6h3l-3-3v3zM8 3.5v2l1.8-1zM11 5l-1.8 1 1.8 1v-2zM8 6.5v2l1.8-1zM11 8l-1.8 1 1.8 1v-2zM8 9.5v2l1.8-1zM11 11l-1.8 1 1.8 1v-2zM9.5 17c0.83 0 1.62-0.72 1.5-1.63-0.050-0.38-0.49-1.61-0.49-1.61l-1.99-1.1s-0.45 1.95-0.52 2.71c-0.070 0.77 0.67 1.63 1.5 1.63zM9.5 14.61c0.42 0 0.76 0.34 0.76 0.76 0 0.43-0.34 0.77-0.76 0.77s-0.76-0.34-0.76-0.77c0-0.42 0.34-0.76 0.76-0.76z',
	'media-audio': 'M12 2l4 4v12h-12v-16h8zM12 6h3l-3-3v3zM13 13.26v-5.17c0-0.11-0.040-0.21-0.12-0.29-0.070-0.080-0.16-0.11-0.27-0.1 0 0-3.97 0.71-4.25 0.78-0.29 0.060-0.36 0.32-0.36 0.52v3.37c-0.2-0.090-0.42-0.070-0.6-0.070-0.38 0-0.7 0.13-0.96 0.39-0.26 0.27-0.4 0.58-0.4 0.96 0 0.37 0.14 0.69 0.4 0.95 0.26 0.27 0.58 0.4 0.96 0.4 0.34 0 0.7-0.040 0.96-0.26 0.26-0.23 0.64-0.65 0.64-1.12v-3.32l3-0.6v2.3c-0.67-0.2-1.17 0.040-1.44 0.31-0.26 0.26-0.39 0.58-0.39 0.95 0 0.38 0.13 0.69 0.39 0.96 0.27 0.26 0.71 0.39 1.080 0.39 0.38 0 0.7-0.13 0.96-0.39 0.26-0.27 0.4-0.58 0.4-0.96z',
	'media-code': 'M12 2l4 4v12h-12v-16h8zM9 13l-2-2 2-2-1-1-3 3 3 3zM12 14l3-3-3-3-1 1 2 2-2 2z',
	'media-default': 'M12 2l4 4v12h-12v-16h8zM12 6h3l-3-3v3z',
	'media-document': 'M12 2l4 4v12h-12v-16h8zM5 3v1h6v-1h-6zM12 6h3l-3-3v3zM5 5v1h6v-1h-6zM15 8v-1h-10v1h10zM5 9v1h4v-1h-4zM15 12v-3h-5v3h5zM5 11v1h4v-1h-4zM15 14v-1h-10v1h10zM12 16v-1h-7v1h7z',
	'media-image': 'M 12 2 L 16 6 L 16 18 L 4 18 L 4 2 Z M 12 6 L 15 6 L 12 3 Z M 6.093 8.494 L 6.093 15.083 C 6.093 15.376 6.331 15.614 6.624 15.614 L 13.213 15.614 C 13.506 15.614 13.744 15.376 13.744 15.083 L 13.744 8.494 C 13.744 8.201 13.506 7.963 13.213 7.963 L 6.624 7.963 C 6.331 7.963 6.093 8.201 6.093 8.494 Z M 6.943 14.764 L 6.943 8.813 L 12.894 8.813 L 12.894 14.764 Z M 9.919 10.088 C 9.919 9.621 9.536 9.238 9.068 9.238 C 8.601 9.238 8.218 9.621 8.218 10.088 C 8.218 10.556 8.601 10.938 9.068 10.938 C 9.536 10.938 9.919 10.556 9.919 10.088 Z M 9.919 11.363 C 9.068 11.363 8.643 12.639 8.643 12.639 C 8.643 12.639 8.218 10.938 7.368 10.938 L 7.368 13.914 C 7.368 14.148 7.559 14.339 7.793 14.339 L 12.044 14.339 C 12.278 14.339 12.469 14.148 12.469 13.914 L 12.469 9.663 C 11.194 9.663 11.194 12.214 11.194 12.214 C 11.194 12.214 10.769 11.363 9.919 11.363 Z',
	'media-interactive': 'M12 2l4 4v12h-12v-16h8zM12 6h3l-3-3v3zM14 14v-6h-8v6h3l-1 2h1l1-2 1 2h1l-1-2h3zM8 11c-0.55 0-1-0.45-1-1s0.45-1 1-1 1 0.45 1 1-0.45 1-1 1zM13 9v2h-3v-2h3zM13 12v1h-6v-1h6z',
	'media-spreadsheet': 'M12 2l4 4v12h-12v-16h8zM11 6v-3h-6v3h6zM8 8v-1h-3v1h3zM11 8v-1h-2v1h2zM15 8v-1h-3v1h3zM8 10v-1h-3v1h3zM11 10v-1h-2v1h2zM15 10v-1h-3v1h3zM8 12v-1h-3v1h3zM11 12v-1h-2v1h2zM15 12v-1h-3v1h3zM8 14v-1h-3v1h3zM11 14v-1h-2v1h2zM15 14v-1h-3v1h3zM8 16v-1h-3v1h3zM11 16v-1h-2v1h2z',
	'media-text': 'M12 2l4 4v12h-12v-16h8zM5 3v1h6v-1h-6zM12 6h3l-3-3v3zM5 5v1h6v-1h-6zM15 8v-1h-10v1h10zM15 10v-1h-10v1h10zM15 12v-1h-10v1h10zM11 14v-1h-6v1h6z',
	'media-video': 'M12 2l4 4v12h-12v-16h8zM12 6h3l-3-3v3zM11 14v-3c0-0.27-0.1-0.51-0.29-0.71-0.2-0.19-0.44-0.29-0.71-0.29h-3c-0.27 0-0.51 0.1-0.71 0.29-0.19 0.2-0.29 0.44-0.29 0.71v3c0 0.27 0.1 0.51 0.29 0.71 0.2 0.19 0.44 0.29 0.71 0.29h3c0.27 0 0.51-0.1 0.71-0.29 0.19-0.2 0.29-0.44 0.29-0.71zM14 15v-5l-2 2v1z',
}

const DocuThequeVignette = ( { icon } ) => (
	<SVG
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		className="dashicon"
	>
		<Path
			d={ MEDIA_ICONS[ icon ] }
			style={ {
				fillRule: 'nonzero',
			} }
		/>
	</SVG>
);

export default DocuThequeVignette;