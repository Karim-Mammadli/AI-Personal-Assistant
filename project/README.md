# AI Personal Assistant

A modern, intelligent personal assistant built with Next.js, TypeScript, and Tailwind CSS. Features a beautiful chat interface with file upload capabilities, theme switching, and responsive design. (same as any other LLM but with lot of catches)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Karim-Mammadli/AI-Personal-Assistant.git
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) - Perfect dark mode
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## 📁 Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── chat/             # Chat-related components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── settings/         # Settings components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 Components

### Chat Interface
- **ChatInterface** - Main chat container with message list and input
- **MessageBubble** - Individual message display with user/AI distinction
- **MessageInput** - Text input with send button and file upload
- **FileUpload** - Drag and drop file upload component
- **TypingIndicator** - Animated typing indicator for AI responses

### Layout
- **Header** - Navigation and theme toggle
- **Sidebar** - Chat sessions and settings navigation
- **ThemeProvider** - Dark/light theme management

### Settings
- **SettingsDialog** - Main settings modal
- **ApiKeysTab** - API key management interface

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom API endpoint
OPENAI_API_BASE_URL=https://api.openai.com/v1

# Optional: Model configuration
OPENAI_MODEL=gpt-3.5-turbo
```

### Next.js Configuration

The project uses static export configuration in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
```

**Made by [Karim Mammadli](https://github.com/Karim-Mammadli) && Made by [Kipling Liu](https://github.com/kiplingliu)** 
