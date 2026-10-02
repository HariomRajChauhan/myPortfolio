import { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frameId = null;
    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let current = { ...target };

    const render = () => {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      glowRef.current?.style.setProperty('--cursor-x', `${current.x}px`);
      glowRef.current?.style.setProperty('--cursor-y', `${current.y}px`);
      const distance = Math.abs(target.x - current.x) + Math.abs(target.y - current.y);
      frameId = distance > 0.2 ? window.requestAnimationFrame(render) : null;
    };

    const handlePointerMove = ({ clientX, clientY }) => {
      target = { x: clientX, y: clientY };
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };

    const handlePointerEnter = () => glowRef.current?.classList.add('cursor-glow-visible');
    const handlePointerLeave = () => glowRef.current?.classList.remove('cursor-glow-visible');

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerenter', handlePointerEnter);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    handlePointerEnter();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerenter', handlePointerEnter);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
};

export default CursorGlow;
