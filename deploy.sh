#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST="$SCRIPT_DIR/dist"

if [[ ! -d "$DIST" ]]; then
  echo "dist/ not found — run build.sh first" >&2
  exit 1
fi

python3 - "$DIST" <<'EOF'
import os, subprocess, sys

dist = sys.argv[1]

for skill_name in sorted(os.listdir(dist)):
    skill_dir = os.path.join(dist, skill_name)
    skill_md = os.path.join(skill_dir, "SKILL.md")

    if not os.path.isfile(skill_md):
        continue

    # Extract name from YAML frontmatter
    display_title = skill_name
    with open(skill_md) as f:
        lines = f.readlines()
    if lines and lines[0].strip() == "---":
        for line in lines[1:]:
            if line.strip() == "---":
                break
            if line.startswith("name:"):
                display_title = line.split(":", 1)[1].strip().strip('"\'')
                break

    # Collect files: SKILL.md first, then resources/*
    files = [os.path.join(skill_name, "SKILL.md")]
    res_dir = os.path.join(skill_dir, "resources")
    if os.path.isdir(res_dir):
        for f in sorted(os.listdir(res_dir)):
            files.append(os.path.join(skill_name, "resources", f))

    cmd = ["ant", "beta:skills", "create",
           "--display-title", display_title]
    for f in files:
        cmd += ["--file", f]
    cmd += ["--beta", "skills-2025-10-02"]

    print(f"Deploying: {skill_name}")
    subprocess.run(cmd, cwd=dist, check=True)
EOF
