/**
 * WordPress dependencies
 */
const { Path, G, Rect, SVG } = wp.components;

const ModifierDossierAnimation= () => (
	<SVG
		viewBox="0 0 500 350"
		xmlns="http://www.w3.org/2000/svg"
		className="docuthequesAnimation"
	>
		<G transform="matrix(1, 0, 0, 1, 101.260742, 12.806731)">
			<Path d="M 180.733 39.531 L 180.733 42.531 L 175.733 42.531 L 175.733 47.531 L 172.733 47.531 L 172.733 42.531 L 167.733 42.531 L 167.733 39.531 L 172.733 39.531 L 172.733 34.531 L 175.733 34.531 L 175.733 39.531 L 180.733 39.531 Z" style={ { fill: 'rgb(0, 115, 170)' } }>
				<animate attributeType="CSS" attributeName="opacity" from="1" to="0" dur="2s" repeatCount="1" />
			</Path>
			<Path d="M 185.887 40.722 C 185.887 47.108 180.711 52.284 174.325 52.284 C 167.939 52.284 162.763 47.108 162.763 40.722 C 162.763 34.336 167.939 29.16 174.325 29.16 C 180.711 29.16 185.887 34.336 185.887 40.722 Z" style={ { strokeWidth: '3px', stroke: 'rgb(0, 115, 170)', fill: 'none' } }>
				<animate attributeType="CSS" attributeName="opacity" from="1" to="0" dur="2s" repeatCount="1" />
			</Path>
			<Path d="M 180.733 39.531 L 180.733 42.531 L 175.733 42.531 L 175.733 47.531 L 172.733 47.531 L 172.733 42.531 L 167.733 42.531 L 167.733 39.531 L 172.733 39.531 L 172.733 34.531 L 175.733 34.531 L 175.733 39.531 L 180.733 39.531 Z" style={ { fill: '#f1f1f1', stroke: '#f1f1f1' } }>
				<animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="2s" repeatCount="1" />
			</Path>
			<Path d="M 185.887 40.722 C 185.887 47.108 180.711 52.284 174.325 52.284 C 167.939 52.284 162.763 47.108 162.763 40.722 C 162.763 34.336 167.939 29.16 174.325 29.16 C 180.711 29.16 185.887 34.336 185.887 40.722 Z" style={ { strokeWidth: '4px', stroke: '#f1f1f1', fill: 'none' } }>
				<animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="2s" repeatCount="1" />
			</Path>
			<Rect x="-72.825" y="37.068" width="96.564" height="9.125" style={ { fill: 'rgb(35, 40, 45)' } }/>
			<Rect x="35.669" width="96.564" height="9.125" style={ { fill: 'rgb(35, 40, 45)' } } y="37.068"/>
		</G>
		<G transform="matrix(1, 0, 0, 1, 0.000001, -111.67099)">
			<Rect y="270.671" width="125.308" height="164.646" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } } x="23.08"/>
			<Rect x="63.102" y="364.042" width="79.469" height="34.701" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Path d="M 63.708 296.842 L 66.775 299.908 L 64.65 302.033 L 51.682 289.063 L 38.712 302.033 L 36.587 299.908 L 51.682 284.815 L 59.7 292.832 L 59.7 288.823 L 63.708 288.823 L 63.708 296.842 Z M 51.682 291.911 L 63.708 303.918 L 63.708 315.883 L 39.654 315.883 L 39.654 303.918 Z M 55.69 313.879 L 55.69 303.857 L 47.672 303.857 L 47.672 313.879 L 55.69 313.879 Z" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Rect x="38.306" y="311.639" width="36.7" height="8.131" style={ { fill: 'rgb(0, 115, 170)',  strokeWidth: '0.999999px' } } transform="matrix(0.388541, -0.921432, 0.921432, 0.388541, -218.854172, 231.944611)"/>
			<Path d="M 48.566 339.717 L 42.308 339.717 C 41.588 339.717 40.87 340.309 40.968 341.27 L 43.999 359.739 C 43.999 359.739 47.594 346.133 48.294 342.861 C 48.508 341.881 49.479 341.567 50.198 341.567 L 60.227 341.567 C 60.227 341.567 58.866 337.721 58.73 337.295 C 58.498 336.482 58.069 336.02 57.214 336.02 L 50.781 336.02 C 50.082 336.02 49.421 336.445 49.227 337.203 C 49.052 337.942 48.566 339.717 48.566 339.717 Z M 58.05 339.717 L 50.276 339.717 C 50.276 339.717 51.093 337.869 51.967 337.869 L 56.107 337.869 C 57.04 337.869 58.05 339.717 58.05 339.717 Z M 45.981 360.516 C 45.379 361.385 44.504 361.903 43.533 361.903 L 74.103 361.903 C 75.153 361.903 75.891 361.329 76.105 360.368 C 76.96 356.319 79.371 344.765 79.371 344.765 C 79.506 343.84 78.787 343.415 78.165 343.415 L 71.887 343.415 L 71.887 340.697 C 71.887 340.402 71.382 339.717 70.604 339.717 L 63.297 339.717 C 62.287 339.717 61.607 340.79 61.607 340.79 L 60.227 343.415 L 51.655 343.415 C 51.035 343.415 50.432 343.767 50.315 344.339 C 50.315 344.339 47.225 356.727 46.973 357.891 C 46.837 358.575 46.545 359.721 45.981 360.516 Z M 70.683 343.415 L 62.17 343.415 C 62.17 343.415 63.297 341.567 64.366 341.567 L 68.816 341.567 C 70.197 341.567 70.683 343.415 70.683 343.415 Z" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Path d="M 49.279 402.075 L 43.021 402.075 C 42.301 402.075 41.583 402.667 41.681 403.628 L 44.712 422.097 C 44.712 422.097 48.307 408.491 49.007 405.219 C 49.221 404.239 50.192 403.925 50.911 403.925 L 60.94 403.925 C 60.94 403.925 59.579 400.079 59.443 399.653 C 59.211 398.84 58.782 398.378 57.927 398.378 L 51.494 398.378 C 50.795 398.378 50.134 398.803 49.94 399.561 C 49.765 400.3 49.279 402.075 49.279 402.075 Z M 58.763 402.075 L 50.989 402.075 C 50.989 402.075 51.806 400.227 52.68 400.227 L 56.82 400.227 C 57.753 400.227 58.763 402.075 58.763 402.075 Z M 46.694 422.874 C 46.092 423.743 45.217 424.261 44.246 424.261 L 74.816 424.261 C 75.866 424.261 76.604 423.687 76.818 422.726 C 77.673 418.677 80.084 407.123 80.084 407.123 C 80.219 406.198 79.5 405.773 78.878 405.773 L 72.6 405.773 L 72.6 403.055 C 72.6 402.76 72.095 402.075 71.317 402.075 L 64.01 402.075 C 63 402.075 62.32 403.148 62.32 403.148 L 60.94 405.773 L 52.368 405.773 C 51.748 405.773 51.145 406.125 51.028 406.697 C 51.028 406.697 47.938 419.085 47.686 420.249 C 47.55 420.933 47.258 422.079 46.694 422.874 Z M 71.396 405.773 L 62.883 405.773 C 62.883 405.773 64.01 403.925 65.079 403.925 L 69.529 403.925 C 70.91 403.925 71.396 405.773 71.396 405.773 Z" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Path d="M 74.079 374.535 L 100 374.535 L 100 394.474 L 68.097 394.474 L 68.097 368.553 L 82.054 368.553 L 86.043 372.541 L 72.086 372.541 L 72.086 390.487 L 74.079 390.487 L 74.079 374.535 Z" style={ { fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="105" y="380.052" width="28.857" height="7.147" style={ { fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="84.889" y="347.258" width="28.857" height="7.147" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Rect x="84.205" y="409.671" width="28.857" height="7.147" style={ { fill: 'rgb(0, 115, 170)' } }/>
		</G>
		<G transform="matrix(1, 0, 0, 1, -22.588285, -111.304977)">
			<animate attributeType="CSS" attributeName="opacity" from="1" to="0" dur="2s" repeatCount="1" />
			<Rect x="180.365" y="272.236" width="69.728" height="69.728" style={ { fill: 'rgb(238, 238, 238)', stroke: 'rgb(204, 208, 212)' } }/>
			<Rect x="180.557" y="334.005" width="69.408" height="8.219" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="186.065" y="336.637" width="59.688" height="3.001" style={ { fill: 'rgb(35, 40, 45)' } }/>
			<Path d="M 220.095 282.295 L 230.502 292.701 L 230.502 323.919 L 199.284 323.919 L 199.284 282.295 L 220.095 282.295 Z M 220.095 292.701 L 227.9 292.701 L 220.095 284.897 L 220.095 292.701 Z M 225.299 313.512 L 225.299 297.904 L 204.487 297.904 L 204.487 313.512 L 212.291 313.512 L 209.689 318.716 L 212.291 318.716 L 214.893 313.512 L 217.495 318.716 L 220.095 318.716 L 217.495 313.512 L 225.299 313.512 Z M 209.689 305.708 C 208.258 305.708 207.088 304.539 207.088 303.106 C 207.088 301.675 208.258 300.506 209.689 300.506 C 211.119 300.506 212.291 301.675 212.291 303.106 C 212.291 304.539 211.119 305.708 209.689 305.708 Z M 222.697 300.506 L 222.697 305.708 L 214.893 305.708 L 214.893 300.506 L 222.697 300.506 Z M 222.697 308.31 L 222.697 310.912 L 207.088 310.912 L 207.088 308.31 L 222.697 308.31 Z" />
			<Rect x="259.929" y="272.306" width="69.728" height="69.728" style={ { fill: 'rgb(238, 238, 238)', stroke: 'rgb(204, 208, 212)' } }/>
			<Rect x="260.121" y="334.075" width="69.408" height="8.219" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="265.629" y="336.707" width="59.688" height="3.001" style={ { fill: 'rgb(35, 40, 45)' } }/>
			<Path d="M 301.666 283.487 L 311.774 293.594 L 311.774 323.919 L 281.449 323.919 L 281.449 283.487 L 301.666 283.487 Z M 299.139 293.594 L 299.139 286.014 L 283.976 286.014 L 283.976 293.594 L 299.139 293.594 Z M 291.556 298.649 L 291.556 296.121 L 283.976 296.121 L 283.976 298.649 L 291.556 298.649 Z M 299.139 298.649 L 299.139 296.121 L 294.083 296.121 L 294.083 298.649 L 299.139 298.649 Z M 309.247 298.649 L 309.247 296.121 L 301.666 296.121 L 301.666 298.649 L 309.247 298.649 Z M 291.556 303.703 L 291.556 301.176 L 283.976 301.176 L 283.976 303.703 L 291.556 303.703 Z M 299.139 303.703 L 299.139 301.176 L 294.083 301.176 L 294.083 303.703 L 299.139 303.703 Z M 309.247 303.703 L 309.247 301.176 L 301.666 301.176 L 301.666 303.703 L 309.247 303.703 Z M 291.556 308.758 L 291.556 306.231 L 283.976 306.231 L 283.976 308.758 L 291.556 308.758 Z M 299.139 308.758 L 299.139 306.231 L 294.083 306.231 L 294.083 308.758 L 299.139 308.758 Z M 309.247 308.758 L 309.247 306.231 L 301.666 306.231 L 301.666 308.758 L 309.247 308.758 Z M 291.556 313.812 L 291.556 311.285 L 283.976 311.285 L 283.976 313.812 L 291.556 313.812 Z M 299.139 313.812 L 299.139 311.285 L 294.083 311.285 L 294.083 313.812 L 299.139 313.812 Z M 309.247 313.812 L 309.247 311.285 L 301.666 311.285 L 301.666 313.812 L 309.247 313.812 Z M 291.556 318.865 L 291.556 316.338 L 283.976 316.338 L 283.976 318.865 L 291.556 318.865 Z M 299.139 318.865 L 299.139 316.338 L 294.083 316.338 L 294.083 318.865 L 299.139 318.865 Z" />
			<Rect x="341.07" y="272.306" width="69.728" height="69.728" style={ { fill: 'rgb(238, 238, 238)', stroke: 'rgb(204, 208, 212)' } }/>
			<Rect x="341.262" y="334.075" width="69.408" height="8.219" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="346.77" y="336.707" width="59.688" height="3.001" style={ { fill: 'rgb(35, 40, 45)' } }/>
			<Path d="M 380.902 282.295 L 391.307 292.701 L 391.307 323.919 L 360.089 323.919 L 360.089 282.295 L 380.902 282.295 Z M 380.902 292.701 L 388.707 292.701 L 380.902 284.896 L 380.902 292.701 Z M 378.3 313.513 L 378.3 305.709 C 378.3 305.007 378.039 304.381 377.545 303.862 C 377.025 303.368 376.4 303.108 375.698 303.108 L 367.894 303.108 C 367.19 303.108 366.567 303.368 366.047 303.862 C 365.552 304.381 365.293 305.007 365.293 305.709 L 365.293 313.513 C 365.293 314.216 365.552 314.839 366.047 315.361 C 366.567 315.854 367.19 316.116 367.894 316.116 L 375.698 316.116 C 376.4 316.116 377.025 315.854 377.545 315.361 C 378.039 314.839 378.3 314.216 378.3 313.513 Z M 386.105 316.116 L 386.105 303.108 L 380.902 308.31 L 380.902 310.912 Z" />
		</G>
		<G>
			<animate attributeType="CSS" attributeName="opacity" from="1" to="0" dur="2s" repeatCount="1" />
			<Rect y="85.837" width="447.374" height="51.565" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } } x="23.297"/>
			<Path d="M 100 113.659 L 96.151 113.659 C 95.851 114.895 95.373 116.043 94.721 117.068 L 97.44 119.787 L 93.731 123.496 L 91.012 120.775 C 89.987 121.411 88.84 121.889 87.639 122.171 L 87.639 126.021 L 82.341 126.021 L 82.341 122.171 C 81.141 121.889 79.993 121.411 78.968 120.775 L 76.249 123.496 L 72.506 119.752 L 75.225 117.032 C 74.589 116.009 74.112 114.86 73.829 113.659 L 69.98 113.659 L 69.98 108.415 L 73.812 108.415 C 74.094 107.179 74.589 106.031 75.225 104.989 L 72.506 102.269 L 76.213 98.56 L 78.933 101.28 C 79.958 100.627 81.123 100.15 82.341 99.85 L 82.341 96 L 87.639 96 L 87.639 99.85 C 88.84 100.132 89.987 100.61 91.012 101.245 L 93.731 98.526 L 97.476 102.269 L 94.755 104.989 C 95.391 106.031 95.886 107.179 96.169 108.415 L 100 108.415 L 100 113.659 Z M 84.99 116.308 C 87.921 116.308 90.287 113.942 90.287 111.01 C 90.287 108.079 87.921 105.713 84.99 105.713 C 82.059 105.713 79.693 108.079 79.693 111.01 C 79.693 113.942 82.059 116.308 84.99 116.308 Z" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Path d="M 32.944 95 L 60.805 95 C 61.763 95 62.547 95.784 62.547 96.741 L 62.547 124.602 C 62.547 125.56 61.763 126.344 60.805 126.344 L 32.944 126.344 C 31.987 126.344 31.203 125.56 31.203 124.602 L 31.203 96.741 C 31.203 95.784 31.987 95 32.944 95 Z M 45.151 108.913 L 45.151 98.465 L 34.686 98.465 L 34.686 108.913 L 45.151 108.913 Z M 59.081 108.913 L 59.081 98.465 L 48.634 98.465 L 48.634 108.913 L 59.081 108.913 Z M 45.151 122.861 L 45.151 112.413 L 34.686 112.413 L 34.686 122.861 L 45.151 122.861 Z M 59.081 122.861 L 59.081 112.413 L 48.634 112.413 L 48.634 122.861 L 59.081 122.861 Z" style={ { fill: 'rgb(0, 115, 170)' } }/>
		</G>
		<G transform="matrix(1, 0, 0, 1, 0.139646, 0.004675)">
			<animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="2s" repeatCount="1" />
			<Rect y="85.837" width="447.374" height="51.565" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } } x="23.297"/>
			<Path d="M 100 113.659 L 96.151 113.659 C 95.851 114.895 95.373 116.043 94.721 117.068 L 97.44 119.787 L 93.731 123.496 L 91.012 120.775 C 89.987 121.411 88.84 121.889 87.639 122.171 L 87.639 126.021 L 82.341 126.021 L 82.341 122.171 C 81.141 121.889 79.993 121.411 78.968 120.775 L 76.249 123.496 L 72.506 119.752 L 75.225 117.032 C 74.589 116.009 74.112 114.86 73.829 113.659 L 69.98 113.659 L 69.98 108.415 L 73.812 108.415 C 74.094 107.179 74.589 106.031 75.225 104.989 L 72.506 102.269 L 76.213 98.56 L 78.933 101.28 C 79.958 100.627 81.123 100.15 82.341 99.85 L 82.341 96 L 87.639 96 L 87.639 99.85 C 88.84 100.132 89.987 100.61 91.012 101.245 L 93.731 98.526 L 97.476 102.269 L 94.755 104.989 C 95.391 106.031 95.886 107.179 96.169 108.415 L 100 108.415 L 100 113.659 Z M 84.99 116.308 C 87.921 116.308 90.287 113.942 90.287 111.01 C 90.287 108.079 87.921 105.713 84.99 105.713 C 82.059 105.713 79.693 108.079 79.693 111.01 C 79.693 113.942 82.059 116.308 84.99 116.308 Z" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Path d="M 32.944 95 L 60.805 95 C 61.763 95 62.547 95.784 62.547 96.741 L 62.547 124.602 C 62.547 125.56 61.763 126.344 60.805 126.344 L 32.944 126.344 C 31.987 126.344 31.203 125.56 31.203 124.602 L 31.203 96.741 C 31.203 95.784 31.987 95 32.944 95 Z M 45.151 108.913 L 45.151 98.465 L 34.686 98.465 L 34.686 108.913 L 45.151 108.913 Z M 59.081 108.913 L 59.081 98.465 L 48.634 98.465 L 48.634 108.913 L 59.081 108.913 Z M 45.151 122.861 L 45.151 112.413 L 34.686 112.413 L 34.686 122.861 L 45.151 122.861 Z M 59.081 122.861 L 59.081 112.413 L 48.634 112.413 L 48.634 122.861 L 59.081 122.861 Z" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Rect x="124.942" y="94.818" width="91.717" height="31.506" style={ { fill: 'rgb(243, 245, 246)', strokeLineJoin: 'round', stroke: 'rgb(0, 115, 170)', strokewidth: '2px' } }/>
			<Rect x="135.212" y="106.463" width="71.937" height="7.147" style={ { fill: 'rgb(0, 115, 170)' } }/>
			<Rect x="230.806" y="94.818" width="91.717" height="31.506" style={ { fill: 'rgb(243, 245, 246)', strokeLineJoin: 'round', stroke: 'rgb(0, 115, 170)', strokeWidth: '2px' } }/>
			<Rect x="241.076" y="106.463" width="71.937" height="7.147" style={ { fill: 'rgb(0, 115, 170)' } }/>
		</G>
		<G transform="matrix(1, 0, 0, 1, -22.351883, -111.425995)">
			<animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="2s" repeatCount="1" />
			<Rect x="180.365" y="272.236" width="69.728" height="69.728" style={ { fill: 'rgb(238, 238, 238)', stroke: 'rgb(204, 208, 212)' } }/>
			<Rect x="180.557" y="334.005" width="69.408" height="8.219" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="186.065" y="336.637" width="59.688" height="3.001" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Path d="M 220.095 282.295 L 230.502 292.701 L 230.502 323.919 L 199.284 323.919 L 199.284 282.295 L 220.095 282.295 Z M 220.095 292.701 L 227.9 292.701 L 220.095 284.897 L 220.095 292.701 Z M 225.299 313.512 L 225.299 297.904 L 204.487 297.904 L 204.487 313.512 L 212.291 313.512 L 209.689 318.716 L 212.291 318.716 L 214.893 313.512 L 217.495 318.716 L 220.095 318.716 L 217.495 313.512 L 225.299 313.512 Z M 209.689 305.708 C 208.258 305.708 207.088 304.539 207.088 303.106 C 207.088 301.675 208.258 300.506 209.689 300.506 C 211.119 300.506 212.291 301.675 212.291 303.106 C 212.291 304.539 211.119 305.708 209.689 305.708 Z M 222.697 300.506 L 222.697 305.708 L 214.893 305.708 L 214.893 300.506 L 222.697 300.506 Z M 222.697 308.31 L 222.697 310.912 L 207.088 310.912 L 207.088 308.31 L 222.697 308.31 Z" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Rect x="259.929" y="272.306" width="69.728" height="69.728" style={ { fill: 'rgb(238, 238, 238)', stroke: 'rgb(204, 208, 212)' } }/>
			<Rect x="260.121" y="334.075" width="69.408" height="8.219" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="265.629" y="336.707" width="59.688" height="3.001" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Path d="M 301.666 283.487 L 311.774 293.594 L 311.774 323.919 L 281.449 323.919 L 281.449 283.487 L 301.666 283.487 Z M 299.139 293.594 L 299.139 286.014 L 283.976 286.014 L 283.976 293.594 L 299.139 293.594 Z M 291.556 298.649 L 291.556 296.121 L 283.976 296.121 L 283.976 298.649 L 291.556 298.649 Z M 299.139 298.649 L 299.139 296.121 L 294.083 296.121 L 294.083 298.649 L 299.139 298.649 Z M 309.247 298.649 L 309.247 296.121 L 301.666 296.121 L 301.666 298.649 L 309.247 298.649 Z M 291.556 303.703 L 291.556 301.176 L 283.976 301.176 L 283.976 303.703 L 291.556 303.703 Z M 299.139 303.703 L 299.139 301.176 L 294.083 301.176 L 294.083 303.703 L 299.139 303.703 Z M 309.247 303.703 L 309.247 301.176 L 301.666 301.176 L 301.666 303.703 L 309.247 303.703 Z M 291.556 308.758 L 291.556 306.231 L 283.976 306.231 L 283.976 308.758 L 291.556 308.758 Z M 299.139 308.758 L 299.139 306.231 L 294.083 306.231 L 294.083 308.758 L 299.139 308.758 Z M 309.247 308.758 L 309.247 306.231 L 301.666 306.231 L 301.666 308.758 L 309.247 308.758 Z M 291.556 313.812 L 291.556 311.285 L 283.976 311.285 L 283.976 313.812 L 291.556 313.812 Z M 299.139 313.812 L 299.139 311.285 L 294.083 311.285 L 294.083 313.812 L 299.139 313.812 Z M 309.247 313.812 L 309.247 311.285 L 301.666 311.285 L 301.666 313.812 L 309.247 313.812 Z M 291.556 318.865 L 291.556 316.338 L 283.976 316.338 L 283.976 318.865 L 291.556 318.865 Z M 299.139 318.865 L 299.139 316.338 L 294.083 316.338 L 294.083 318.865 L 299.139 318.865 Z" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Rect x="341.07" y="272.306" width="69.728" height="69.728" style={ { fill: 'rgb(238, 238, 238)', stroke: 'rgb(204, 208, 212)' } }/>
			<Rect x="341.262" y="334.075" width="69.408" height="8.219" style={ { stroke: 'rgb(204, 208, 212)', fill: 'rgb(255, 255, 255)' } }/>
			<Rect x="346.77" y="336.707" width="59.688" height="3.001" style={ { fill: 'rgb(180, 185, 190)' } }/>
			<Path d="M 380.902 282.295 L 391.307 292.701 L 391.307 323.919 L 360.089 323.919 L 360.089 282.295 L 380.902 282.295 Z M 380.902 292.701 L 388.707 292.701 L 380.902 284.896 L 380.902 292.701 Z M 378.3 313.513 L 378.3 305.709 C 378.3 305.007 378.039 304.381 377.545 303.862 C 377.025 303.368 376.4 303.108 375.698 303.108 L 367.894 303.108 C 367.19 303.108 366.567 303.368 366.047 303.862 C 365.552 304.381 365.293 305.007 365.293 305.709 L 365.293 313.513 C 365.293 314.216 365.552 314.839 366.047 315.361 C 366.567 315.854 367.19 316.116 367.894 316.116 L 375.698 316.116 C 376.4 316.116 377.025 315.854 377.545 315.361 C 378.039 314.839 378.3 314.216 378.3 313.513 Z M 386.105 316.116 L 386.105 303.108 L 380.902 308.31 L 380.902 310.912 Z" style={ { fill: 'rgb(180, 185, 190)' } }/>
		</G>
	</SVG>
);

export default ModifierDossierAnimation;
