#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');
const os = require('os');

// ── ANSI colors ──────────────────────────────────────────────────────────────
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const blue   = (s) => `\x1b[34m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;

// ── Package root (resolve relative to this script) ───────────────────────────
const PKG_ROOT = path.resolve(__dirname, '..');
const SKILL_SLUG = 'seedance-2-video-gen';
const INSTALL_KEY_URL = 'https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen';

// ── Banner ────────────────────────────────────────────────────────────────────
function printBanner() {
  console.log('');
  console.log(bold(cyan('╔══════════════════════════════════════════════════════════╗')));
  console.log(bold(cyan('║') + '                                                          ' + bold(cyan('║'))));
  console.log(bold(cyan('║') + '   ' + bold('🎬  Seedance 2.0 Video Gen Skill Installer') + '           ' + bold(cyan('║'))));
  console.log(bold(cyan('║') + '       ' + dim('for OpenClaw · powered by EvoLink + ByteDance') + '     ' + bold(cyan('║'))));
  console.log(bold(cyan('║') + '                  ' + dim('v1.1.0') + '                                   ' + bold(cyan('║'))));
  console.log(bold(cyan('║') + '                                                          ' + bold(cyan('║'))));
  console.log(bold(cyan('╚══════════════════════════════════════════════════════════╝')));
  console.log('');
}

// ── --help ────────────────────────────────────────────────────────────────────
function printHelp() {
  printBanner();
  console.log(bold('Usage:'));
  console.log('  npx evolink-seedance-2-skill            ' + dim('# interactive installer'));
  console.log('  npx evolink-seedance-2-skill -y          ' + dim('# non-interactive (for AI agents / CI)'));
  console.log('  npx evolink-seedance-2-skill -y --path <dir>  ' + dim('# install to specific directory'));
  console.log('  npx evolink-seedance-2-skill --llms      ' + dim('# print agent installation guide'));
  console.log('  npx evolink-seedance-2-skill --skill     ' + dim('# print SKILL.md (skill definition)'));
  console.log('  npx evolink-seedance-2-skill --no-open   ' + dim('# install without opening the API key page'));
  console.log('  npx evolink-seedance-2-skill --help      ' + dim('# show this help'));
  console.log('  npx evolink-seedance-2-skill --version   ' + dim('# show version'));
  console.log('');
  console.log(bold('Options:'));
  console.log('  -y, --yes        ' + dim('Non-interactive mode. Auto-detect skills dir, skip prompts.'));
  console.log('  --no-open        ' + dim('Do not open the API key page automatically.'));
  console.log('  --llms           ' + dim('Print the agent installation guide.'));
  console.log('  --skill          ' + dim('Print the skill definition.'));
  console.log('  --path <dir>     ' + dim('Install to a specific directory (used with -y).'));
  console.log('');
  console.log(bold('What this installer does:'));
  console.log('  1. Detects your OpenClaw skills directory');
  console.log('  2. Copies skill files (SKILL.md, scripts/, references/)');
  console.log('  3. Checks required dependencies (jq, curl)');
  console.log('  4. Guides you through API key setup (skipped in -y mode)');
  console.log('');
  console.log(bold('Environment:'));
  console.log('  EVOLINK_API_KEY   ' + dim('Your EvoLink API key (get one at https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen)'));
  console.log('');
}

function printLlms() {
  const llmsPath = path.join(PKG_ROOT, 'llms-install.md');
  if (fs.existsSync(llmsPath)) { process.stdout.write(fs.readFileSync(llmsPath, 'utf8')); }
  else { console.log('# Seedance 2 Video Generation — Agent Installation Guide\nRun: npx evolink-seedance-2-skill@latest -y --path {SKILLS_DIR}'); }
}

function printSkill() {
  const skillPath = path.join(PKG_ROOT, 'SKILL.md');
  if (fs.existsSync(skillPath)) { process.stdout.write(fs.readFileSync(skillPath, 'utf8')); }
  else { console.error('SKILL.md not found in package.'); process.exit(1); }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function maybeOpenKeyUrl(url, opts = {}) {
  if (opts.noOpen) {
    console.log('--no-open set: not opening a browser.');
    return false;
  }
  return openUrl(url);
}

function openUrl(url) {
  const platform = os.platform();
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', url] : [url];
  try { spawnSync(cmd, args, { stdio: 'ignore', detached: true }); return true; } catch { return false; }
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function commandExists(cmd) {
  try {
    const result = spawnSync(os.platform() === 'win32' ? 'where' : 'which', [cmd], {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    return result.status === 0;
  } catch {
    return false;
  }
}

function tryExec(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  // Node 16+: use cpSync if available, else manual recursion
  if (typeof fs.cpSync === 'function') {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    // Fallback for Node 16 environments without cpSync (added in 16.7)
    _copyDirRecursive(src, dest);
  }
}

function _copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      _copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

// ── Step 1: Detect skills directory ──────────────────────────────────────────
async function detectSkillsDir(rl, opts = {}) {
  console.log(bold('\n[1/4] Detecting OpenClaw skills directory...'));

  const home = os.homedir();

  // If --path is given, use it directly
  if (opts.targetPath) {
    const resolved = opts.targetPath.replace(/^~/, home);
    console.log(green('  ✓ Using specified path: ') + resolved);
    return resolved;
  }

  const candidates = [
    path.join(home, '.openclaw', 'skills'),
    path.join(home, '.config', 'openclaw', 'skills'),
    path.join(home, 'Library', 'Application Support', 'openclaw', 'skills'), // macOS
    path.join(process.env.APPDATA || '', 'openclaw', 'skills'),              // Windows
  ].filter(Boolean);

  // Try openclaw CLI
  if (commandExists('openclaw')) {
    const cliPath = tryExec('openclaw skills path') ||
                    tryExec('openclaw config get skills_dir') ||
                    tryExec('openclaw --skills-dir');
    if (cliPath && fs.existsSync(path.dirname(cliPath))) {
      console.log(green('  ✓ Found via openclaw CLI: ') + cliPath);
      return cliPath;
    }
  }

  // Check known paths
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      console.log(green('  ✓ Found: ') + candidate);
      return candidate;
    }
  }

  // Silent mode: create default path without asking
  if (opts.silent) {
    const defaultDir = path.join(home, '.openclaw', 'skills');
    console.log(yellow('  ⚠  No skills directory found, creating: ') + defaultDir);
    fs.mkdirSync(defaultDir, { recursive: true });
    return defaultDir;
  }

  // Not found — ask user
  console.log(yellow('  ⚠  Could not auto-detect OpenClaw skills directory.'));
  console.log(dim('  Common locations: ~/.openclaw/skills/  or  ~/.config/openclaw/skills/'));
  console.log('');

  const answer = await ask(
    rl,
    '  Enter skills directory path (or press Enter to install to current directory): '
  );

  if (answer.trim()) {
    const resolved = answer.trim().replace(/^~/, home);
    return resolved;
  }

  // Fallback: current directory
  const fallback = path.join(process.cwd(), 'openclaw-skills');
  console.log(yellow(`  → Installing to: ${fallback}`));
  return fallback;
}

// ── Step 2: Copy skill files ──────────────────────────────────────────────────
async function copySkillFiles(skillsDir, rl, opts = {}) {
  console.log(bold('\n[2/4] Copying skill files...'));

  const destBase = path.join(skillsDir, SKILL_SLUG);

  // Confirm overwrite if already exists (skip in silent mode — always overwrite)
  if (fs.existsSync(destBase) && !opts.silent) {
    const answer = await ask(
      rl,
      yellow(`  ⚠  Skill already installed at ${destBase}\n  Overwrite? (y/N): `)
    );
    if (!answer.trim().toLowerCase().startsWith('y')) {
      console.log(yellow('  → Skipped. Existing installation preserved.'));
      return destBase;
    }
  }

  fs.mkdirSync(destBase, { recursive: true });

  let copied = 0;

  // SKILL.md
  if (copyFile(path.join(PKG_ROOT, 'SKILL.md'), path.join(destBase, 'SKILL.md'))) {
    console.log(green('  ✓ ') + 'SKILL.md');
    copied++;
  }

  // _meta.json
  if (copyFile(path.join(PKG_ROOT, '_meta.json'), path.join(destBase, '_meta.json'))) {
    console.log(green('  ✓ ') + '_meta.json');
    copied++;
  }

  // scripts/
  const scriptsSrc = path.join(PKG_ROOT, 'scripts');
  if (fs.existsSync(scriptsSrc)) {
    copyDir(scriptsSrc, path.join(destBase, 'scripts'));
    // Make shell scripts executable
    try {
      const scripts = fs.readdirSync(path.join(destBase, 'scripts'));
      for (const s of scripts) {
        if (s.endsWith('.sh')) {
          fs.chmodSync(path.join(destBase, 'scripts', s), 0o755);
        }
      }
    } catch { /* ignore chmod errors on Windows */ }
    console.log(green('  ✓ ') + 'scripts/');
    copied++;
  }

  // references/
  const refsSrc = path.join(PKG_ROOT, 'references');
  if (fs.existsSync(refsSrc)) {
    copyDir(refsSrc, path.join(destBase, 'references'));
    console.log(green('  ✓ ') + 'references/');
    copied++;
  }

  // docs/
  const docsSrc = path.join(PKG_ROOT, 'docs');
  if (fs.existsSync(docsSrc)) {
    copyDir(docsSrc, path.join(destBase, 'docs'));
    console.log(green('  ✓ ') + 'docs/');
    copied++;
  }

  // examples/
  const examplesSrc = path.join(PKG_ROOT, 'examples');
  if (fs.existsSync(examplesSrc)) {
    copyDir(examplesSrc, path.join(destBase, 'examples'));
    console.log(green('  ✓ ') + 'examples/');
    copied++;
  }

  console.log(green(`\n  → ${copied} items installed to: ${destBase}`));
  return destBase;
}

// ── Step 3: Check dependencies ────────────────────────────────────────────────
function checkDependencies() {
  console.log(bold('\n[3/4] Checking dependencies...'));

  const deps = [
    {
      name: 'curl',
      required: true,
      installHint: {
        darwin: 'brew install curl  (or: xcode-select --install)',
        linux: 'sudo apt install curl  (or: sudo yum install curl)',
        win32: 'Download from https://curl.se/windows/',
      },
    },
    {
      name: 'jq',
      required: true,
      installHint: {
        darwin: 'brew install jq',
        linux: 'sudo apt install jq  (or: sudo yum install jq)',
        win32: 'choco install jq  (or download from https://stedolan.github.io/jq/)',
      },
    },
  ];

  let allOk = true;
  const platform = os.platform();

  for (const dep of deps) {
    if (commandExists(dep.name)) {
      console.log(green('  ✓ ') + dep.name + ' is available');
    } else {
      allOk = false;
      const hint = dep.installHint[platform] || dep.installHint.linux;
      console.log(yellow(`  ⚠  ${dep.name} not found`));
      console.log(dim(`     Install: ${hint}`));
    }
  }

  if (!allOk) {
    console.log(yellow('\n  → Some dependencies are missing. The skill requires jq and curl to run.'));
    console.log(dim('    Install them and you\'ll be good to go.'));
  } else {
    console.log(green('\n  → All dependencies satisfied.'));
  }
}

// ── Step 4: API key setup ─────────────────────────────────────────────────────
async function setupApiKey(rl, opts = {}) {
  console.log(bold('\n[4/4] EvoLink API key setup...'));

  const existing = process.env.EVOLINK_API_KEY;
  if (existing) {
    const masked = existing.slice(0, 6) + '••••••••••••••••';
    console.log(green('  ✓ EVOLINK_API_KEY is already set: ') + masked);
    return;
  }

  console.log(yellow('  ⚠  EVOLINK_API_KEY is not set.'));
  console.log('EVOLINK_KEY_URL=' + INSTALL_KEY_URL);
  console.log('AGENT_NEXT_ACTION=open_key_url_then_collect_key');
  if (opts.noOpen) { console.log('--no-open set: not opening a browser. Browser-free key setup.'); } else { console.log('Opening EVOLINK_KEY_URL in your browser...'); maybeOpenKeyUrl(INSTALL_KEY_URL, opts); }
  console.log('ENV_VAR_EXPORT=export EVOLINK_API_KEY=your_key_here');
  console.log('');
  console.log('  To generate videos you need a free EvoLink API key.');
  console.log(bold('  → Sign up at: ') + cyan('https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen'));
  console.log('');

  const answer = await ask(rl, '  Paste your API key here (or press Enter to skip): ');
  const key = answer.trim();

  if (!key) {
    console.log(yellow('  → Skipped. Set it later with:'));
    console.log(dim('    export EVOLINK_API_KEY=your_key_here'));
    return;
  }

  // Detect shell config file
  const shell = process.env.SHELL || '';
  let rcFile = path.join(os.homedir(), '.bashrc');
  if (shell.includes('zsh'))  rcFile = path.join(os.homedir(), '.zshrc');
  if (shell.includes('fish')) rcFile = path.join(os.homedir(), '.config', 'fish', 'config.fish');

  const exportLine = shell.includes('fish')
    ? `set -x EVOLINK_API_KEY "${key}"`
    : `export EVOLINK_API_KEY="${key}"`;

  const addToRc = await ask(
    rl,
    `  Add to ${path.basename(rcFile)}? (Y/n): `
  );

  if (!addToRc.trim().toLowerCase().startsWith('n')) {
    try {
      fs.appendFileSync(rcFile, `\n# EvoLink API key (added by evolink-seedance-2-skill installer)\n${exportLine}\n`);
      console.log(green(`  ✓ Added to ${rcFile}`));
      console.log(dim(`    Run: source ${rcFile}  to activate in current shell`));
    } catch (err) {
      console.log(yellow(`  ⚠  Could not write to ${rcFile}: ${err.message}`));
      console.log(dim(`    Manually add: ${exportLine}`));
    }
  } else {
    console.log(dim(`  To activate later, run: ${exportLine}`));
  }
}

// ── Success summary ───────────────────────────────────────────────────────────
function printSuccess(installPath) {
  console.log('');
  console.log(bold(green('╔══════════════════════════════════════════════════════════╗')));
  console.log(bold(green('║') + '                                                          ' + bold(green('║'))));
  console.log(bold(green('║') + '   ' + bold('⚚  Seedance 2.0 skill installed successfully!') + '        ' + bold(green('║'))));
  console.log(bold(green('║') + '                                                          ' + bold(green('║'))));
  console.log(bold(green('╚══════════════════════════════════════════════════════════╝')));
  console.log('');
  console.log(bold('Installed to:'));
  console.log('  ' + cyan(installPath));
  console.log('');
  console.log(bold('Next steps:'));
  console.log('  1. ' + dim('Ensure EVOLINK_API_KEY is set in your environment'));
  console.log('     ' + dim('export EVOLINK_API_KEY=your_key  (or add to .zshrc/.bashrc)'));
  console.log('  2. ' + dim('Open OpenClaw and load the skill:'));
  console.log('     ' + cyan('seedance-2-video-gen'));
  console.log('  The skill is ready. Use this skill by asking your agent: "Generate a 4-second 480p product reveal video"');
  console.log('  Starter template 1 · estimated credits: about 11 on Mini · "Generate a 4-second 480p fixed-camera paper boat video with Mini"');
  console.log('  Starter template 2 · estimated credits: about 11 on Mini · "Generate a 4-second 480p fixed-camera product reveal with Mini"');
  console.log('  Observed Mini smoke usage on 2026-07-10: 10.23 credits. Returned usage/dashboard billing is authoritative.');
  console.log('  3. ' + dim('Start generating videos! Example:'));
  console.log('     ' + dim('"Generate a 5-second 720p video of a sunset over the ocean"'));
  console.log('');
  console.log(dim('  Docs:      https://github.com/Evolink-AI/seedance2-video-gen-skill-for-openclaw'));
  console.log(dim('  Dashboard: https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen'));
  console.log(dim('  Support:   https://evolink.ai'));
  console.log('');
}

// ── Parse --path argument ────────────────────────────────────────────────────
function getArgValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--version') || args.includes('-v')) {
    console.log('1.1.0');
    process.exit(0);
  }

  if (args.includes('--llms')) { printLlms(); process.exit(0); }

  if (args.includes('--skill')) { printSkill(); process.exit(0); }

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const silent = args.includes('--yes') || args.includes('-y');
  const targetPath = getArgValue(args, '--path');
  const noOpen = args.includes('--no-open');

  printBanner();

  if (silent) {
    // Non-interactive mode — no readline, no prompts
    try {
      const opts = { silent: true, targetPath, noOpen };
      const skillsDir = await detectSkillsDir(null, opts);
      const installPath = await copySkillFiles(skillsDir, null, opts);
      checkDependencies();

      // API key: just check and report, don't prompt
      if (process.env.EVOLINK_API_KEY) {
        console.log(bold('\n[4/4] EvoLink API key setup...'));
        console.log(green('  ✓ EVOLINK_API_KEY is set.'));
      } else {
        console.log(bold('\n[4/4] EvoLink API key setup...'));
        console.log(yellow('  ⚠  EVOLINK_API_KEY is not set.'));
  console.log('EVOLINK_KEY_URL=' + INSTALL_KEY_URL);
  console.log('AGENT_NEXT_ACTION=open_key_url_then_collect_key');
  if (opts.noOpen) { console.log('--no-open set: not opening a browser. Browser-free key setup.'); } else { console.log('Opening EVOLINK_KEY_URL in your browser...'); maybeOpenKeyUrl(INSTALL_KEY_URL, opts); }
  console.log('ENV_VAR_EXPORT=export EVOLINK_API_KEY=your_key_here');
        console.log(dim('    Get one at: https://evolink.ai/dashboard/keys?utm_source=skill&utm_medium=install&utm_campaign=seedance-2-video-gen'));
        console.log(dim('    Then run:   export EVOLINK_API_KEY=your_key'));
      }

      printSuccess(installPath);
    } catch (err) {
      console.error(red('\n  ✗ Installation failed: ') + err.message);
      process.exit(1);
    }
    return;
  }

  // Interactive mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Ensure readline closes cleanly on exit
  process.on('SIGINT', () => {
    console.log(yellow('\n\n  → Installation cancelled.'));
    rl.close();
    process.exit(1);
  });

  try {
    const opts = { silent: false, targetPath };
    const skillsDir = await detectSkillsDir(rl, opts);
    const installPath = await copySkillFiles(skillsDir, rl, opts);
    checkDependencies();
    await setupApiKey(rl, { noOpen });
    printSuccess(installPath);
  } catch (err) {
    console.error(red('\n  ✗ Installation failed: ') + err.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
