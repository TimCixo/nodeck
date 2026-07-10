import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Archive,
  GalleryVerticalEnd,
  Heart,
  Home,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import './index.css';

type RouteItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'core' | 'create';
};

type RouteDetail = {
  eyebrow: string;
  title: string;
  summary: string;
  items: string[];
};

const routes: RouteItem[] = [
  { path: '/gallery', label: 'Gallery', icon: GalleryVerticalEnd, group: 'core' },
  { path: '/favorites', label: 'Favorites', icon: Heart, group: 'core' },
  { path: '/cards', label: 'Cards', icon: Archive, group: 'core' },
  { path: '/decks', label: 'Decks', icon: Layers3, group: 'core' },
  { path: '/tags', label: 'Tags', icon: Tag, group: 'core' },
  { path: '/cards/new', label: 'Create Card', icon: Plus, group: 'create' },
  { path: '/decks/new', label: 'Create Deck', icon: Plus, group: 'create' },
];

const routeTitles = new Map<string, string>([
  ['/', 'Home'],
  ...routes.map((route) => [route.path, route.label] as const),
]);

const routeDetails = new Map<string, RouteDetail>([
  [
    '/',
    {
      eyebrow: 'Home',
      title: 'Nodeck',
      summary: 'Card-centered gallery navigation for visual objects, tags, and decks.',
      items: ['Browse saved cards', 'Open deck collections', 'Prepare new gallery entries'],
    },
  ],
  [
    '/gallery',
    {
      eyebrow: 'Gallery',
      title: 'Gallery',
      summary: 'The future browsing surface for saved visual objects.',
      items: ['Media grid placeholder', 'Card previews', 'Filter-ready layout'],
    },
  ],
  [
    '/favorites',
    {
      eyebrow: 'Favorites',
      title: 'Favorites',
      summary: 'A focused area for saved cards and decks.',
      items: ['Pinned cards', 'Saved decks', 'Quick return paths'],
    },
  ],
  [
    '/cards',
    {
      eyebrow: 'Cards',
      title: 'Cards',
      summary: 'Semi-technical card management placeholder.',
      items: ['Card records', 'Object metadata', 'Future import state'],
    },
  ],
  [
    '/decks',
    {
      eyebrow: 'Decks',
      title: 'Decks',
      summary: 'Semi-technical deck management placeholder.',
      items: ['Deck records', 'Card membership', 'Collection structure'],
    },
  ],
  [
    '/tags',
    {
      eyebrow: 'Tags',
      title: 'Tags',
      summary: 'The future index for visual grouping and discovery.',
      items: ['Tag cards', 'Related objects', 'Filter entry points'],
    },
  ],
  [
    '/cards/new',
    {
      eyebrow: 'Create',
      title: 'Create Card',
      summary: 'Reserved route for adding a new visual object card.',
      items: ['Card draft', 'Source details', 'Tag assignment'],
    },
  ],
  [
    '/decks/new',
    {
      eyebrow: 'Create',
      title: 'Create Deck',
      summary: 'Reserved route for assembling a new card collection.',
      items: ['Deck draft', 'Card selection', 'Collection metadata'],
    },
  ],
]);

function getCurrentPath() {
  return window.location.pathname || '/';
}

function App() {
  const [currentPath, setCurrentPath] = React.useState(getCurrentPath);

  React.useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    const target = event.currentTarget;
    const nextUrl = new URL(target.href);

    if (nextUrl.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();

    if (nextUrl.pathname !== currentPath) {
      window.history.pushState(null, '', nextUrl.pathname);
      setCurrentPath(nextUrl.pathname);
    }
  }, [currentPath]);

  const title = routeTitles.get(currentPath) ?? 'Not Found';
  const routeDetail = routeDetails.get(currentPath) ?? {
    eyebrow: 'Missing',
    title,
    summary: 'No matching Nodeck route exists for this URL.',
    items: ['Use the sidebar', 'Return home', 'Choose a known route'],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[17rem_1fr]">
        <aside className="border-sidebar-border bg-sidebar text-sidebar-foreground flex min-h-screen flex-col border-r">
          <a
            href="/"
            onClick={navigate}
            className="flex h-16 items-center gap-2 border-b px-5 text-base font-semibold"
            aria-current={currentPath === '/' ? 'page' : undefined}
          >
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-4" />
            </span>
            Nodeck
          </a>

          <nav className="flex flex-1 flex-col gap-6 px-3 py-4" aria-label="Primary navigation">
            <NavGroup
              label="Core"
              routes={routes.filter((route) => route.group === 'core')}
              currentPath={currentPath}
              onNavigate={navigate}
            />
            <NavGroup
              label="Create"
              routes={routes.filter((route) => route.group === 'create')}
              currentPath={currentPath}
              onNavigate={navigate}
            />
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="bg-background/95 sticky top-0 z-10 flex h-16 items-center border-b px-6 backdrop-blur">
            <div className="relative w-full max-w-xl">
              <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="search"
                aria-label="Global search"
                placeholder="Search Nodeck"
                className="pl-9"
              />
            </div>
          </header>

          <main className="min-w-0 flex-1 p-6">
            <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="outline">{routeDetail.eyebrow}</Badge>
                  <h1 className="mt-3 text-2xl font-semibold tracking-normal">
                    {routeDetail.title}
                  </h1>
                </div>
                {currentPath !== '/' ? (
                  <a
                    href="/"
                    onClick={navigate}
                    className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
                  >
                    <Home className="size-4" />
                    Home
                  </a>
                ) : null}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{routeDetail.summary}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  {routeDetail.items.map((item) => (
                    <div
                      key={item}
                      className="border-border bg-muted/30 rounded-lg border px-3 py-2 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavGroup({
  label,
  routes: groupRoutes,
  currentPath,
  onNavigate,
}: {
  label: string;
  routes: RouteItem[];
  currentPath: string;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase tracking-normal">
        {label}
      </div>
      {groupRoutes.map((route) => {
        const Icon = route.icon;
        const isActive = currentPath === route.path;

        return (
          <a
            key={route.path}
            href={route.path}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              buttonVariants({ variant: isActive ? 'secondary' : 'ghost' }),
              'h-9 justify-start gap-2 px-2 text-sidebar-foreground'
            )}
          >
            <Icon className="size-4" />
            {route.label}
          </a>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
