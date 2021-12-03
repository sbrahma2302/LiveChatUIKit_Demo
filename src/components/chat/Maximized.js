import React, {useState, useEffect, useRef}  from 'react';
import logo from './logo.png';
import logo2 from './logo2.png';
import moment from 'moment';
import {
	TitleBar,
	MessageList,
	Message,
	MessageText,
	MessageGroup,
	TextComposer,
	Row,
	Fill,
	IconButton,
    CloseIcon,
    SendIcon,
    Bubble,
    // QuickReplies,
} from '@livechat/ui-kit'
import QuickReplies from './QuickReplies'
import Spinner from '../spinner/Spinner';

const Maximized = ({
	minimize,
	messages,
	handleMessage,
    addMessages,
    handleWrapupMessage,
    handleWraupRating,
    handleSkipAccountNumber,
    onCloseClick,
}) => {
    let currentReplies = useRef([]);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
         const messageGroup = document.getElementById('messageGroup');
        if(messageGroup) {
            if(localStorage.getItem('textContent') !== '') {
                document.getElementById('messageText').value = localStorage.getItem('textContent');
            }
            else {
                document.getElementById('messageText').value = message;
            }
            messageGroup.lastChild.lastElementChild.scrollIntoView({behavior: 'smooth', block:'end'});
            console.log(document.getElementById('messageText').value);
            if(document.getElementById('messageText').value === 'null'){
                document.getElementById('messageText').value = '';
            }
        }
    }, [messages]);
    
    useEffect(() => {
        if(messages.length === 0 ) {
            handleMessage({text:'Hi', value:'Hi'}, false)
        }
    }, []);
    
    const handleChange = (e) => {
        if(e){
            setMessage(e.target.value);
            localStorage.setItem('textContent', e.target.value);
        }
    }
    
    const closeEvent = () => {
        onCloseClick();
        localStorage.removeItem('textContent', '');
    }
    window.onbeforeunload = (e) => {
        localStorage.removeItem('textContent');
    }
    const quickReplySelected = (optionText, optionValue) => {
        if(optionValue.toLowerCase().startsWith('http')){
            window.open(optionValue);
        } 
        else if(optionValue.toLowerCase().startsWith('tel:')) {
            window.open(optionValue);
        }
        else if(optionValue.toLowerCase().startsWith('mailto:')) {
            window.open(optionValue);
        }
        else {
                handleMessage({text:optionText,value:optionValue}, true);
        }
    }

    const showQuickReplies = (responseCard) => {
        let options = [];
        if (responseCard.genericAttachments[0].buttons){
            currentReplies.current =  [...currentReplies.current, ...responseCard.genericAttachments[0].buttons];
            responseCard.genericAttachments[0].buttons.map( button => options.push({text:button.text, value:button.value}));
            return (           
                    <QuickReplies options = {options} onSelect={quickReplySelected}/>     
            );
        } else {
            return null;
        }
    }

    const handleKeyDown = (event) => {
        if(event.keyCode === 13){
            event.preventDefault();
            localStorage.removeItem('textContent');
            const messageText = event.target.value;
            if(messageText !== ''){
                if( messages[messages.length-1].message === 'Account Number (optional)' ){
                    let textMessage = messageText;
                    textMessage = textMessage.replace(/\d(?=\d{4})/g, "X");
                    handleMessage({text:textMessage,value:messageText}, true);
                }
                else {
                    handleMessage({text:messageText,value:messageText}, true);
                }
                setMessage('');
            }
            return false;
        }
    }

    const handleSendButtonClick = () => {
        localStorage.removeItem('textContent');
        if( message !== ''){
            if( messages[messages.length-1].message === 'Account Number (optional)' ){
                let textMessage = message;
                textMessage = textMessage.replace(/\d(?=\d{4})/g, "X");
                handleMessage({text:textMessage, value:message}, true);
            }
            else {
                handleMessage({text:message, value:message}, true);
            }
            setMessage('');
        }
    }

    const bubbleOwnStyle = {
        width: '-webkit-fill-available',
        background: '#ffffff',
        color: '#000',
        border: '0.5px solid #555858',
        borderRadius: '13px 13px 13px 4px',
        padding: '10px 13px 9px 10px !important',
    }

    const bubbleBotStyle = {
        background: '#555858',
        border: '1px solid #555858',
        opacity: '1',
        marginBottom: '4px',
        display: 'inline-block',
        borderRadius: '13px 13px 4px 13px',
        color: '#ffffff',
        textAlign: 'left',
        padding: '10px 12px 9px 15px !important'
    }
    const bubbleBotContainerStyle = {
        width: '88%',
    }
    const bubbleOwnContainerStyle = {
        width: '100%',
        textAlign: 'right'
    };
	return (
		<div className='main-container'>
            <TitleBar
        rightIcons={[
          <div
            style={{
              display: 'inline-flex',
            }}
          >
            <IconButton
              key='minimize'
              onClick={minimize}
              style={{
                padding: '0',
                marginRight: '15px',
              }}
              aria-label='minimize'
            >
              <i
                class='material-icons'
                style={{
                  color: 'rgb(102 28 105 / 0.70)',
                }}
              >
                horizontal_rule
              </i>
            </IconButton>
            <IconButton
              key='close'
              onClick={minimize}
              style={{
                padding: '0',
              }}
              aria-label='close'
            >
              <CloseIcon
                className='svg-custom'
                color='#661C69'
                onClick={closeEvent}
                style={{
                  width: '20px',
                  height: '20px',
                }}
              />
            </IconButton>
          </div>,
        ]}
        title={[
          <h1
            style={{
              fontSize: '24px',
              marginBottom: '-4px',
              marginTop: '0',
              marginLeft: '60px'
            }}
          >
            Chat
          </h1>,
        ]}
      />

        <div style={{background:'#ffffff', textAlign: 'center', padding: '5px'}}>
            <img src={logo} alt='oriental chat logo' width='70' height='70' tabIndex="0" />
        </div>  

        <div style={{textAlign: 'center', font: 'normal normal normal 12px/15px Arial',
            letterSpacing: '0', color: '#000000', opacity: '1' }} >
                <span>{moment().format("ddd, h:mm A")}</span>
        </div>
        <div id="messageList" 
            style={{
                flexGrow: 1,
                minHeight: 0,
                height: '100%',
            }}
        >
            <MessageList active containScrollInSubtree style={{
            background: '#fff',
            padding: '0',
          }}>
            
               {messages.length > 0 &&  <MessageGroup id='messageGroup' onlyFirstWithMeta>
                   {
                    messages.map(message => (
                        
                        message.message !== '' ?
                        <Message isOwn={message.isOwn} className="message-container">
                                <div style={{
                                    marginRight: '0.3em',
                                    width: '12%'
                                }}>
                            {!message.isOwn && <div><img src={logo2} alt="oriental chat logo"  height='35'  /></div> }
                                </div>
                                <div style={message.isOwn ? bubbleOwnContainerStyle : bubbleBotContainerStyle}>   
                            <Bubble isOwn={message.isOwn} style={message.isOwn ? bubbleBotStyle : bubbleOwnStyle}>
                                <MessageText>{message.message}</MessageText>
                            </Bubble>
                            {message.responseCard && showQuickReplies(message.responseCard)}
                            </div>
                        </Message> : <Spinner />
                    ))
                }
                </MessageGroup> }
            </MessageList>
        </div>
        <div style={{flexShrink: 0, padding:'5px 20px 15px 20px'}}>
            <TextComposer >
                <Row align="center" >
                    <Fill style={{
                            alignSelf: 'flex-end',
                            marginTop: '2px',
                        }}>
                        <textarea rows="3" onKeyDown={handleKeyDown} className='text-area' aria-placeholder='Type a message' placeholder='Type a message' id="messageText" name="messageText" onChange={handleChange} />
                    </Fill>
                    <IconButton aria-label='send' fit>
                        <SendIcon color='#661C69' style={{
                width: '18px',
                height: '16px',
              }} onClick= {handleSendButtonClick} />
                    </IconButton>
                </Row>
            </TextComposer>
        </div>
		</div>
	)
}

export default Maximized