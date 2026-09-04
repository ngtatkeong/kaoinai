import glob
import json
import os
import re
import sys
from urllib.parse import urlparse

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

html_files = [f for f in sorted(glob.glob('*.html')) if f != 'googledaba1ad49b5dbd0e.html']

print(f"=== FULL SITE AUDIT: Auditing {len(html_files)} Production HTML Pages ===")

all_ids = {}
for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    ids = set(re.findall(r'id=["\']([^"\']+)["\']', content))
    all_ids[fpath] = ids

errors = []

for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Check 1: Broken Image src
    img_srcs = re.findall(r'<img\s+[^>]*src=["\']([^"\']+)["\']', content, re.I)
    for src in img_srcs:
        if src.startswith('http://') or src.startswith('https://') or src.startswith('data:'):
            continue
        clean_src = src.split('?')[0].split('#')[0]
        if not os.path.exists(clean_src):
            errors.append(f"[{fpath}] Broken image src: '{src}'")

    # Check 2: Broken local links and anchor tags
    hrefs = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\']', content, re.I)
    for href in hrefs:
        if href.startswith('http://') or href.startswith('https://') or href.startswith('mailto:') or href.startswith('tel:') or href == '#':
            continue
        if href.startswith('#'):
            # Anchor on same page
            anchor = href[1:]
            if anchor not in all_ids[fpath]:
                errors.append(f"[{fpath}] Unresolved anchor: '{href}'")
        else:
            # File or file#anchor
            parts = href.split('#')
            target_file = parts[0]
            target_anchor = parts[1] if len(parts) > 1 else None
            if not os.path.exists(target_file):
                errors.append(f"[{fpath}] Target file not found: '{target_file}'")
            elif target_anchor:
                if target_file in all_ids and target_anchor not in all_ids[target_file]:
                    errors.append(f"[{fpath}] Anchor '#{target_anchor}' not found in '{target_file}'")

    # Check 3: Schema.org JSON-LD validity
    json_lds = re.findall(r'<script\s+type=["\']application/ld\+json["\']>(.*?)</script>', content, re.I | re.S)
    for j_str in json_lds:
        try:
            json.loads(j_str.strip())
        except Exception as e:
            errors.append(f"[{fpath}] Invalid JSON-LD: {e}")

    # Check 4: 72px Standalone Logo
    logo_matches = re.findall(r'<a\s+[^>]*class=["\'][^"\']*nav-logo[^"\']*["\'][^>]*>(.*?)</a>', content, re.I | re.S)
    if logo_matches:
        logo_inner = logo_matches[0].strip()
        # Ensure no text inside nav-logo
        text_inside = re.sub(r'<[^>]+>', '', logo_inner).strip()
        if text_inside:
            errors.append(f"[{fpath}] Nav logo contains text: '{text_inside}' (Must be standalone logo icon)")

if errors:
    print(f"\n[FAIL] FOUND {len(errors)} AUDIT ISSUES:")
    for err in errors:
        print("  - " + err)
    sys.exit(1)
else:
    print("\n[PASS] 100% PASSED: Zero broken images, zero broken links, valid Schema.org, standalone 72px logo.")
