import * as React from 'react'
import { IconButton, ChatIcon } from '@livechat/ui-kit'
import widgetIcon from './widgetIcon.png';

const Minimized = ({ maximize }) => (
	<div
		onClick={maximize}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			// width: '60px',
			// height: '60px',
			// background: '#F5821F',
			// color: '#fff',
			// borderRadius: '50%',
			cursor: 'pointer',
		}}
	>
		{/* <IconButton color="#fff" aria-label='chatbot'>
			<ChatIcon /> */}
			<img src={widgetIcon} alt='chatbot' tabindex="0" />
		{/* </IconButton> */}
	</div>
)

export default Minimized