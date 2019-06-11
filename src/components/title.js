import React from 'react';


function Title(props) {
    return (
        <div className='section-wrapper'>
            <div className='title purple'> { props.title } </div>
            <div className='subtitle-wrapper'>
                <div className='subtitle'> { props.subtitle } </div>
                <div className='subtitle-detail'> { props.subtitleDetail } </div>
            </div>
        </div>
    )
}

export default Title;

