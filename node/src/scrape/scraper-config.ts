export const scraperAgs = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage', // Avoids issues with limited memory on EC2
  '--disable-accelerated-2d-canvas',
  '--disable-gpu',
  '--window-size=1920x1080',
]