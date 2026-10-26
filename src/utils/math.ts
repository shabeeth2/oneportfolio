/**
 * Pure math and calculation helpers for animations and scroll effects.
 */

/**
 * Calculates card stacking target scale.
 * Formula from specs: targetScale = 1 - (totalCards - 1 - index) * 0.03
 */
export function calculateCardScale(index: number, totalCards: number): number {
  if (totalCards <= 0) return 1;
  const clampedIndex = Math.max(0, Math.min(index, totalCards - 1));
  return 1 - (totalCards - 1 - clampedIndex) * 0.03;
}

/**
 * Calculates horizontal scroll offset for marquee rows.
 * Formula from specs: (scrollY - sectionTop + innerHeight) * 0.3
 */
export function calculateScrollOffset(
  scrollY: number,
  sectionTop: number,
  innerHeight: number,
  factor = 0.3
): number {
  return (scrollY - sectionTop + innerHeight) * factor;
}

export interface RectBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MagnetOffset {
  x: number;
  y: number;
  isHovered: boolean;
}

/**
 * Calculates magnetic offset based on mouse position relative to element center and padding.
 */
export function calculateMagnetOffset(
  clientX: number,
  clientY: number,
  rect: RectBounds,
  padding = 150,
  strength = 3
): MagnetOffset {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Check if cursor is within padding distance of the element bounds
  const withinX = clientX >= rect.left - padding && clientX <= rect.left + rect.width + padding;
  const withinY = clientY >= rect.top - padding && clientY <= rect.top + rect.height + padding;

  if (withinX && withinY && strength > 0) {
    const deltaX = (clientX - centerX) / strength;
    const deltaY = (clientY - centerY) / strength;
    return {
      x: deltaX,
      y: deltaY,
      isHovered: true,
    };
  }

  return {
    x: 0,
    y: 0,
    isHovered: false,
  };
}

/**
 * Calculates character opacity given its index, total characters, and current scroll progress [0..1].
 * Returns opacity in [0.2, 1.0].
 */
export function calculateCharacterOpacity(
  charIndex: number,
  totalChars: number,
  scrollProgress: number
): number {
  if (totalChars <= 0) return 1;
  const step = 1 / totalChars;
  const charStart = charIndex * step;
  const charEnd = (charIndex + 1) * step;

  if (scrollProgress <= charStart) {
    return 0.2;
  }
  if (scrollProgress >= charEnd) {
    return 1.0;
  }

  // Linear interpolation between 0.2 and 1.0 within its segment
  const localProgress = (scrollProgress - charStart) / (charEnd - charStart);
  return 0.2 + localProgress * 0.8;
}
