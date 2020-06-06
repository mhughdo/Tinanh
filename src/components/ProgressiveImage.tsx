import React, { useRef } from 'react';
import { StyleSheet, StyleProp, Animated } from 'react-native';
import { View } from 'native-base';

type Props = {
  thumbnailSource: { uri: string };
  source: { uri: string };
  style: StyleProp<any>;
};

const ProgressiveImage: React.FC<Props> = ({ thumbnailSource, style, source, ...props }) => {
  const thumbnailAnimated = useRef(new Animated.Value(0)).current;
  const imageAnimated = useRef(new Animated.Value(0)).current;

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      <Animated.Image
        source={thumbnailSource}
        onLoad={handleThumbnailLoad}
        style={[{ opacity: thumbnailAnimated }, style]}
        {...props}
      />
      <Animated.Image
        source={source}
        onLoad={onImageLoad}
        style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
        {...props}
      />
    </>
  );
};

export default ProgressiveImage;

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});
