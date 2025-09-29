import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";

type AnimatedWrapperProps = {
  children: JSX.Element;
  threshold?: number;
};

const AnimatedWrapper = ({ children, threshold }: AnimatedWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // only trigger once
    threshold: threshold! | 0.5, // trigger animation when 50% of the component is visible
  });

  const springProps = useSpring({
    opacity: isVisible ? 1 : 0,
    // transform: isVisible ? "translateY(0px)" : "translateY(-80px)",
    config: { tension: 150, friction: 50 }, // adjust spring config as needed
    immediate: !isVisible, // animate immediately if component is not visible
  });

  // Once the component is in view, set isVisible to true to trigger animation
  if (inView && !isVisible) {
    setIsVisible(true);
  }

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

export default AnimatedWrapper;
