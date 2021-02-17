import * as path from 'path';
import * as fs from 'fs';
import express from 'express';
import { decodePath } from '../decodePath';

export async function explorer(req:express.Request, res:express.Response):Promise<void> {
  let normalizedPath = req.params.path ? path.normalize(decodePath(req.params.path)!) : null;
  let changed = false;

  if (!normalizedPath || !fs.existsSync(normalizedPath)) {
    normalizedPath = process.cwd();
    changed = true;
  }

  const ls = fs.readdirSync(normalizedPath)
    .map((name) => ({
      name,
      isDirectory: fs.lstatSync(`${normalizedPath}/${name}`).isDirectory(),
      isProject: ['package.json', 'package-lock.json', 'yarn.lock'].includes(name),
    }));

  res.json({
    ls,
    changed,
    path: normalizedPath,
  } as NpmGuiResponse.Explorer);
}
