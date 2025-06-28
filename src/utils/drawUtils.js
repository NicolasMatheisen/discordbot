// src/utils/drawUtils.js

// --- BASICS ---
export function drawBackground(ctx, w, h, color = '#0F0F0F') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
}

export function drawText(
  ctx,
  text,
  { x, y, size = 20, color = '#FFFFFF', align = 'center' }
) {
  ctx.font = `bold ${size}px sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}

export function drawKillerIcon(
  ctx,
  image,
  { canvasWidth, margin = 10, size = 120 }
) {
  const x = margin;
  const y = margin;
  ctx.drawImage(image, x, y, size, size);
}

// --- PERK-LAYOUTS ---
export function drawPerkIconsDiamond(
  ctx,
  images,
  {
    centerX,
    centerY,
    offset = 64,
    shiftY = 0,
    scale = 0.6
  }
) {
  if (!images.length) return [];
  const w = images[0].width * scale;
  const h = images[0].height * scale;

  const positions = [
    [centerX - w / 2,            centerY - offset - h / 2 + shiftY], // oben
    [centerX - offset - w / 2,   centerY - h / 2 + shiftY],          // links
    [centerX + offset - w / 2,   centerY - h / 2 + shiftY],          // rechts
    [centerX - w / 2,            centerY + offset - h / 2 + shiftY] // unten
  ];

  images.forEach((img, i) => {
    const pos = positions[i];
    if (!pos) return;
    const [x, y] = pos;
    ctx.drawImage(img, x, y, w, h);
  });

  return positions;
}

export function drawRowIcons(
  ctx,
  images,
  {
    canvasWidth,
    canvasHeight,
    iconSize = 70,
    gap = 20,
    bottomMargin = 20
  }
) {
  const totalWidth = images.length * iconSize + (images.length - 1) * gap;
  const startX = (canvasWidth - totalWidth) / 2;
  const y = canvasHeight - iconSize - bottomMargin;

  const positions = images.map((_, i) => [
    startX + i * (iconSize + gap),
    y
  ]);

  positions.forEach(([x, yy], i) =>
    ctx.drawImage(images[i], x, yy, iconSize, iconSize)
  );

  return positions;
}

export function drawLabelsUnderIcons(
  ctx,
  texts,
  iconPositions,
  { iconSize = 70, margin = 10, size = 12, color = '#FFFFFF' } = {}
) {
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.font = `${size}px sans-serif`;

  texts.forEach((text, i) => {
    const pos = iconPositions[i];
    if (!pos) return;
    const [x, y] = pos;
    ctx.fillText(text, x + iconSize / 2, y + iconSize + margin);
  });
}

// --- HOOKUP: KOMPLETTE BUILD-ÜBERSICHT ---
export function drawBuildOverview(
  ctx,
  {
    width,
    height,
    killerImage,
    buildName,
    perkImages = [],
    perkNames = [],
    bgColor = '#0F0F0F',
    titleSize = 32,
    titleColor = '#FFE600'
  }
) {
  // 1) Hintergrund
  drawBackground(ctx, width, height, bgColor);

  // 2) Titel
  drawText(ctx, buildName, {
    x: width / 2,
    y: 50,
    size: titleSize,
    color: titleColor,
    align: 'center'
  });

  // 3) Killer-Icon
  drawKillerIcon(ctx, killerImage, {
    canvasWidth: width,
    margin: 20,
    size: 140
  });

  // 4) Perks im Diamant-Layout
  const perkPositions = drawPerkIconsDiamond(ctx, perkImages, {
    centerX: width / 2 + 40,
    centerY: height / 2 + 40,
    offset: 100,
    shiftY: 0,
    scale: 0.7
  });

  // 5) Perknamen unter die Icons
  drawLabelsUnderIcons(ctx, perkNames, perkPositions, {
    iconSize: perkImages[0]?.width * 0.7 || 70,
    margin: 8,
    size: 14,
    color: '#FFFFFF'
  });
}
