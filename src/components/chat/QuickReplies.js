import React, { Component } from 'react';

class QuickReplies extends Component {
    render() {
        const { options, onSelect } = this.props;
        return (
            <div className='quick-replies' role='listbox' style={{ display: 'contents',
            justifyContent: 'left',
            textAlign: 'left' }}>
                {
                    options.map( option => <button aria-label={option.text + ' button' } 
                    key={option.text} onClick={() => onSelect(option.text, option.value)}>{option.text}</button> )
                }
                
            </div>
        );
    }
}

export default QuickReplies;