import React, { useEffect, useState } from 'react';

interface SubtleAnimatedBackgroundProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

const SubtleAnimatedBackground: React.FC<SubtleAnimatedBackgroundProps> = ({ 
  children, 
  intensity = 'medium' 
}) => {
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    size: number;
    left: number;
    duration: number;
    delay: number;
  }>>([]);

  const [waves, setWaves] = useState<Array<{
    id: number;
    height: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);

  const [droplets, setDroplets] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const intensityConfig = {
      low: { bubbles: 3, waves: 2, droplets: 5 },
      medium: { bubbles: 5, waves: 3, droplets: 8 },
      high: { bubbles: 8, waves: 4, droplets: 12 }
    };

    const config = intensityConfig[intensity];

    // Generate bubbles
    const newBubbles = Array.from({ length: config.bubbles }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20, // 20-80px
      left: Math.random() * 100, // 0-100%
      duration: Math.random() * 10 + 15, // 15-25s
      delay: Math.random() * 5, // 0-5s delay
    }));

    // Generate waves
    const newWaves = Array.from({ length: config.waves }, (_, i) => ({
      id: i,
      height: Math.random() * 2 + 1, // 1-3px
      top: Math.random() * 100, // 0-100%
      duration: Math.random() * 20 + 30, // 30-50s
      delay: Math.random() * 10, // 0-10s delay
    }));

    // Generate floating droplets
    const newDroplets = Array.from({ length: config.droplets }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0-100%
      top: Math.random() * 100, // 0-100%
      delay: Math.random() * 4, // 0-4s delay
    }));

    setBubbles(newBubbles);
    setWaves(newWaves);
    setDroplets(newDroplets);
  }, [intensity]);

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Floating Bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={`bubble-${bubble.id}`}
            className="bubble"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}

        {/* Flowing Waves */}
        {waves.map((wave) => (
          <div
            key={`wave-${wave.id}`}
            className="wave-element"
            style={{
              height: `${wave.height}px`,
              top: `${wave.top}%`,
              width: '200px',
              animationDuration: `${wave.duration}s`,
              animationDelay: `${wave.delay}s`,
            }}
          />
        ))}

        {/* Floating Droplets */}
        {droplets.map((droplet) => (
          <div
            key={`droplet-${droplet.id}`}
            className="floating-droplet"
            style={{
              left: `${droplet.left}%`,
              top: `${droplet.top}%`,
              animationDelay: `${droplet.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SubtleAnimatedBackground;
