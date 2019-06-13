import React from 'react';

// it's supposed to receive props:
// flyInDelay: Number (default 0)
// offsetX: Number (default: 0)
// offsetY: Number (default: 0)

function withFlyInAnimation(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isAnimationTriggered: false,
                beforeCSS: {
                    opacity: 0,
                    transition: 0
                }
            };
            this.setUp = this.setUp.bind(this);
            this.scrollEventListener = this.scrollEventListener.bind(this);
            this.wrappedElRef = React.createRef();
        }
        setUp() {
            this.flyInDelay = this.props.flyInDelay === undefined ? 0 : this.props.flyInDelay;
            this.offsetX = this.props.offsetX === undefined ? 0 : this.props.offsetX;
            this.offsetY = this.props.offsetY === undefined ? 0 : this.props.offsetY;

            const beforeCSS = {
                opacity: 0,
                transform: `translate(${this.offsetX}px,${this.offsetY}px)`,
                transition: `1s ${this.flyInDelay}s`
            };
            const afterCSS = {
                opacity: 1,
                transform: 'translate(0,0)',
                transition: `1s ${this.flyInDelay}s`,
            };
            this.setState({
                beforeCSS: beforeCSS,
                afterCSS: afterCSS
            })
        }
        scrollEventListener() {
            // trigger when element is above the 90% height of viewport
            const wrappedElTop = this.wrappedElRef.current.getBoundingClientRect().top;
            const isTriggered = wrappedElTop < (window.innerHeight * 0.9);
            if (isTriggered) {
                this.setState((prevState) => {
                    return prevState.isAnimationTriggered ? null : {isAnimationTriggered: true}
                })
            } else {
                this.setState((prevState) => {
                    return prevState.isAnimationTriggered ? {isAnimationTriggered: false} : null
                })
            }
        }
        componentDidMount() {
            this.setUp();
            document.addEventListener('scroll', this.scrollEventListener)
        }
        componentWillUnmount() {
            document.removeEventListener('scroll', this.scrollEventListener)
        }
        render() {
            return (
                <div style={this.state.isAnimationTriggered ? this.state.afterCSS : this.state.beforeCSS} ref={this.wrappedElRef}>
                    <WrappedComponent {...this.props}/>
                </div>
            )
        }
    }
}

export { withFlyInAnimation };