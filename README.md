<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Nucleus Wizard App

This is a React + TypeScript application built with Vite that uses the Gemini AI API.

View your app in AI Studio: https://ai.studio/apps/drive/1kGV4ivQ0YNTQIUmhoHtZ3ZiBvaeonjAP

## 🚀 Live Demo

The app is deployed on GitHub Pages: https://rivohenfri.github.io/nucleuswizard-app/

## 🏃‍♂️ Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. Clone the repository:
   ```bash
   git clone https://github.com/RivoHenfri/nucleuswizard-app.git
   cd nucleuswizard-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Set your `GEMINI_API_KEY` in `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🚢 Deploy to GitHub Pages

### Method 1: Manual Deployment
```bash
npm run deploy
```

### Method 2: Automatic Deployment (Recommended)
The app automatically deploys to GitHub Pages when you push to the `main` branch using GitHub Actions.

**Setup Steps:**
1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a new repository secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Push your changes to the `main` branch
5. The deployment will happen automatically via GitHub Actions

## 📁 Project Structure

```
nucleuswizard-app/
├── components/          # React components
├── .github/workflows/   # GitHub Actions workflows
├── dist/               # Build output (auto-generated)
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
