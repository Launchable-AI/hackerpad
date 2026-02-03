const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recordDemo() {
  const outputDir = path.join(__dirname, '..', 'demo');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clean up any existing video files
  const existingFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  existingFiles.forEach(f => fs.unlinkSync(path.join(outputDir, f)));

  console.log('[DEMO] Launching browser...');
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  // Clear localStorage to start fresh
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await wait(2000);

  console.log('[DEMO] Starting walkthrough...');

  // Get canvas position for drawing
  const canvas = await page.$('#canvas');
  const canvasBox = await canvas.boundingBox();
  const cx = canvasBox.x + canvasBox.width / 2;
  const cy = canvasBox.y + canvasBox.height / 2;

  // === SCENE 1: Draw laptop screen (main rectangle) ===
  console.log('[DEMO] Drawing laptop screen...');
  await page.fill('#strokeColor', '#00ff9d');
  await page.click('[data-tool="rect"]');
  await wait(400);
  const screenLeft = cx - 180;
  const screenTop = cy - 120;
  const screenRight = cx + 180;
  const screenBottom = cy + 60;
  await page.mouse.move(screenLeft, screenTop);
  await page.mouse.down();
  await page.mouse.move(screenRight, screenBottom, { steps: 25 });
  await page.mouse.up();
  await wait(600);

  // === SCENE 2: Draw laptop base/keyboard ===
  console.log('[DEMO] Drawing laptop base...');
  await page.fill('#strokeColor', '#00ffff');
  await wait(200);
  const baseLeft = cx - 200;
  const baseTop = cy + 65;
  const baseRight = cx + 200;
  const baseBottom = cy + 120;
  await page.mouse.move(baseLeft, baseTop);
  await page.mouse.down();
  await page.mouse.move(baseRight, baseBottom, { steps: 20 });
  await page.mouse.up();
  await wait(600);

  // === SCENE 3: Draw trackpad on base ===
  console.log('[DEMO] Drawing trackpad...');
  await page.fill('#strokeColor', '#ff00ff');
  await wait(200);
  await page.mouse.move(cx - 40, cy + 80);
  await page.mouse.down();
  await page.mouse.move(cx + 40, cy + 110, { steps: 15 });
  await page.mouse.up();
  await wait(600);

  // === SCENE 4: Draw keyboard lines ===
  console.log('[DEMO] Drawing keyboard...');
  await page.click('[data-tool="line"]');
  await wait(300);
  // Keyboard row 1
  await page.mouse.move(cx - 170, cy + 75);
  await page.mouse.down();
  await page.mouse.move(cx - 60, cy + 75, { steps: 10 });
  await page.mouse.up();
  await wait(200);
  // Keyboard row 2
  await page.mouse.move(cx + 60, cy + 75);
  await page.mouse.down();
  await page.mouse.move(cx + 170, cy + 75, { steps: 10 });
  await page.mouse.up();
  await wait(200);
  // Keyboard row 3
  await page.mouse.move(cx - 170, cy + 90);
  await page.mouse.down();
  await page.mouse.move(cx - 60, cy + 90, { steps: 10 });
  await page.mouse.up();
  await wait(200);
  // Keyboard row 4
  await page.mouse.move(cx + 60, cy + 90);
  await page.mouse.down();
  await page.mouse.move(cx + 170, cy + 90, { steps: 10 });
  await page.mouse.up();
  await wait(600);

  // === SCENE 5: Add "HACKERPAD" text on screen ===
  console.log('[DEMO] Adding text...');
  await page.fill('#strokeColor', '#00ff9d');
  await wait(200);
  await page.click('[data-tool="text"]');
  await wait(400);
  await page.mouse.click(cx, cy - 30);
  await wait(400);
  await page.fill('#text-input', 'HACKERPAD');
  await page.keyboard.press('Enter');
  await wait(800);

  // === SCENE 6: Draw a small logo/icon on screen ===
  console.log('[DEMO] Drawing logo...');
  await page.fill('#strokeColor', '#ff6b9d');
  await wait(200);
  await page.click('[data-tool="ellipse"]');
  await wait(300);
  await page.mouse.move(cx - 30, cy - 90);
  await page.mouse.down();
  await page.mouse.move(cx + 30, cy - 50, { steps: 15 });
  await page.mouse.up();
  await wait(600);

  // === SCENE 7: Draw connector from logo to text ===
  console.log('[DEMO] Drawing connector...');
  await page.fill('#strokeColor', '#00ffff');
  await wait(200);
  await page.click('[data-tool="connect"]');
  await wait(300);
  await page.mouse.move(cx, cy - 50);
  await page.mouse.down();
  await page.mouse.move(cx, cy - 35, { steps: 10 });
  await page.mouse.up();
  await wait(600);

  // === SCENE 8: Show radial menu ===
  console.log('[DEMO] Showing radial menu...');
  await page.mouse.click(cx + 250, cy, { button: 'right' });
  await wait(1200);
  await page.keyboard.press('Escape');
  await wait(400);

  // === SCENE 9: Select and highlight the laptop ===
  console.log('[DEMO] Selecting artwork...');
  await page.click('[data-tool="select"]');
  await wait(300);
  // Drag select all
  await page.mouse.move(cx - 220, cy - 140);
  await page.mouse.down();
  await page.mouse.move(cx + 220, cy + 130, { steps: 20 });
  await page.mouse.up();
  await wait(1000);

  // === SCENE 10: Final pause ===
  console.log('[DEMO] Final view...');
  await page.keyboard.press('Escape');
  await wait(1500);

  // Wrap up
  console.log('[DEMO] Recording complete, saving video...');
  await context.close();
  await browser.close();

  // Find and rename the recorded video
  const files = fs.readdirSync(outputDir);
  const videoFile = files.find(f => f.endsWith('.webm'));
  if (videoFile) {
    const oldPath = path.join(outputDir, videoFile);
    const newPath = path.join(outputDir, 'hackerpad-demo.webm');
    fs.renameSync(oldPath, newPath);
    console.log(`[DEMO] Video saved to: ${newPath}`);
  }

  console.log('[DEMO] Done!');
}

recordDemo().catch(err => {
  console.error('[DEMO] Error:', err);
  process.exit(1);
});
