import * as React from 'react'
import Maximized from '../components/chat/Maximized'
import Minimized from '../components/chat/Minimized'
import { ThemeProvider, FixedWrapper, defaultTheme } from '@livechat/ui-kit'
import moment from 'moment'
const AWS = window.AWS;

/*AWS.config.region = 'ap-southeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-southeast-1:c47b18c5-d242-4350-981c-35024c1badd6',
});*/

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
 IdentityPoolId: 'us-east-1:5e406517-f2fa-4ea3-a014-38f4f113140b', //dev
  // IdentityPoolId: 'us-east-1:02490fc9-5c89-4efb-9cda-6202de1d3c19', //qa
});

let lexRunTime = new AWS.LexRuntime();
let lexUserId = 'mediumBot' + Date.now();

class App extends React.Component {
    state = {
        theme: 'defaultTheme',
        messages:[],
    }

    theme = {
      ...defaultTheme,
      vars:{
        'primary-color':'#F5821F',
        'secondary-color':'#F4F0EC',
      },
      TitleBar: {
        css: {
          width:'auto',
          background:'#ffffff',
          borderRadius:'20px',
          color:'#333',
          font: 'normal normal bold 24px/28px Arial',
          fontSize: '24px',
          padding: '15px 15px 0 15px',
          alignItems: 'baseline',
        },
      },
      MessageGroup: {
        css: {
          marginBottom: '0',
          paddingLeft: '11px',
          paddingRight: '0.5em',
        },
      },
      Bubble: {
        css: {
          background: '#555858',
          border: '1px solid #555858',
          opacity: '1',
          marginBottom: '4px',
          display: 'inline-block',
        },
      },
      Message: {
        css: {
          marginBottom: '0.5em',
          marginRight: '0',
        },
      },
      MessageText: {
        css: {
          font: 'normal normal normal 14px/17px Arial',
          padding: '0',
        },
      },
      Avatar: {
        css: {
          width: '40px !important',
          height: '45px !important',
          minWidth: 'unset',
        },
      },
      TextInput: {
        css: {
          margin: '8px 0',
          font: 'normal normal normal 16px/18px Arial',
          letterSpacing: '0',
          color: '#333333',
          opacity: '0.5',
        },
      },
      TextComposer: {
        css: {
          borderRadius: '50px',
          margin: '0',
          border: '0.5px solid #000',
          opacity: '1',
          padding: '7px',
        },
        SendIcon: {
          css: {
            width: '18px',
            height: '16px',
          },
        },
      },
    }
    componentDidMount() {
      this.intervalId = window.setInterval(() => {
        const messages = this.state.messages;
        if(messages.length > 0 ){
            const message = messages[messages.length - 1];
            const diff = moment().diff(moment(message.messageDate), 'seconds');
            
            if(diff > 29) {
                this.handleWrapupMessage({text: 'Need help with anything else!', value: '', showYesNo: true}, false);
                // setCloseFlagOne(true);
            }
        }
        }
      , 1000);
    }
    componentWillUnmount() {
      clearInterval(this.intervalId);
    }
    handleNewUserMessage = (newMessage, ownMessage) => {
      if(this.state.messages.length ===0){
        this.setState({messages:[...this.state.messages,  {message:'', isOwn:ownMessage, messageDate: new Date(), showYesNo: false}]});
      } else {
        this.setState({messages:[...this.state.messages, {message:newMessage.text, isOwn:ownMessage, showYesNo: newMessage.showYesNo, messageDate: new Date()}, {message:'', isOwn:ownMessage, showYesNo: false}]});
      }
      this.sendToLex(newMessage.value);
    }
    handleWrapupMessage = (newMessage, ownMessage) => {
        this.setState({messages:[...this.state.messages, {message:newMessage.text, isOwn:ownMessage, showYesNo: newMessage.showYesNo, showWrapupStepTwo: newMessage.showWrapupStepTwo, messageDate: newMessage.messageDate}]});
    }
    handleWraupRating = (message) => {
      this.sendToLex(message);
    }
    handleSkipAccountNumber = (message) => {
      this.sendToLex(message);
    }
    sendToLex = (message) => {
      let params = {
        botAlias: 'Oriental_englishBotAlias',
        botName: 'Oriental_englishBot',
        inputText: message,
        userId: lexUserId,
        requestAttributes: {
          "deviceType": this.state.chatDeviceType,
          "DeviceOS": this.state.chatDeviceOS,
          "chatbot_ktc": "sdasd",
        },
      }
      lexRunTime.postText(params, (err, data) => {
        if(err){
            console.log(err);
        }
        if(data){
          let mesg = {message: data.message, isOwn:false, messageDate: new Date()};
          if(data.responseCard && data.responseCard.version){
            mesg.responseCard = data.responseCard;
          }
          const oldMessages = [...this.state.messages];
          if(oldMessages[oldMessages.length - 1].message === '') {
            oldMessages.splice(-1, 1);
          }
          this.setState({messages:[...oldMessages, mesg]});
        }
      })
    }
    
   addMessages = (data) => {
     this.setState({messages:[...this.state.messages, {message:data.inputTranscript, isOwn:true},{message:data.message, isOwn:false}]});
   }
   clearMessage = () => {
    this.setState({messages:[]});
  }
    render() {
        return (
            <ThemeProvider theme={this.theme}>
                <div style={{
                }}>
                    <FixedWrapper.Root >
                        <FixedWrapper.Maximized className='main-wrapper'>
                            <Maximized messages = {this.state.messages} handleMessage= {this.handleNewUserMessage} handleWrapupMessage = {this.handleWrapupMessage} handleWraupRating={this.handleWraupRating} handleSkipAccountNumber={this.handleSkipAccountNumber} addMessages= {this.addMessages} onCloseClick={this.clearMessage} {...this.props} />
                        </FixedWrapper.Maximized>
                        <FixedWrapper.Minimized style={{
                              width: '107px',
                              height: '67px',
                            }}>
                            <Minimized {...this.props} />
                        </FixedWrapper.Minimized>
                    </FixedWrapper.Root>
                </div>
            </ThemeProvider>
              )
          }
}

export default App