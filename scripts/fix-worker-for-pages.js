const fs = require('fs');
const path = require('path');

const imagesPath = path.join(__dirname, '../.open-next/cloudflare/images.js');

// Fix images.js to handle missing ASSETS binding gracefully for Cloudflare Pages
if (fs.existsSync(imagesPath)) {
  let imagesContent = fs.readFileSync(imagesPath, 'utf8');
  
  // Replace the ASSETS check to use fetch fallback for Pages
  const oldCode = `  if (parseResult.url.startsWith("/")) {
    if (env.ASSETS === void 0) {
      error("env.ASSETS binding is not defined");
      return new Response('"url" parameter is valid but upstream response is invalid', {
        status: 404
      });
    }
    const absoluteURL = new URL(parseResult.url, requestURL);
    imageResponse = await env.ASSETS.fetch(absoluteURL);`;
  
  const newCode = `  if (parseResult.url.startsWith("/")) {
    const absoluteURL = new URL(parseResult.url, requestURL);
    // For Cloudflare Pages, use fetch fallback if ASSETS binding is not available
    if (env.ASSETS !== void 0) {
      imageResponse = await env.ASSETS.fetch(absoluteURL);
    } else {
      // Pages automatically serves static assets, so we can fetch from the same origin
      imageResponse = await fetch(absoluteURL);
    }`;
  
  imagesContent = imagesContent.replace(oldCode, newCode);
  
  fs.writeFileSync(imagesPath, imagesContent);
  console.log('✓ Fixed images.js for Cloudflare Pages compatibility');
} else {
  console.warn('⚠ images.js not found, skipping fix');
}
