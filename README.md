# Watch

Watch is a modern, immersive video feed app, built with Next.js inside the world App. The app integrates World ID verification using MiniKit, features a full-screen, snap-scrolling video feed with variable rewards per video, and a profile page that shows user metrics and an interactive earnings graph.

## Features

- **World ID Verification:**
  Users must verify their identity with World ID before accessing the video feed.

- **Immersive Video Feed:**
  Full-screen videos with snap-scrolling behavior. Each video has its own custom reward, which users can claim after watching.

- **Interactive Profile Page:**
  View your total earnings, videos watched, rewards claimed, and an interactive graph of earnings per video.

- **Modern UI:**
  Sleek, futuristic design with a gradient background and animated elements.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [WorldCoin MiniKit](https://worldcoin.org/) (for World ID integration)
- [Chart.js](https://www.chartjs.org/) and [react-chartjs-2](https://react-chartjs-2.js.org/) for charts
- [SQLite](https://www.sqlite.org/index.html) for database storage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/watchworld.git
   cd watchworld

### Configure Environment
Update miniKit.config.js with your WorldCoin Developer Portal app ID and other configuration options.
Ensure your SQLite database (db.sqlite) is present at the specified path in lib/db.ts (or adjust the path as needed).
Setup Tailwind CSS
Tailwind CSS is configured in styles/globals.css. Verify that you have the necessary PostCSS configuration if you plan to customize further.

## Running the App
Start the development server with:
    ```bash
    npm run dev
    or
    yarn dev

Open http://localhost:3000 in your browser to view the app.


## Building for Production
To build and start the project for production:
    ```bash
    npm run build
    npm start
    or
    yarn build
    yarn start

## API Endpoints
/api/verify-signin:
Verifies World ID and sets a user cookie upon successful sign-in.

/api/verify-action:
Processes a video reward claim. Accepts the video ID and a custom reward amount.

/api/get-earnings:
Retrieves the total earnings for the authenticated user.

/api/get-user-actions:
Returns a list of claimed rewards/actions for the authenticated user.

## Contributing
Contributions are welcome. Please fork the repository and submit a pull request with your improvements. For major changes, open an issue first to discuss what you would like to change.

## License
© 2025 Maroua BOUDOUKHA. All Rights Reserved.
