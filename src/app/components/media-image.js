/**
 * WordPress dependencies
 */
const { G, Path, SVG } = wp.components;

const MediaImage = () => (
	<SVG
		viewBox="0 0 83 83"
		xmlns="http://www.w3.org/2000/svg"
		style={ {
			fillRule: 'evenodd',
			clipRule: 'evenodd',
			strokeLinejoin: 'round',
			strokeMiterlimit: 2,
		} }
		width="150px"
		height="150px"
		className="dashicon"
	>
		<G transform="matrix(4.15,0,0,4.15,0,0)">
			<Path
				d="M12,2L16,6L16,18L4,18L4,2L12,2ZM12,6L15,6L12,3L12,6Z"
				style={ {
					fillRule: 'nonzero',
				} }
			/>
		</G>
		<G id="format-image" transform="matrix(0.455823,0,0,0.455823,40.9167,49.9167)">
			<G transform="matrix(1,0,0,1,-41.5,-41.5)">
				<G transform="matrix(4.15,0,0,4.15,0,0)">
					<Path
						d="M2.25,1L17.75,1C18.44,1 19,1.56 19,2.25L19,17.75C19,18.44 18.44,19 17.75,19L2.25,19C1.56,19 1,18.44 1,17.75L1,2.25C1,1.56 1.56,1 2.25,1ZM17,17L17,3L3,3L3,17L17,17ZM10,6C10,4.9 9.1,4 8,4C6.9,4 6,4.9 6,6C6,7.1 6.9,8 8,8C9.1,8 10,7.1 10,6ZM13,11C13,11 13,5 16,5L16,15C16,15.55 15.55,16 15,16L5,16C4.45,16 4,15.55 4,15L4,8C6,8 7,12 7,12C7,12 8,9 10,9C12,9 13,11 13,11Z"
						style={ {
							fill: 'white',
							fillRule: 'nonzero',
							stroke: 'black',
							strokeWidth: 0.24 + 'px',
						} }
					/>
				</G>
			</G>
		</G>
	</SVG>
);

export default MediaImage;
