<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🧙‍♂️ NucleusWizard App - Awakening the Inner Wizard

This contains everything you need to run your app locally and deploy to GitHub Pages.

🌐 **Live Demo**: https://rivohenfri.github.io/nucleuswizard-app/

View your app in AI Studio: https://ai.studio/apps/drive/1kGV4ivQ0YNTQIUmhoHtZ3ZiBvaeonjAP

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## 🌐 Deploy to GitHub Pages

This app is automatically deployed to GitHub Pages using GitHub Actions:

1. **Push changes** to the `main` branch
2. **GitHub Actions** will automatically build and deploy
3. **Live site** will be available at: https://rivohenfri.github.io/nucleuswizard-app/

### Environment Setup
- Add `GEMINI_API_KEY` as a repository secret in GitHub Settings
- GitHub Pages source is set to "GitHub Actions"

## 🛠️ Tech Stack
- **React** with **TypeScript**
- **Vite** for build tooling
- **Google Gemini AI** for wizard experience
- **GitHub Pages** for hosting
- **GitHub Actions** for CI/CD

---
*Last updated: October 23, 2025*
