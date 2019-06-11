import React from 'react';
import './display.css';

import Title from '../components/title';
import phoneReflection from '../assets/phone-reflection.jpg';

class Phone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0,
            isPhoneFixed: false,
            zoomFactor: 1
        };
        this.imageArray = [];
        this.phonePhotoRef = React.createRef();
        this.scrollHandler = this.scrollHandler.bind(this);
    }
    scrollHandler() {
        const scrolled = window.scrollY;
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
        const isBeforeFixedRange = scrolled < this.animationTriggerPoints.fixedStart;
        const isAfterFixedRange = scrolled > this.animationTriggerPoints.fixedEnd;
        const isInFixedRange = !isBeforeFixedRange && !isAfterFixedRange;
        if (!isInFixedRange && this.state.isPhoneFixed) {
            this.setState({isPhoneFixed: false})
        } else if (isInFixedRange && !this.state.isPhoneFixed) {
            this.fixedCSS = {
                position: 'fixed',
                top: 0,
                left: this.imgContainer.left
            };
            this.setState({isPhoneFixed: true})
        }
        // zoom
        const isBeforeZoomRange = scrolled < this.animationTriggerPoints.zoomStart;
        const isAfterZoomRange = scrolled > this.animationTriggerPoints.zoomEnd;
        const isInZoomRange = !isBeforeZoomRange && !isAfterZoomRange;
        const newZoomFactor = 1- 0.3 * (scrolled - this.animationTriggerPoints.zoomStart) / this.animationTriggerPoints.zoomRange;
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
        this.animationTriggerPoints.fixedStart = this.imgContainer.top;
        this.animationTriggerPoints.fixedEnd = this.imgContainer.bottom;
        this.animationTriggerPoints.fixedRange = this.animationTriggerPoints.fixedEnd - this.animationTriggerPoints.fixedStart;
        // zoom out
        this.animationTriggerPoints.zoomStart = this.imgContainer.top;
        this.animationTriggerPoints.zoomEnd = this.imgContainer.top + 400;
        this.animationTriggerPoints.zoomRange = this.animationTriggerPoints.zoomEnd - this.animationTriggerPoints.zoomStart;
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
        const phoneContainerDefaultCSS = {
            transform: `scale(${this.state.zoomFactor}`,
            transformOrigin: '50% 40%'
        };
        return (
            <div className='phone-animation-container' ref={this.phonePhotoRef}>
                <div className='phone-container' ref={this.phonePhotoRef} style={this.state.isPhoneFixed ? {...this.fixedCSS, ...phoneContainerDefaultCSS} : {...phoneContainerDefaultCSS}}>
                    <img src={photoSrc} alt={'oneplus7pro'} />
                    <img src={phoneReflection} alt={'oneplus7pro reflection'} />
                </div>
            </div>
        )
    }
}

class Display extends React.Component {
    render() {
        return (
            <div className='section-wrapper'>
                <Title
                    title='Display'
                    subtitle='See the smoothness.'
                    subtitleDetail='The 6.67 inch Fluid AMOLED display on the OnePlus 7 Pro is our most advanced screen ever. Experience unrivalled smoothness and clarity with a 90 Hz refresh rate and QHD+ resolution.'
                />
                <Phone />
            </div>
        )
    }
}

export default Display;

