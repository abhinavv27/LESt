"use client"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
}

export default function Magnetic({ children, strength = 0.2 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null!);
  const rectRef = useRef<DOMRect | null>(null);

  useGSAP(() => {
    const el = ref.current;
    
    const mouseEnter = () => {
        rectRef.current = el.getBoundingClientRect();
    };

    const mouseMove = (e: MouseEvent) => {
      if (!rectRef.current) rectRef.current = el.getBoundingClientRect();
      const { clientX, clientY } = e;
      const { left, top, width, height } = rectRef.current;
      const x = (clientX - (left + width / 2)) * strength;
      const y = (clientY - (top + height / 2)) * strength;
      
      gsap.to(el, { x, y, duration: 0.6, ease: "power2.out" });
    };
    
    const mouseLeave = () => {
      rectRef.current = null;
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    };
    
    el.addEventListener("mouseenter", mouseEnter);
    el.addEventListener("mousemove", mouseMove);
    el.addEventListener("mouseleave", mouseLeave);
    
    return () => {
      el.removeEventListener("mouseenter", mouseEnter);
      el.removeEventListener("mousemove", mouseMove);
      el.removeEventListener("mouseleave", mouseLeave);
    };
  }, { scope: ref });

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
