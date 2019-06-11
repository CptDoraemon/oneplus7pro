import React from 'react';


function Title(props) {
    return (
        <div className='title-wrapper'>
            <div className='title purple'> { props.title } </div>
        </div>
    )
}

function SubTitle(props) {
    return (
        <div className='subtitle-wrapper'>
            <div className='subtitle'> { props.subtitle } </div>
            <div className='subtitle-detail'> { props.subtitleDetail } </div>
        </div>
    )
}



export { Title, SubTitle };

