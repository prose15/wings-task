🚗 Car Scroll Animation — React Three Fiber + GSAP

This project creates an interactive 3D scroll-based animation using React Three Fiber, GSAP, and ScrollTrigger.
As the user scrolls through the page, a 3D car model smoothly rotates, and later, a car cover slides off dynamically — simulating a reveal animation.

🧩 Tech Stack

React — Component-based UI framework

React Three Fiber (R3F) — React renderer for Three.js

@react-three/drei — Utility components and helpers for R3F

GSAP + ScrollTrigger — Timeline-based scroll animations

React Suspense — Lazy-loading fallback for 3D models

🎯 Features Implemented
1. Scroll-driven 3D Animation

The page uses GSAP’s ScrollTrigger to map scroll progress (0 → 1) to 3D object animations.

The scroll area is extended (height: 900vh) to allow enough movement room for the sequence.

2. Car Rotation Sequence

The car rotates through multiple predefined keyframes based on scroll progress.

Smooth transitions between rotation states using GSAP easing.

3. Cover Reveal Animation

The car cover (a separate 3D model) stays aligned with the car initially.

After the main rotation sequence (~500vh), the cover begins to slide off gradually during the remaining 400vh of scroll.

4. Scene Lighting & Camera

PerspectiveCamera used for realistic depth perception.

Ambient and spot lights simulate realistic reflections.

5. Model Loading with Suspense

Both models (CarModel, CarCoverModel) are lazy-loaded inside Suspense for smoother UX.

A fullscreen fallback loader is shown until the 3D assets are ready.