This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
fahrzeug3
├─ app
│  ├─ api
│  │  └─ auth
│  │     └─ [...nextauth]
│  │        └─ route.ts
│  ├─ ClientIndex.tsx
│  ├─ ClientWrapper.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ katalog
│  │  ├─ page.tsx
│  │  └─ [id]
│  │     └─ page.tsx
│  ├─ konfigurator
│  │  ├─ page.tsx
│  │  └─ [id]
│  │     └─ page.tsx
│  ├─ layout.tsx
│  ├─ login
│  │  └─ page.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx
│  ├─ registrieren
│  │  └─ page.tsx
│  └─ verwaltung
│     └─ page.tsx
├─ components
│  ├─ auth-provider.tsx
│  ├─ FahrzeugCard.tsx
│  ├─ KonfigurationsUebersicht.tsx
│  ├─ konfigurator
│  │  ├─ AusstattungTab.tsx
│  │  ├─ FahrzeugTab.tsx
│  │  ├─ FarbeTab.tsx
│  │  ├─ FelgenTab.tsx
│  │  ├─ KonfiguratorTabs.tsx
│  │  ├─ MotorTab.tsx
│  │  ├─ NavigationButtons.tsx
│  │  └─ ZusammenfassungTab.tsx
│  ├─ Layout.tsx
│  ├─ login-form.tsx
│  ├─ Navigation.tsx
│  ├─ register-form.tsx
│  ├─ ui
│  │  ├─ accordion.tsx
│  │  ├─ alert-dialog.tsx
│  │  ├─ alert.tsx
│  │  ├─ aspect-ratio.tsx
│  │  ├─ avatar.tsx
│  │  ├─ badge.tsx
│  │  ├─ breadcrumb.tsx
│  │  ├─ button.tsx
│  │  ├─ calendar.tsx
│  │  ├─ card.tsx
│  │  ├─ carousel.tsx
│  │  ├─ chart.tsx
│  │  ├─ checkbox.tsx
│  │  ├─ collapsible.tsx
│  │  ├─ command.tsx
│  │  ├─ context-menu.tsx
│  │  ├─ dialog.tsx
│  │  ├─ drawer.tsx
│  │  ├─ dropdown-menu.tsx
│  │  ├─ form.tsx
│  │  ├─ hover-card.tsx
│  │  ├─ input-otp.tsx
│  │  ├─ input.tsx
│  │  ├─ label.tsx
│  │  ├─ menubar.tsx
│  │  ├─ navigation-menu.tsx
│  │  ├─ pagination.tsx
│  │  ├─ popover.tsx
│  │  ├─ progress.tsx
│  │  ├─ radio-group.tsx
│  │  ├─ resizable.tsx
│  │  ├─ scroll-area.tsx
│  │  ├─ select.tsx
│  │  ├─ separator.tsx
│  │  ├─ sheet.tsx
│  │  ├─ sidebar.tsx
│  │  ├─ skeleton.tsx
│  │  ├─ slider.tsx
│  │  ├─ sonner.tsx
│  │  ├─ switch.tsx
│  │  ├─ table.tsx
│  │  ├─ tabs.tsx
│  │  ├─ textarea.tsx
│  │  ├─ toast.tsx
│  │  ├─ toaster.tsx
│  │  ├─ toggle-group.tsx
│  │  ├─ toggle.tsx
│  │  ├─ tooltip.tsx
│  │  └─ use-toast.ts
│  └─ verwaltung
│     ├─ BestellungsList.tsx
│     └─ KonfigurationsList.tsx
├─ components.json
├─ context
│  ├─ AppContext.tsx
│  ├─ types.ts
│  ├─ useKonfiguration.ts
│  ├─ useToast.ts
│  └─ utils.ts
├─ data
│  └─ mockData.ts
├─ eslint.config.mjs
├─ hooks
│  ├─ use-mobile.tsx
│  └─ use-toast.ts
├─ lib
│  ├─ auth.ts
│  ├─ prisma.ts
│  └─ utils.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  └─ schema.prisma
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ tailwind.config.ts
├─ tsconfig.json
└─ types
   └─ models.ts

```