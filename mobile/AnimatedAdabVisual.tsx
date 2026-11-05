import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

type AdabVisualProps = {
  readonly id: string;
  readonly onInteract?: () => void;
};

export default function AnimatedAdabVisual({ id, onInteract }: AdabVisualProps) {
  const [bounceAnim] = useState(() => new Animated.Value(1));
  const [floatAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loopAnim.start();

    return () => {
      loopAnim.stop();
    };
  }, [floatAnim]);

  const handleTap = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.85, duration: 90, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 3, tension: 50, useNativeDriver: true }),
    ]).start();

    if (onInteract) {
      onInteract();
    }
  };

  return (
    <Pressable onPress={handleTap} accessibilityRole="button" accessibilityLabel="Tap for interactive movement">
      <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
        {id === 'manner-cleanliness' ? (
          <View style={styles.visualWell}>
            <Animated.Text style={[styles.mainEmoji, { transform: [{ translateY: floatAnim }] }]}>
              🧼
            </Animated.Text>
            <Animated.View style={[styles.bubbleRow, { transform: [{ translateY: floatAnim }] }]}>
              <Text style={styles.bubbleEmoji}>🫧</Text>
              <Text style={[styles.bubbleEmoji, styles.smallBubble]}>🫧</Text>
              <Text style={styles.bubbleEmoji}>🫧</Text>
            </Animated.View>
          </View>
        ) : id === 'manner-eating' ? (
          <View style={styles.visualWell}>
            <Animated.Text style={[styles.mainEmoji, { transform: [{ scale: bounceAnim }] }]}>
              🥛
            </Animated.Text>
            <Text style={styles.subEmoji}>💧</Text>
          </View>
        ) : id === 'manner-smiling' ? (
          <View style={styles.visualWell}>
            <Animated.Text style={[styles.mainEmoji, { transform: [{ scale: bounceAnim }] }]}>
              ☀️
            </Animated.Text>
            <Animated.Text style={[styles.sparkleText, { transform: [{ translateY: floatAnim }] }]}>
              ✨ ✨
            </Animated.Text>
          </View>
        ) : id === 'manner-kindness-animals' ? (
          <View style={styles.visualWell}>
            <Animated.Text style={[styles.mainEmoji, { transform: [{ translateY: floatAnim }] }]}>
              🐱
            </Animated.Text>
            <Text style={styles.subEmoji}>🌿</Text>
          </View>
        ) : (
          <View style={styles.visualWell}>
            <Animated.Text style={[styles.mainEmoji, { transform: [{ scale: bounceAnim }] }]}>
              🎁
            </Animated.Text>
            <Animated.Text style={[styles.sparkleText, { transform: [{ translateY: floatAnim }] }]}>
              💛
            </Animated.Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  visualWell: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF8E8',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFC857',
  },
  mainEmoji: {
    fontSize: 56,
  },
  subEmoji: {
    fontSize: 22,
    position: 'absolute',
    bottom: 12,
    right: 20,
  },
  bubbleRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
  },
  bubbleEmoji: {
    fontSize: 20,
  },
  smallBubble: {
    fontSize: 14,
    marginTop: -6,
  },
  sparkleText: {
    fontSize: 18,
    position: 'absolute',
    top: 12,
  },
});