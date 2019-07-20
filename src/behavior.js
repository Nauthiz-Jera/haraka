import React from 'react';

import { Animated } from 'react-native';
// Move constants to their own constants file
import { PRESETS, LAYOUT_PRESETS, PROPS } from './behavior.constants';
// Abstracted logic to utility file
import { getViewStyles, getPropStyles, getNativeStyle } from './behavior.utility';

export default class Behavior extends React.PureComponent {
  ref = React.createRef();

  static defaultProps = {
    clamp: false,
    clearStyleProps: false,
    config: { type: 'spring' },
    currentState: 0,
    disabled: false,
    initialState: 0,
    skipProps: [],
    skipStyleProps: [],
    state: [{}, {}],
    style: {},
    styleProps: [],
    unmounted: false,
  };

  constructor(props) {
    super(props);

    const { initialState, nativeDriver, unmounted } = this.props;

    this.nativeDriver = nativeDriver || new Animated.Value(initialState);

    this.key = initialState;

    this.state = {
      mounted: !unmounted,
    };
  }

  componentDidMount() {
    const { disabled } = this.props;

    if (disabled) {
      this.disable();
    }
  }

  //change deprecated lifecycle method to preferred method
  getDerivedStateFromProps(nextProps) {
    const { currentState, disabled, clearStyleProps, keys, skipProps, style } = this.props;
    const { currentState: nextCurrentState, disabled: nextDisabled } = nextProps;
    const viewStyles = getViewStyles(LAYOUT_PRESETS, this.props);
    const propStyles = getPropStyles(this.props, skipProps);
    const nativeStyles = getNativeStyle(clearStyleProps, PROPS);
    let { state } = this.props;

    if (currentState !== nextCurrentState) {
      this.goTo(nextCurrentState);
    }

    if (!disabled && nextDisabled) {
      this.disable();
    } else if (disabled && !nextDisabled) {
      this.enable();
    }

    if (faded) {
      state = PRESETS.faded;
    }
    // Remove unnecessary need of fill,
    // by passing array like object with determined length set
    const inputRange = keys || Array.from({ length: state.length }, (x, i) => i);

    if (inputRange.length === 1) {
      inputRange.push(1);
      this.forceUpdate();
    }

    return {
      animatedViewStyles: [style, viewStyles, propStyles, nativeStyles],
    };
  }

  mount = state => {
    const { initialState } = this.props;

    this.nativeDriver.setValue(state || initialState);

    this.setState({ mounted: true });
  };

  unmount = () => {
    this.setState({ mounted: false });
  };

  goTo = (key, config = {}) => {
    const isSequence = Array.isArray(key);

    const { config: defaultConfig, state } = this.props;

    const { config: stateConfig = {} } = isSequence ? {} : state[key];

    const { delay, onComplete, ref, type, unmount, ...opts } = {
      ...defaultConfig,
      ...stateConfig,
      ...config,
    };

    const curve = type === 'timing' ? Animated.timing : Animated.spring;

    const animate = toValue => {
      return curve(this.nativeDriver, {
        ...opts,
        toValue,
        useNativeDriver: true,
      });
    };

    if (isSequence) {
      const sequence = [];

      key.forEach(toValue => sequence.push(animate(toValue)));

      this.key = sequence[sequence.length - 1];

      let animationRef = Animated.sequence(sequence);

      if (delay) {
        animationRef = Animated.sequence([Animated.delay(delay), animationRef]);
      }

      if (ref) {
        return animationRef;
      }

      return animationRef.start(animation => {
        if (animation.finished) {
          if (unmount) this.unmount();
          if (onComplete) onComplete();
        }
      });
    }

    this.key = key;

    let animationRef = animate(key);

    if (delay) {
      animationRef = Animated.sequence([Animated.delay(delay), animationRef]);
    }

    if (ref) {
      return animationRef;
    }

    return animationRef.start(animation => {
      if (animation.finished) {
        if (unmount) this.unmount();
        if (onComplete) onComplete();
      }
    });
  };

  setNativeProps = props => {
    this.ref.current.setNativeProps(props);
  };

  disable = () => {
    this.setNativeProps({ pointerEvents: 'none' });
  };

  enable = () => {
    this.setNativeProps({ pointerEvents: 'auto' });
  };

  // cleaned up logic in render statement
  render() {
    const { children, pointerEvents } = this.props;
    const { animatedViewStyles, mounted } = this.state;

    if (!mounted) {
      return null;
    }

    return (
      // Remove array literal being passed down to array ref held in state
      // array literals being passed can force re-renders
      <Animated.View pointerEvents={pointerEvents} ref={this.ref} style={animatedViewStyles}>
        {children}
      </Animated.View>
    );
  }
}
