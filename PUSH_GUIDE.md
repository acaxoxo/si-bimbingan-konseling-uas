# 📤 Git Push Guide - SI Bimbingan Konseling

## 🎯 Quick Push (Recommended)

### Step 1: Check Status
```bash
git status
```
Ini akan menampilkan semua file yang berubah.

### Step 2: Add All Changes
```bash
git add .
```
Atau add file spesifik:
```bash
git add frontend/src/pages/Login.jsx
git add DEBUGGING_SUMMARY.md
```

### Step 3: Commit Changes
```bash
git commit -m "fix: resolve login form reload issue and cleanup

- Fixed page reload when pressing Enter with wrong credentials
- Implemented triple-layer event protection (Native DOM + React Capture)
- Fixed loading spinner not stopping on error
- Fixed data fetching errors (filter is not a function)
- Removed debugging console.logs
- Added proper form attributes (id, name, htmlFor)
- Ready for production deployment"
```

### Step 4: Push to Repository
```bash
git push origin main
```
Atau jika branch berbeda:
```bash
git push origin master
```

---

## 📝 Detailed Steps (First Time Push)

### 1. Initialize Git (Jika Belum)
```bash
cd c:/CANTIKA/REACT/si-bimbingan-konseling
git init
```

### 2. Add Remote Repository (Jika Belum)
```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

Atau untuk GitLab:
```bash
git remote add origin https://gitlab.com/USERNAME/REPO_NAME.git
```

### 3. Check Remote
```bash
git remote -v
```

### 4. Pull Latest Changes (Jika Ada)
```bash
git pull origin main --rebase
```

### 5. Add Files
```bash
git add .
```

### 6. Commit
```bash
git commit -m "fix: major bug fixes and improvements"
```

### 7. Push
```bash
git push -u origin main
```

---

## 🔍 Before Push Checklist

- [ ] **Test Manual:**
  - [ ] Login dengan credential benar
  - [ ] Login dengan credential salah
  - [ ] Tekan Enter di form
  - [ ] Test loading spinner
  - [ ] Test error messages

- [ ] **Code Quality:**
  - [ ] No console.logs (debugging)
  - [ ] Build successful (`npm run build`)
  - [ ] No compile errors
  - [ ] No lint warnings (critical)

- [ ] **Environment:**
  - [ ] `.env` file NOT committed (should be in .gitignore)
  - [ ] `node_modules/` NOT committed (should be in .gitignore)
  - [ ] `dist/` or `build/` NOT committed (optional)

- [ ] **Documentation:**
  - [ ] README.md updated
  - [ ] DEBUGGING_SUMMARY.md created
  - [ ] API endpoints documented

---

## 🚨 Common Issues & Solutions

### Issue 1: "Permission Denied (publickey)"
**Solution:**
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

# Copy public key and add to GitHub/GitLab
cat ~/.ssh/id_rsa.pub
```

### Issue 2: "Updates were rejected"
**Solution:**
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Issue 3: "Failed to push some refs"
**Solution:**
```bash
# Force push (HATI-HATI!)
git push origin main --force
```

### Issue 4: Merge Conflicts
**Solution:**
```bash
# Check conflicted files
git status

# Edit files manually, then:
git add .
git rebase --continue
git push origin main
```

---

## 📦 What Files Will Be Pushed?

### Modified Files:
```
frontend/src/pages/Login.jsx
frontend/src/pages/guru/LaporanGuru.jsx
frontend/src/pages/siswa/DataGuruSiswa.jsx
frontend/src/pages/orangTua/DataGuruOrangTua.jsx
frontend/src/index.css
README.md
frontend/README.md
DEBUGGING_SUMMARY.md
PUSH_GUIDE.md (this file)
```

### Files That Should NOT Be Pushed:
```
.env
.env.local
.env.production
node_modules/
dist/
build/
.DS_Store
*.log
.vscode/ (optional)
```

---

## 🔐 .gitignore Template

Pastikan file `.gitignore` ada dan berisi:

```gitignore
# Dependencies
node_modules/
package-lock.json (optional)

# Build
dist/
build/
.cache/

# Environment
.env
.env.local
.env.development
.env.production
.env.test

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Database
*.sqlite
*.db

# Uploads (if any)
uploads/
public/uploads/
```

---

## 🌿 Branch Strategy (Optional)

### Create Feature Branch:
```bash
# Create and switch to new branch
git checkout -b feature/login-fix

# Make changes, then commit
git add .
git commit -m "fix: login form issues"

# Push to feature branch
git push origin feature/login-fix

# Merge to main (on GitHub/GitLab)
# Create Pull Request / Merge Request
```

### Switch Between Branches:
```bash
# List all branches
git branch -a

# Switch to branch
git checkout main
git checkout feature/login-fix

# Delete branch (after merge)
git branch -d feature/login-fix
```

---

## 📊 Git Commands Reference

### Basic Commands:
```bash
git status              # Check status
git add .               # Add all files
git add <file>          # Add specific file
git commit -m "msg"     # Commit with message
git push                # Push to remote
git pull                # Pull from remote
git log                 # View commit history
git log --oneline       # Compact history
```

### Undo Commands:
```bash
git reset HEAD~1        # Undo last commit (keep changes)
git reset --hard HEAD~1 # Undo last commit (discard changes)
git checkout -- <file>  # Discard changes in file
git clean -fd           # Remove untracked files
```

### Stash Commands:
```bash
git stash               # Save changes temporarily
git stash list          # List stashes
git stash apply         # Apply latest stash
git stash pop           # Apply and remove stash
git stash drop          # Remove latest stash
```

---

## 🎯 Recommended Commit Message Format

### Format:
```
<type>: <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples:
```bash
git commit -m "feat: add dark mode toggle to all pages"
git commit -m "fix: resolve login form reload on Enter key press"
git commit -m "docs: update README with new features"
git commit -m "refactor: extract validation logic to utils"
```

---

## 🚀 After Push

### Verify Push:
1. Go to GitHub/GitLab repository
2. Check if files are updated
3. Verify latest commit message
4. Check commit history

### Create Release Tag (Optional):
```bash
# Create tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag
git push origin v1.0.0

# List tags
git tag -l
```

### Deploy to Production:
```bash
# SSH to production server
ssh user@your-server.com

# Pull latest changes
cd /path/to/project
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart server (if needed)
pm2 restart app
```

---

## 📞 Need Help?

### Check Git Version:
```bash
git --version
```

### Configure Git (First Time):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### View Git Config:
```bash
git config --list
```

### Git Documentation:
- https://git-scm.com/doc
- https://guides.github.com/
- https://docs.gitlab.com/

---

## ✅ Final Checklist

Before pushing, make sure:
- [x] All changes tested manually
- [x] Build successful
- [x] No sensitive data (passwords, API keys) in code
- [x] .gitignore configured properly
- [x] Commit message clear and descriptive
- [x] Remote repository set up correctly

**Ready to push? Run:**
```bash
git add .
git commit -m "fix: resolve login form reload issue and cleanup"
git push origin main
```

🎉 **Good luck with your push!**
