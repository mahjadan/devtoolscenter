#!/bin/bash

# ========================================
# Blog Article Template - Merge to Main Script
# ========================================

echo "🚀 Starting merge process for Blog Article Template Enhancement"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Main project directory
MAIN_PROJECT="/home/MOHAMOUD.ALJADAN/projects/rd/devtoolscenter"
FEATURE_BRANCH="feat-single-article-page-y1X0J"

echo -e "${BLUE}📍 Main Project: ${NC}$MAIN_PROJECT"
echo -e "${BLUE}📍 Feature Branch: ${NC}$FEATURE_BRANCH"
echo ""

# Check if main project directory exists
if [ ! -d "$MAIN_PROJECT" ]; then
    echo -e "${RED}❌ Error: Main project directory not found!${NC}"
    echo "Expected: $MAIN_PROJECT"
    exit 1
fi

# Navigate to main project
echo -e "${YELLOW}➡️  Navigating to main project...${NC}"
cd "$MAIN_PROJECT" || exit 1

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Current branch: ${NC}$CURRENT_BRANCH"
echo ""

# Checkout main branch
echo -e "${YELLOW}➡️  Checking out main branch...${NC}"
git checkout main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to checkout main branch${NC}"
    exit 1
fi

echo -e "${GREEN}✅ On main branch${NC}"
echo ""

# Pull latest changes
echo -e "${YELLOW}➡️  Pulling latest changes from origin...${NC}"
git pull origin main

echo ""

# Show current status
echo -e "${BLUE}📊 Current git status:${NC}"
git status
echo ""

# Ask for confirmation
echo -e "${YELLOW}⚠️  Ready to merge '$FEATURE_BRANCH' into 'main'${NC}"
echo -e "${YELLOW}This will merge 5 files with blog template enhancements${NC}"
echo ""
read -p "Do you want to proceed with the merge? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Merge cancelled${NC}"
    exit 1
fi

# Perform the merge
echo ""
echo -e "${YELLOW}➡️  Merging $FEATURE_BRANCH into main...${NC}"
git merge "$FEATURE_BRANCH" --no-ff -m "Merge feat: professional blog article template

- Enhanced blog layout with gradient headers
- Professional code blocks with syntax highlighting
- Stunning gradient CTA sections
- Dark/light theme improvements
- Standalone template files
- Comprehensive documentation"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Merge failed! Please resolve conflicts manually.${NC}"
    echo ""
    echo "To resolve conflicts:"
    echo "  1. Check conflicting files: git status"
    echo "  2. Edit and resolve conflicts"
    echo "  3. Stage resolved files: git add <files>"
    echo "  4. Complete merge: git commit"
    exit 1
fi

echo -e "${GREEN}✅ Merge successful!${NC}"
echo ""

# Show merge commit
echo -e "${BLUE}📝 Merge commit:${NC}"
git log -1 --oneline
echo ""

# Show changed files
echo -e "${BLUE}📁 Files changed:${NC}"
git diff --name-status HEAD~1
echo ""

# Ask if user wants to push
echo -e "${YELLOW}⚠️  Merge complete locally. Ready to push to origin?${NC}"
read -p "Push to origin/main? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}➡️  Pushing to origin/main...${NC}"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully pushed to origin!${NC}"
    else
        echo -e "${RED}❌ Push failed. You can push manually later with: git push origin main${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  Skipped push. You can push later with: git push origin main${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Merge process complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "  1. Test the changes: npm run dev"
echo "  2. Visit: http://localhost:8080/blog/jwt-tokens-explained/"
echo "  3. Verify gradient headers, code blocks, and CTA sections"
echo "  4. Test dark/light theme toggle"
echo "  5. Check responsive design"
echo ""
echo -e "${BLUE}🧹 Cleanup (optional):${NC}"
echo "  - Remove feature branch: git branch -d $FEATURE_BRANCH"
echo "  - Remove worktree: git worktree remove /home/MOHAMOUD.ALJADAN/.cursor/worktrees/devtoolscenter/y1X0J"
echo ""
echo -e "${GREEN}✨ Your blog now has a professional, modern design!${NC}"

