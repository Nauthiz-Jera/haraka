export const getViewStyles = (LAYOUT_PRESETS, { absolute, centered, fixed, full, landing }) => ({
  ...LAYOUT_PRESETS[absolute && 'absolute'],
  ...LAYOUT_PRESETS[centered && 'centered'],
  ...LAYOUT_PRESETS[fixed && 'fixed'],
  ...LAYOUT_PRESETS[full && 'full'],
  ...LAYOUT_PRESETS[landing && 'landing'],
});

// Nested Ternary statement, to more readable else if blocks, and updated boolean conditions
export const getRange = (prop, defaultValue) => {
  return state.reduce((range, currentState, index) => {
    const prevState = range[index - 1];
    let currentElement = defaultValue;
    if (typeof currentState[prop] === 'number') {
      currentElement = currentState[prop];
    } else if (typeof prevState[prop] === 'number') {
      currentElement = prevState[prop];
    } else if (typeof style[prop] === 'number') {
      currentElement = style[prop];
    }
    range.push(currentElement);
    return range;
  }, []);
};

export const getPropStyles = (rest, skipProps) =>
  Object.keys(rest).reduce((obj, key) => {
    if (skipProps.includes(key)) {
      return obj;
    }

    return { ...obj, [key]: rest[key] };
  }, {});

export const addProp = (prop, defaultValue) => {
  return this.nativeDriver.interpolate({
    inputRange,
    outputRange: getRange(prop, defaultValue),
    extrapolate: clamp ? 'clamp' : undefined,
  });
};

export const getNativeStyle = (clearStyleProps, PROPS) => {
  const defaultStyleProps = clearStyleProps ? [] : PROPS;

  const nativeStyles = {};

  const allStyleProps = [...defaultStyleProps, ...styleProps];

  allStyleProps.forEach(({ prop, default: defaultValue, transform }) => {
    if (!skipStyleProps.includes(prop)) {
      if (transform) {
        nativeStyles.transform = [
          ...(nativeStyles.transform || []),
          { [prop]: addProp(prop, defaultValue) },
        ];
      } else {
        nativeStyles[prop] = addProp(prop, defaultValue);
      }
    }
  });
  return nativeStyles;
};
