# Sprint 6: Build, Test, Publish

## Goal
Ensure everything compiles, bump version, commit, push, and publish to npm.

## Steps

### 1. Bump Version
- Edit `package.json`: change `"version": "0.1.1"` → `"version": "0.2.0"`

### 2. Build
- Run `npm run build`
- Must compile with ZERO TypeScript errors
- If errors occur, fix them in the relevant files

### 3. Verify Output
- Check that `dist/` contains compiled output for all resources
- Verify removed operations (echo, getUploadLimits, getCourseHistory, library) are gone
- Verify new resources (gradebook, item, submission) are present

### 4. Commit
- Stage all changes (new files, modified files, deleted Library file)
- Commit with message: "v0.2.0: Complete redesign based on official API docs"

### 5. Push
- Push to branch `claude/agilix-buzz-custom-nodes-VXFHY`
- `git push -u origin claude/agilix-buzz-custom-nodes-VXFHY`

### 6. Publish
- Run `npm publish`
- Verify v0.2.0 is published

## Verification Checklist
- [ ] `npm run build` → zero errors
- [ ] Version is 0.2.0 in package.json
- [ ] All git changes committed
- [ ] Pushed to correct branch
- [ ] Published to npm as v0.2.0
