# **TaskFlow Manager** 🤖

**An intelligent productivity suite combining task management, expense tracking, and AI-powered insights in one beautiful interface.**

## ✨ **Features**

### 🤖 **AI-Powered Intelligence**

- **Smart Task Creation**: Convert natural language into structured tasks
- **Auto-Categorization**: AI suggests expense categories in real-time
- **Priority Suggestions**: Get smart priority and due date recommendations
- **Privacy-First**: Sensitive data redaction before AI processing
- **Rule-based Fallbacks**: Works offline without external APIs

### 🎨 **Beautiful Dark/Light Theme**

- **System Detection**: Automatically matches OS theme
- **Smooth Transitions**: Fluid theme switching animations
- **Accessibility**: WCAG-compliant contrast ratios
- **Persistent**: Remembers your theme preference

### 📊 **Productivity Dashboard**

- **Real-time Analytics**: Track tasks, expenses, and productivity
- **AI Insights**: Personalized suggestions based on your data
- **Progress Tracking**: Visual completion metrics
- **Financial Overview**: Income vs expense breakdown

### ⌨️ **Power User Features**

- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + K` - Quick add task
  - `Ctrl/Cmd + Shift + D` - Toggle dark mode
  - `Ctrl/Cmd + /` - Focus search
  - `Ctrl/Cmd + E` - Export data
  - `Escape` - Close modals
- **CSV Export**: Export tasks and expenses for reporting
- **Skeleton Loaders**: Smooth loading experience

### 📱 **Responsive Design**

- **Mobile-First**: Fully responsive on all devices
- **Touch-Friendly**: Optimized for mobile interactions
- **PWA Ready**: Install as standalone app

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 16+
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone repo-url
cd taskflow-manager

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🛠️ **Tech Stack**

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: React Context + Local Storage
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## 📁 **Project Structure**

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── todo/           # Todo management components
│   ├── expenses/       # Expense tracking components
│   ├── dashboard/      # Dashboard and analytics
│   └── layout/         # Layout components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript definitions
└── styles/            # Global styles
```

## 🤝 **Contributing**

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain accessibility standards (WCAG 2.1)
- Write meaningful commit messages
- Add tests for new features

## 🙏 **Acknowledgments**

- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Create React App](https://create-react-app.dev/) for project scaffolding
- [date-fns](https://date-fns.org/) for date manipulation

---

**Built with ❤️ by Aniket**

_"Organize your day, track your expenses, achieve your goals with AI assistance"_

---
