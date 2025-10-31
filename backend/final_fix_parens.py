import os
import re

routes_dir = "routes"

for filename in os.listdir(routes_dir):
    if not filename.endswith(".js"):
        continue
    
    filepath = os.path.join(routes_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix router.get("/")) to router.get("/",
    content = re.sub(r'router\.(get|post|put|patch|delete)\("([^"]*)"\)\)', r'router.\1("\2",', content)
    
    # Fix endings like getAllKelas"; to getAllKelas);
    content = re.sub(r'([a-zA-Z][a-zA-Z0-9_]*)";\s*$', r'\1);', content, flags=re.MULTILINE)
    content = re.sub(r'([a-zA-Z][a-zA-Z0-9_]*)"\s*$', r'\1);', content, flags=re.MULTILINE)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filename}")

print("\n🎉 Complete!")
