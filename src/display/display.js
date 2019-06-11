import React from 'react';
import './display.css';

import phoneReflection from '../assets/phone-reflection.jpg';

import data from '../data';

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
            this.phonePositionCSS = {top: 2000 - (1080 + 257) + (1080 + 257) * 0.4 * 0.7};
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
                        <div>
                            <div className='subtitle'> { data.display.subtitles[0].subtitle } </div>
                            <div className='subtitle-detail'> { data.display.subtitles[0].detail} </div>
                        </div>
                        <div>
                            <div className='subtitle'> { data.display.subtitles[1].subtitle } </div>
                            <div className='subtitle-detail'> { data.display.subtitles[1].detail} </div>
                        </div>
                        <div>
                            <div className='subtitle'> { data.display.subtitles[2].subtitle } </div>
                            <div className='subtitle-detail'> { data.display.subtitles[2].detail} </div>
                        </div>
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
            </div>
        )
    }
}

export default Display;

