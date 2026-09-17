const fs = require('fs');
let content = fs.readFileSync('apps/backend/src/modules/auth/auth.service.ts', 'utf8');
content = content.replace(/interface OtpRecord \{[\s\S]*?\}\n\n/, '');
content = content.replace(/  private otpStore = new Map<string, OtpRecord>\(\);\n/, '');
fs.writeFileSync('apps/backend/src/modules/auth/auth.service.ts', content);
