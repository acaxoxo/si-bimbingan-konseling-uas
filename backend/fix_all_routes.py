import os
import re

routes_dir = "routes"

# Pattern to match and fix
fixes = [
    # Fix closing JSON with quote-semicolon -> semicolon-paren
    (r'\}\s*"\s*;', r'});'),
    # Fix router method calls with )/path to "/path
    (r'router\.(get|post|put|patch|delete)\s*\(\s*\)', r'router.\1("/"'),
    (r'router\.(get|post|put|patch|delete)\s*\(\s*\)\s*/([^"]+)"', r'router.\1("/\2"'),
    # Fix next(" to next()
    (r'next\s*\(\s*"', r'next()'),
    # Fix Controller"; to Controller);
    (r'(\w+Controller\.\w+)\s*"\s*;', r'\1);'),
    # Fix validate"; to validate);
    (r'validate\s*"\s*;', r'validate);'),
    # Remove extra quotes around paths in router methods
    (r'router\.(use|get|post|put|patch|delete)\s*\(\s*"([^"]+)"\s*"\s*,', r'router.\1("\2",'),
]

for filename in os.listdir(routes_dir):
    if not filename.endswith(".js"):
        continue
    
    filepath = os.path.join(routes_dir, filename)
    print(f"Fixing {filename}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply all fixes
    for pattern, replacement in fixes:
        content = re.sub(pattern, replacement, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("\n✅ All routes fixed!")
