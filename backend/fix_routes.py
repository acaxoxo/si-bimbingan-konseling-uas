import os
import re

routes_dir = "routes"

for filename in os.listdir(routes_dir):
    if not filename.endswith(".js"):
        continue
    
    filepath = os.path.join(routes_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix common issues
    content = re.sub(r'from \("\.\./', r'from "../', content)
    content = re.sub(r'from "\.\.\.\./', r'from "../', content)
    content = re.sub(r'"";', r'.js";', content)
    content = re.sub(r'validationResult\(req"', r'validationResult(req)', content)
    content = re.sub(r'\)"\s*;', r');', content)
    content = re.sub(r'next\("', r'next()', content)
    content = re.sub(r'router\.(use|get|post|put|patch|delete)\("([^"]+)"', r'router.\1("\2)', content)
    content = re.sub(r'router\.(use|get|post|put|patch|delete)\("', r'router.\1(', content)
    content = re.sub(r', (\w+Controller\.\w+|getAllAdmin|getAdminById|createAdmin|updateAdmin|deleteAdmin|getAllGuru|getGuruById|createGuru|updateGuru|deleteGuru)"', r', \1)', content)
    content = re.sub(r'authorizeRoles\("admin"\)"', r'authorizeRoles("admin")', content)
    content = re.sub(r'router\.use\("verifyToken\)', r'router.use(verifyToken)', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed {filename}")

print("Done!")
