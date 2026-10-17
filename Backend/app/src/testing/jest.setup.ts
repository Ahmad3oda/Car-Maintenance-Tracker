import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// Keep test uploads out of the working tree.
process.env.UPLOAD_DIR = mkdtempSync(join(tmpdir(), 'cmt-uploads-'));

// Test-only signing key; real deployments must set their own.
process.env.JWT_SECRET = 'test-secret-0123456789abcdef0123456789abcdef';

// Tests register many users quickly; the rate-limit spec lowers this itself.
process.env.AUTH_RATE_LIMIT = '1000';
