import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCardScale,
  calculateScrollOffset,
  calculateMagnetOffset,
  calculateCharacterOpacity,
} from './math.ts';

test('calculateCardScale calculates decreasing scale for earlier cards in stack', () => {
  // 3 cards: index 0, 1, 2
  // Card 2 (top/last): 1 - (3 - 1 - 2) * 0.03 = 1 - 0 = 1.00
  // Card 1: 1 - (3 - 1 - 1) * 0.03 = 1 - 0.03 = 0.97
  // Card 0: 1 - (3 - 1 - 0) * 0.03 = 1 - 0.06 = 0.94
  assert.equal(Math.round(calculateCardScale(2, 3) * 100) / 100, 1.0);
  assert.equal(Math.round(calculateCardScale(1, 3) * 100) / 100, 0.97);
  assert.equal(Math.round(calculateCardScale(0, 3) * 100) / 100, 0.94);
});

test('calculateScrollOffset factors scrollY and innerHeight correctly', () => {
  const scrollY = 500;
  const sectionTop = 300;
  const innerHeight = 800;
  // (500 - 300 + 800) * 0.3 = 1000 * 0.3 = 300
  const offset = calculateScrollOffset(scrollY, sectionTop, innerHeight, 0.3);
  assert.equal(offset, 300);
});

test('calculateMagnetOffset displaces within padding and returns zero outside', () => {
  const rect = { left: 100, top: 100, width: 200, height: 200 };
  const padding = 50;
  const strength = 2;
  // Center is (200, 200)

  // Test point inside padded area: (240, 220)
  const inside = calculateMagnetOffset(240, 220, rect, padding, strength);
  assert.equal(inside.isHovered, true);
  assert.equal(inside.x, (240 - 200) / 2); // 20
  assert.equal(inside.y, (220 - 200) / 2); // 10

  // Test point outside: (500, 500)
  const outside = calculateMagnetOffset(500, 500, rect, padding, strength);
  assert.equal(outside.isHovered, false);
  assert.equal(outside.x, 0);
  assert.equal(outside.y, 0);
});

test('calculateCharacterOpacity bounds between 0.2 and 1.0', () => {
  const total = 10;
  // At progress 0, char 5 should be 0.2
  assert.equal(calculateCharacterOpacity(5, total, 0), 0.2);
  // At progress 1, char 5 should be 1.0
  assert.equal(calculateCharacterOpacity(5, total, 1), 1.0);
  // Char 0 at progress 0.05 is mid-way (0.2 + 0.5 * 0.8 = 0.6)
  const mid = calculateCharacterOpacity(0, total, 0.05);
  assert.equal(Math.round(mid * 10) / 10, 0.6);
});
