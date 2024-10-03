# Notifications Writer

Notifications Writer is a Next.js application designed to help generate in-app notification copy using AI. It provides an intuitive chat interface for users to interact with an AI assistant specialized in creating concise, engaging, and relevant notification messages for various app events and user interactions.

## Features

- AI-powered chat interface for generating notification copy
- Responsive design with a collapsible sidebar for mobile devices
- Audience dimension inputs for tailored notification content
- Real-time chat with message history
- Built with Next.js and React
- Styled using Tailwind CSS and custom UI components

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI components
- AI SDK for OpenAI integration

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/notifications-writer.git
   cd notifications-writer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Contains the main application pages and layout
- `components/`: Reusable React components
- `lib/`: Utility functions and helpers
- `public/`: Static assets
- `styles/`: Global CSS styles

## Key Components

- `ChatInterface`: The main component that handles the chat functionality and UI
- `SimpleCard`: A reusable card component for displaying information
- Custom UI components: Button, Input, Textarea, Avatar, ScrollArea, and Label

## API Routes

The project includes an API route for handling chat requests:
