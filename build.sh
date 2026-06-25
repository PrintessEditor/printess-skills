#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST="$SCRIPT_DIR/dist"
RESOURCES_JSON="$SCRIPT_DIR/resources.json"

rm -rf "$DIST"

python3 - "$SCRIPT_DIR" "$DIST" "$RESOURCES_JSON" <<'EOF'
import json, os, shutil, sys

src, dist, res_json = sys.argv[1], sys.argv[2], sys.argv[3]

with open(res_json) as f:
    data = json.load(f)

for skill in data["skills"]:
    name = skill["name"]
    skill_dir = os.path.join(src, name)
    if not os.path.isfile(os.path.join(skill_dir, "SKILL.md")):
        continue

    out = os.path.join(dist, name)
    os.makedirs(out, exist_ok=True)
    shutil.copy(os.path.join(skill_dir, "SKILL.md"), os.path.join(out, "SKILL.md"))

    resources = skill.get("resources", [])
    if resources:
        res_out = os.path.join(out, "resources")
        os.makedirs(res_out, exist_ok=True)
        for file in resources:
            shutil.copy(os.path.join(src, "resources", file), os.path.join(res_out, file))

import zipfile

zip_path = os.path.join(dist, "printess-integration-skills.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(dist):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, dist)
            if arcname == "printess-integration-skills.zip":
                continue
            zf.write(full_path, arcname)
EOF
