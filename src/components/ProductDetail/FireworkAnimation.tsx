"use client";

import { useEffect } from "react";

interface FireworkAnimationProps {
  trigger: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export default function FireworkAnimation({ trigger, buttonRef }: FireworkAnimationProps) {
  useEffect(() => {
    if (!trigger) return;

    const fireworkCount = 12;
    const container = document.body;

    const createFirework = (x: number, y: number, index: number) => {
      const firework = document.createElement("div");
      firework.style.position = "fixed";
      firework.style.left = `${x}px`;
      firework.style.top = `${y}px`;
      firework.style.width = "6px";
      firework.style.height = "6px";
      firework.style.borderRadius = "50%";
      firework.style.backgroundColor = [
        "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899"
      ][index % 6];
      firework.style.zIndex = "9999";
      firework.style.pointerEvents = "none";
      firework.style.opacity = "1";

      container.appendChild(firework);

      const angle = (index * 360) / fireworkCount;
      const distance = 60 + Math.random() * 40;
      const radians = (angle * Math.PI) / 180;

      const endX = x + Math.cos(radians) * distance;
      const endY = y + Math.sin(radians) * distance;

      requestAnimationFrame(() => {
        firework.style.transition = "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
        firework.style.transform = `translate(${endX - x}px, ${endY - y}px) scale(0)`;
        firework.style.opacity = "0";
      });

      setTimeout(() => {
        if (container.contains(firework)) {
          container.removeChild(firework);
        }
      }, 800);
    };

    const button = buttonRef.current;

    if (button) {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
          createFirework(centerX, centerY, i);
        }, i * 30);
      }
    }

    return () => {
      const fireworks = container.querySelectorAll('[style*="z-index: 9999"]');
      fireworks.forEach((fw) => {
        if (container.contains(fw)) {
          container.removeChild(fw);
        }
      });
    };
  }, [trigger, buttonRef]);

  return null;
}