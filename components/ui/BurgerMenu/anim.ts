// anim.ts

export const menuSlide = {
    initial: { x: '100%' },
    enter: {
      x: '0%',
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      x: '100%',
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };
  
  export const slide = {
    initial: { x: 60, opacity: 0 },
    enter: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.03 * i,
      },
    }),
    exit: (i: number) => ({
      x: 60,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.03 * i,
      },
    }),
  };
  
  export const scale = {
    open: {
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    closed: {
      scale: 0,
      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };
  