import  { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const AnimatedComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // only trigger once
    threshold: 0.5 // trigger animation when 50% of the component is visible
  });

  const springProps = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-50px)',
    config: { tension: 100, friction: 40 }, // adjust spring config as needed
    immediate: !isVisible // animate immediately if component is not visible
  });

  // Once the component is in view, set isVisible to true to trigger animation
  if (inView && !isVisible) {
    setIsVisible(true);
  }

  return (
    <animated.div ref={ref} style={springProps}>
      <img src="https://dreamsrent.dreamstechnologies.com/react/template/assets/img/cars/car-01.jpg" alt="Your Image" />
    </animated.div>
  );
};

export default AnimatedComponent;
