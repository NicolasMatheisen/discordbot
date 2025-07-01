// src/utils/drawUtils.js

/**
 * Zeichnet einen einfarbigen Hintergrund auf das Canvas.
 */
export function drawBackground(ctx, w, h, color = '#222222') {
  ctx.save()
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
}

/**
 * Zeichnet ein abgerundetes Rechteck auf das Canvas.
 */
function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.arcTo(x + w, y, x + w, y + radius, radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
  ctx.lineTo(x + radius, y + h)
  ctx.arcTo(x, y + h, x, y + h - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
  ctx.fill()
}

/**
 * Zeichnet die Killer-Build-Übersicht inklusive Addons und Offering-Beschriftung:
 * - großen grauen Kasten oben
 * - Build-Name
 * - Killer-Icon
 * - 4 Perk-Icons kreuzförmig
 * - Offering-Icon unten rechts + Name
 * - 2 Addon-Icons unten links + je Name
 * - 2×3 kleine Perk-Boxen und ein langes Rechteck unten
 */
export function drawBuildOverview(ctx, {
  width,
  height,
  killerImage,
  buildName,
  perkNames    = [],
  perkImages   = [],
  addonNames   = [],
  addonImages  = [],
  offeringImage = null,
  offeringName  = ''
}) {
  // Hintergrund
  drawBackground(ctx, width, height, '#222222')

  // Konstanten
  const margin     = 40
  const gap        = 8
  const padding    = 20
  const nameOffset = 10

  // Großer grauer Kasten
  const bigX = margin
  const bigY = margin
  const bigW = width - 2 * margin
  const bigH = height * 0.7 - margin
  ctx.fillStyle = '#555555'
  drawRoundedRect(ctx, bigX, bigY, bigW, bigH, 18)

  // Build-Name
  ctx.fillStyle    = '#ffffff'
  ctx.font         = 'bold 30px "GillSansMedium"'
  ctx.textBaseline = 'top'
  ctx.textAlign    = 'left'
  ctx.fillText(
    buildName,
    bigX + padding,
    bigY + padding + nameOffset
  )

  // Killer-Icon
  const killerSize = 128
  ctx.drawImage(
    killerImage,
    bigX + bigW - killerSize - padding,
    bigY + padding,
    killerSize, killerSize
  )

  // 4 Perk-Icons kreuzförmig
  if (perkImages.length >= 4) {
    const icons = perkImages.slice(0, 4)
    const maxDim = Math.max(...icons.map(img => Math.max(img.width, img.height)))
    const offset = maxDim - 128
    const cx = bigX + bigW / 2
    const cy = bigY + bigH / 2
    const [top, right, bottom, left] = icons

    ctx.drawImage(top,
      cx - top.width/2,
      cy + offset - top.height/2
    )
    ctx.drawImage(right,
      cx - offset - right.width/2,
      cy - right.height/2
    )
    ctx.drawImage(bottom,
      cx - bottom.width/2,
      cy - offset - bottom.height/2
    )
    ctx.drawImage(left,
      cx + offset - left.width/2,
      cy - left.height/2
    )
  }

  // Offering-Icon + Name
  if (offeringImage) {
    const ox = bigX + bigW - offeringImage.width - padding
    const oy = bigY + bigH - offeringImage.height - padding
    ctx.drawImage(offeringImage, ox, oy)

    if (offeringName) {
      ctx.fillStyle = '#ffffff'
      ctx.font      = '14px "GillSansMedium"'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(
        offeringName,
        ox + offeringImage.width / 2,
        oy - 4
      )
    }
  }

  // 2 Addon-Icons + Names
  if (addonImages.length > 0) {
    const ax = bigX + padding
    const ay = bigY + bigH - addonImages[0].height - padding
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = '14px "GillSansMedium"'
    ctx.fillStyle = '#ffffff'

    addonImages.forEach((img, i) => {
      const x = ax + i * (img.width + gap)
      ctx.drawImage(img, x, ay)

      const name = addonNames[i] || ''
      if (name) {
        ctx.fillText(
          name,
          x + img.width/2,
          ay + img.height + 4
        )
      }
    })
  }

  // 2×3 kleine Perk-Boxen unter dem Kasten
  const cols   = 2
  const rows   = 3
  const smallH = 40
  const smallW = (width - 2 * margin - gap) / cols
  const startY = bigY + bigH + gap

  ctx.font         = '16px "GillSansMedium"'
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x   = margin + col * (smallW + gap)
    const y   = startY + row * (smallH + gap)

    ctx.fillStyle = '#444444'
    drawRoundedRect(ctx, x, y, smallW, smallH, 8)

    const name = perkNames[i] || ''
    ctx.fillStyle = '#ffffff'
    ctx.fillText(name, x + smallW / 2, y + smallH / 2)
  }

  // Langes Rechteck darunter
  const longH = 40
  const longY = startY + rows * (smallH + gap) + gap
  const longX = margin
  const longW = width - 2 * margin
  ctx.fillStyle = '#444444'
  drawRoundedRect(ctx, longX, longY, longW, longH, 8)
}
