import { useEffect } from 'react';

// Simple hook: call useEntranceAnimation(ref, options)
// ref: React ref to container element
// options: { root=null, rootMargin='0px', threshold:0.08, stagger=true }
export default function useEntranceAnimation(ref, options = {}) {
  const { root = null, rootMargin = '0px', threshold = 0.08, stagger = true } = options;

  useEffect(() => {
    if (!ref || !ref.current) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // find children with .stagger-child and reveal them with stagger
            const children = Array.from(el.querySelectorAll('.stagger-child'));
            if (stagger && children.length) {
              children.forEach((child, i) => {
                child.style.animationDelay = `${i * 80}ms`;
                child.classList.add('enter-up');
                child.style.opacity = '';
                child.style.transform = '';
              });
            } else {
              // reveal container itself
              el.classList.add('enter-up');
            }
            observer.unobserve(el);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, root, rootMargin, threshold, stagger]);
}
