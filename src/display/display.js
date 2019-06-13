import React from 'react';
import './display.css';

import phoneReflection from '../assets/phone-reflection.jpg';

import data from '../data';
import {withFlyInAnimation} from "../animations/fade-in";

const Subtitle = (props) => <div className='subtitle three-quarter-width'> { props.content } </div>;
const SubtitleDetail = (props) => <div className='subtitle-detail three-quarter-width'> { props.content } </div>;
const WithFlyInAnimationSubtitle = withFlyInAnimation(Subtitle);
const WithFlyInAnimationSubtitleDetail = withFlyInAnimation(SubtitleDetail);

const subtitle0to2 = data.display.subtitles.slice(0, 3);
const subtitle0to2Components = subtitle0to2.map((i, index) => {
    return (
        <div key={index}>
            <WithFlyInAnimationSubtitle offsetY={200} content={i.subtitle}/>
            <WithFlyInAnimationSubtitleDetail offsetY={200} content={i.detail}/>
        </div>
    )
});

class Phone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0,
            isPhoneFixed: 'notCaught', /* 0: notCaught, 1: caught, 2: released */
            zoomFactor: 1
        };
        this.imageArray = [];
        this.phonePositionCSS = {top: 0};
        this.phonePhotoRef = React.createRef();
        this.phoneContainerRef = React.createRef();
        this.scrollHandler = this.scrollHandler.bind(this);
    }
    scrollHandler() {
        //const scrolled = window.scrollY;
        const scrolledBottom = window.scrollY + window.innerHeight;

        // rotation
        const isBeforeRotationRange = scrolledBottom < this.animationTriggerPoints.rotationStart;
        const isAfterRotationRange = scrolledBottom > this.animationTriggerPoints.rotationEnd;
        const isInRotationRange = !isBeforeRotationRange && !isAfterRotationRange;
        const newPhotoIndex = Math.ceil(100 * ((scrolledBottom - this.animationTriggerPoints.rotationStart) / this.animationTriggerPoints.rotationRange));
        if (isBeforeRotationRange && this.state.photoIndex !== 0) {
            this.setState({photoIndex: 0})
        } else if (isAfterRotationRange && this.state.photoIndex !== 100) {
            this.setState({photoIndex: 100})
        } else if (isInRotationRange) {
            this.setState((prevState) => {
                if (prevState.photoIndex !== newPhotoIndex) {
                    return {photoIndex: newPhotoIndex}
                } else return null
            })
        }
        // fixed
        const isBeforeFixedRange = scrolledBottom < this.animationTriggerPoints.fixedStart;
        const isAfterFixedRange = scrolledBottom > this.animationTriggerPoints.fixedEnd;
        const isInFixedRange = !isBeforeFixedRange && !isAfterFixedRange;
        if (isBeforeFixedRange && this.state.isPhoneFixed !== 'notCaught') {
            this.phonePositionCSS = {top: 0};
            this.setState({isPhoneFixed: 'notCaught'})
        } else if (isInFixedRange && this.state.isPhoneFixed !== 'caught') {
            this.phonePositionCSS = {top: - 0.9 * 1080 + window.innerHeight };
            this.setState({isPhoneFixed: 'caught'})
        } else if (isAfterFixedRange && this.state.isPhoneFixed !== 'released') {
            this.phonePositionCSS = {bottom: - (1080 * 0.1 + 257)};
            this.setState({isPhoneFixed: 'released'})
        }
        // zoom
        const isBeforeZoomRange = scrolledBottom < this.animationTriggerPoints.zoomStart;
        const isAfterZoomRange = scrolledBottom > this.animationTriggerPoints.zoomEnd;
        const isInZoomRange = !isBeforeZoomRange && !isAfterZoomRange;
        const newZoomFactor = 1- 0.3 * (scrolledBottom - this.animationTriggerPoints.zoomStart) / this.animationTriggerPoints.zoomRange;
        if (isBeforeZoomRange && this.state.zoomFactor !== 1) {
            this.setState({zoomFactor: 1})
        } else if (isAfterZoomRange && this.state.zoomFactor !== 0.7) {
            this.setState({zoomFactor: 0.7})
        } else if (isInZoomRange) {
            this.setState((prevState) => {
                if (prevState.zoomFactor !== newZoomFactor) {
                    return {zoomFactor: newZoomFactor}
                } else return null
            })
        }
        //
        const isBeforeMoveRange = scrolledBottom < this.animationTriggerPoints.moveStart;
        const isAfterMoveRange = scrolledBottom > this.animationTriggerPoints.moveEnd;
        const isInMoveRange = !isBeforeMoveRange && !isAfterMoveRange;
        const newMoveFactor = 0.25 * (scrolledBottom - this.animationTriggerPoints.moveStart) / this.animationTriggerPoints.moveRange;
        if (isBeforeMoveRange && this.state.moveFactor !== 0) {
            this.setState({moveFactor: 0})
        } else if (isAfterMoveRange && this.state.moveFactor !== 0.25) {
            this.setState({moveFactor: 0.25})
        } else if (isInMoveRange) {
            this.setState((prevState) => {
                if (prevState.moveFactor !== newMoveFactor) {
                    return {moveFactor: newMoveFactor}
                } else return null
            })
        }
    }
    initVariables() {
        this.imgContainer = {
            top: this.phonePhotoRef.current.offsetTop,
            height: this.phonePhotoRef.current.getBoundingClientRect().height,
            bottom: this.phonePhotoRef.current.offsetTop + this.phonePhotoRef.current.getBoundingClientRect().height,
            left: this.phonePhotoRef.current.offsetLeft,
            width: this.phonePhotoRef.current.getBoundingClientRect().width
        };

        this.animationTriggerPoints = {};
        // rotation
        this.animationTriggerPoints.rotationStart = this.imgContainer.top + 0.5 * 1080;
        this.animationTriggerPoints.rotationEnd = this.imgContainer.top + 0.9 * 1080;
        this.animationTriggerPoints.rotationRange = this.animationTriggerPoints.rotationEnd - this.animationTriggerPoints.rotationStart;
        // fixed
        this.animationTriggerPoints.fixedStart = this.imgContainer.top + 0.9 * 1080;
        this.animationTriggerPoints.fixedEnd = this.imgContainer.bottom;
        this.animationTriggerPoints.fixedRange = this.animationTriggerPoints.fixedEnd - this.animationTriggerPoints.fixedStart;
        // zoom out
        this.animationTriggerPoints.zoomStart = this.imgContainer.top + 0.9 * 1080;
        this.animationTriggerPoints.zoomEnd = this.imgContainer.top + 0.9 * 1080 + 400;
        this.animationTriggerPoints.zoomRange = this.animationTriggerPoints.zoomEnd - this.animationTriggerPoints.zoomStart;
        // move left
        this.animationTriggerPoints.moveStart = this.imgContainer.top + 0.9 * 1080 + 400;
        this.animationTriggerPoints.moveEnd = this.imgContainer.bottom;
        this.animationTriggerPoints.moveRange = this.animationTriggerPoints.moveEnd - this.animationTriggerPoints.moveStart;
    }
    preloadResources() {
        for (let i=0; i<=100; i++) {
            let img = new Image();
            img.src = `https://xiaoxihome.s3.us-east-2.amazonaws.com/oneplus7pro/phone-photos/phone${i}.jpg`;
            this.imageArray.push(img);
        }
    }
    componentDidMount() {
        this.initVariables();
        this.preloadResources();
        document.addEventListener('scroll', this.scrollHandler);
    }
    render() {
        const photoSrc = `https://xiaoxihome.s3.us-east-2.amazonaws.com/oneplus7pro/phone-photos/phone${this.state.photoIndex}.jpg`;
        const phoneContainerCSS = {
            transform: `scale(${this.state.zoomFactor}) translate(${-this.state.moveFactor * window.innerWidth}px, 0)`,
            transformOrigin: '50% 30%',
            ...this.phonePositionCSS
        };
        return (
            <div className='phone-animation-container' ref={this.phonePhotoRef}>
                <div
                    className={this.state.isPhoneFixed === 'caught' ? 'phone-container phone-container-fixed' : 'phone-container'}
                    style={{...phoneContainerCSS}}
                    ref={this.phoneContainerRef}
                >
                    <img src={photoSrc} alt={'oneplus7pro'} />
                    <img src={phoneReflection} alt={'oneplus7pro reflection'} />
                </div>

                <div className='full-width row-top-left phone-animation-text-container'>
                    <div className='half-width'>
                    </div>
                    <div className='half-width'>
                        { subtitle0to2Components }
                    </div>
                </div>
            </div>
        )
    }
}

class PlayButton extends React.Component{
    constructor(props) {
        super(props);
        this.size = this.props.size;
        this.arrowSize = this.size * 0.2;
        this.enlargeFactor = 1.2;
        this.circle = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            cursor: 'pointer',
            transition: '0.3s'
        };
        this.circleInactive = {
            width: `${this.size}px`,
            height: `${this.size}px`,
            borderRadius: `${0.5 * this.size}px`,
            backgroundColor: 'white',
        };
        this.circleActive = {
            width: `${this.enlargeFactor * this.size}px`,
            height: `${this.enlargeFactor * this.size}px`,
            borderRadius: `${0.5 * this.enlargeFactor * this.size}px`,
            backgroundColor: '#eb0028'
        };
        this.arrow = {
            width: 0,
            height: 0,
            transform: `translateX(${0.2*this.arrowSize}px)`,
            transition: '0.3s'
        };
        this.arrowInactive = {
            borderTop: `${this.arrowSize*0.7}px solid transparent`,
            borderBottom: `${this.arrowSize*0.7}px solid transparent`,
            borderLeft: `${this.arrowSize}px solid black`,
        };
        this.arrowActive = {
            borderTop: `${this.arrowSize*0.7*this.enlargeFactor}px solid transparent`,
            borderBottom: `${this.arrowSize*0.7*this.enlargeFactor}px solid transparent`,
            borderLeft: `${this.arrowSize*this.enlargeFactor}px solid white`,
        };
    }
    render() {
        return (
            <div style={this.props.isActive ? {...this.circle, ...this.circleActive} : {...this.circle, ...this.circleInactive}} onClick={this.props.clickHandler}>
                <div style={this.props.isActive ? {...this.arrow, ...this.arrowActive} : {...this.arrow, ...this.arrowInactive}}> </div>
            </div>
        )
    }
}
class Refreshrate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovering: false,
            isVideoActivated: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.activateVideo = this.activateVideo.bind(this);
    }
    handleMouseEnter() {
        this.setState((prevState) => {
            return !prevState.isHovering ? { isHovering: true } : null
        })
    }
    handleMouseLeave() {
        this.setState((prevState) => {
            return prevState.isHovering ? { isHovering: false } : null
        })
    }
    activateVideo() {
        this.setState((prevState) => {
            return !prevState.isVideoActivated ? { isVideoActivated: true } : null
        })
    }
    render() {
        return (
            <div className='wrapper-1000 row-top-left'>
                <div className='half-width'>
                    <WithFlyInAnimationSubtitle offsetY={200} content={data.display.subtitles[3].subtitle}/>
                    <WithFlyInAnimationSubtitleDetail offsetY={200} content={data.display.subtitles[3].detail}/>
                </div>
                <div className='half-width display-refreshrate-wrapper'>
                    <div className='three-quarter-width display-video-container'  onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                        {
                            this.state.isVideoActivated

                                ?
                                <React.Fragment>
                                <video playsInline={true} webkit-playsinline='true' preload="none" muted="muted" autoPlay={true}>
                                    <source src="https://xiaoxihome.s3.us-east-2.amazonaws.com/oneplus7pro/refreshrate/fps.mp4" type="video/mp4" />
                                </video>
                                <div className='display-video-legends row-center-center'>
                                    <div className='half-width subtitle-detail'>OnePlus 7 Pro</div>
                                    <div className='half-width subtitle-detail'>Others</div>
                                </div>
                                </React.Fragment>

                                :

                                <div className='display-video-container-cover col-center-center'>
                                    <PlayButton size={70} isActive={this.state.isHovering} clickHandler={this.activateVideo}/>
                                    <p className='subtitle-detail'>The difference 90 Hz makes</p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class Display extends React.Component {
    render() {
        return (
            <div className='col-top-center wrapper-1400'>
                <div className='wrapper-1000'>
                    <div className='header purple'> { data.display.header } </div>
                </div>
                <div className='wrapper-1000 row-top-left'>
                    <div className='half-width title'> { data.display.title.title } </div>
                    <div className='half-width title-detail'> { data.display.title.detail } </div>
                </div>

                <Phone />

                <Refreshrate />
            </div>
        )
    }
}

export default Display;

