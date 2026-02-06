# Home Assistant Next.js Dashboard

A touch-friendly Home Assistant dashboard built with Next.js, featuring real-time WebSocket connectivity, room-based navigation, entity cards, pull-to-reveal panels, an idle screensaver, and a responsive mobile/desktop layout.

## Screenshots

### Desktop

![Desktop screenshot](public/screenshots/desktop.png)

### Mobile

<p align="center">
  <img src="public/screenshots/mobile.png" alt="Mobile screenshot" width="390" />
</p>

## Getting Started

### Prerequisites

- Node.js 18+
- A running Home Assistant instance
- A Home Assistant Long-Lived Access Token

### Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. On first launch you'll see a setup screen asking for your **Home Assistant URL** and a **Long-Lived Access Token**. These are saved in your browser's localStorage — no server-side config needed.

To generate a Long-Lived Access Token, open your Home Assistant instance and go to **Profile → Security → Long-Lived Access Tokens**.

To reset stored credentials, scroll to the **Debug** section on the dashboard and tap **Clear credentials**.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
