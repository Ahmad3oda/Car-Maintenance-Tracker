import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// Keep test uploads out of the working tree.
process.env.UPLOAD_DIR = mkdtempSync(join(tmpdir(), 'cmt-uploads-'));
