import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';

interface IToastCustomError {
  text: string | undefined;
  visibilityTime: number;
  type?: 'success' | 'warning';
}

export default function ToastCustomError({
  text,
  visibilityTime,
  type = 'warning',
}: IToastCustomError) {
  const height = Dimensions.get('window').height;

  const slideAnim = useRef(new Animated.Value(height * -1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 94,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [slideAnim]);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: height * -1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, visibilityTime - 1500);
  }, [slideAnim, visibilityTime]);

  return (
    <Animated.View style={[styles.toastContainer, {top: slideAnim}]}>
      <View
        style={[
          styles.toastErrorCircle,
          type === 'success' && {backgroundColor: '#00C971'},
        ]}
      />
      <Text style={styles.toastText}>{text}</Text>
    </Animated.View>
  );
};

const styles  = StyleSheet.create({
  toastContainer: {
    minHeight: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    marginHorizontal: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  toastErrorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 10,
  },
  toastText: {
    fontFamily: 'VWHead',
    fontSize: 16,
    lineHeight: 20,
    color: 'white',
  },
});
