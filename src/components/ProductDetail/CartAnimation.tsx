"use client";

import { useEffect, useRef } from "react";

interface CartAnimationProps {
  trigger: boolean;
  productImage?: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onComplete: () => void;
}

export default function CartAnimation({
  trigger,
  productImage,
  buttonRef,
  onComplete,
}: CartAnimationProps) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;

    const button = buttonRef.current;
    if (!button) {
      onComplete();
      return;
    }

    // Detect mobile vs desktop - mobile has bottom nav with aria-label="cart"
    const isMobile = window.innerWidth < 768;
    const cartSelector = isMobile 
      ? 'nav.fixed.bottom-0 a[aria-label="cart"]' 
      : 'header a[aria-label="cart"]';
    
    const cartIcon = document.querySelector(cartSelector) as HTMLElement;

    if (!cartIcon) {
      onComplete();
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    const animationElement = document.createElement("div");
    animationElement.style.position = "fixed";
    animationElement.style.left = `${startX}px`;
    animationElement.style.top = `${startY}px`;
    animationElement.style.width = "50px";
    animationElement.style.height = "50px";
    animationElement.style.borderRadius = "12px";
    animationElement.style.backgroundColor = "#111827";
    animationElement.style.zIndex = "10000";
    animationElement.style.pointerEvents = "none";
    animationElement.style.transition = "all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    animationElement.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
    
    const isValidImageUrl = productImage && 
      (productImage.startsWith('http') || 
       productImage.startsWith('/') || 
       productImage.startsWith('data:'));
    
    if (isValidImageUrl) {
      animationElement.style.backgroundImage = `url(${productImage})`;
      animationElement.style.backgroundSize = "cover";
      animationElement.style.backgroundPosition = "center";
      animationElement.style.backgroundColor = "transparent";
    } else {
      animationElement.style.display = "flex";
      animationElement.style.alignItems = "center";
      animationElement.style.justifyContent = "center";
      animationElement.innerHTML = `
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      `;
    }

    document.body.appendChild(animationElement);

    // Initial bounce
    requestAnimationFrame(() => {
      animationElement.style.transform = "scale(1.2) translateY(-10px)";
    });

    setTimeout(() => {
      // Fly to cart with bouncy easing
      animationElement.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.5)`;
      animationElement.style.opacity = "0.9";
    }, 200);

    // Final bounce and fade
    setTimeout(() => {
      animationElement.style.opacity = "0";
      animationElement.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.2)`;
    }, 1000);

    setTimeout(() => {
      if (document.body.contains(animationElement)) {
        document.body.removeChild(animationElement);
      }
      onComplete();
      hasAnimated.current = false;
    }, 1200);
  }, [trigger, productImage, buttonRef, onComplete]);

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false;
    }
  }, [trigger]);

  return null;
}