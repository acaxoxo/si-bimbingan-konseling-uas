import os
import re

routes_dir = "routes"

for filename in os.listdir(routes_dir):
    if not filename.endswith(".js"):
        continue
    
    filepath = os.path.join(routes_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix router.get(/) to router.get("/")
    content = re.sub(r'router\.(get|post|put|patch|delete|use)\(/\)', r'router.\1("/")', content)
    
    # Fix router.get(/path) to router.get("/path")
    content = re.sub(r'router\.(get|post|put|patch|delete)\(/([^)]+)\)', r'router.\1("/\2")', content)
    
    # Fix double quotes like router.get("/"/path to router.get("/path"
    content = re.sub(r'router\.(get|post|put|patch|delete)\("/"\s*/([^"]+)"', r'router.\1("/\2"', content)
    
    # Fix ending like getAllKelas"; to getAllKelas);
    content = re.sub(r', ([a-zA-Z][a-zA-Z0-9_]*)";\s*$', r', \1);', content, flags=re.MULTILINE)
    
    # Fix other patterns
    content = re.sub(r'\)"\s*;', r');', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filename}")

print("\n🎉 All routes fixed!")
