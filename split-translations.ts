import * as fs from 'fs';
import * as path from 'path';
import { translations } from './src/i18n/translations';

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

for (const [locale, content] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Wrote ${filePath}`);
}
