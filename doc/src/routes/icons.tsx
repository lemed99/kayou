import {
  Component,
  For,
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';

import { Copy01Icon, SearchSmIcon, Star01Icon } from '@kayou/icons';
import { useLocation } from '@solidjs/router';

/** Icon component type */
type IconComponent = Component<{ class?: string } & JSX.SvgSVGAttributes<SVGSVGElement>>;

type IconEntry = { name: string; component: IconComponent };

// Categorize icons by category
const categorizeIcon = (name: string): string => {
  const lowerName = name.toLowerCase();

  // Arrows - arrow, chevron, corner, expand, flip, infinity, refresh, reverse, switch
  if (
    lowerName.includes('arrow') ||
    lowerName.includes('chevron') ||
    lowerName.includes('corner') ||
    lowerName.includes('expand') ||
    lowerName.includes('flip') ||
    lowerName.includes('infinity') ||
    lowerName.includes('refresh') ||
    lowerName.includes('reverse') ||
    lowerName.includes('switch')
  )
    return 'Arrows';

  // Users - face (emotions), user, users
  if (
    lowerName.includes('facecontent') ||
    lowerName.includes('facefrown') ||
    lowerName.includes('facehappy') ||
    lowerName.includes('faceneutral') ||
    lowerName.includes('facesad') ||
    lowerName.includes('facesmile') ||
    lowerName.includes('facewink') ||
    lowerName.includes('user')
  )
    return 'Users';

  // Charts - bar-chart, horizontal-bar-chart, line-chart, pie-chart, presentation-chart, trend
  if (
    lowerName.includes('barchart') ||
    lowerName.includes('linechart') ||
    lowerName.includes('piechart') ||
    lowerName.includes('presentationchart') ||
    lowerName.includes('horizontalbarchart') ||
    lowerName.includes('chartbreakout') ||
    lowerName.includes('trend')
  )
    return 'Charts';

  // Communication - annotation, inbox, mail, message, phone (call related), send
  if (
    lowerName.includes('annotation') ||
    lowerName.includes('inbox') ||
    lowerName.includes('mail') ||
    lowerName.includes('message') ||
    lowerName.includes('phonecall') ||
    lowerName.includes('phonehangup') ||
    lowerName.includes('phoneincoming') ||
    lowerName.includes('phoneoutgoing') ||
    lowerName.includes('phonepause') ||
    lowerName.includes('phoneplus') ||
    lowerName.includes('phonex') ||
    lowerName.includes('send')
  )
    return 'Communication';

  // Layout - align (layout), columns, distribute, divider, flex-align, grid, intersect, layer, layout, maximize, minimize, rows, spacing, table
  if (
    lowerName.includes('alignbottom') ||
    lowerName.includes('alignhorizontal') ||
    lowerName.includes('alignleft0') ||
    lowerName.includes('alignright0') ||
    lowerName.includes('aligntop') ||
    lowerName.includes('alignvertical') ||
    lowerName.includes('column') ||
    lowerName.includes('distribute') ||
    lowerName.includes('divider') ||
    lowerName.includes('flexalign') ||
    lowerName.includes('grid') ||
    lowerName.includes('intersect') ||
    lowerName.includes('layer') ||
    lowerName.includes('layout') ||
    lowerName.includes('maximize') ||
    lowerName.includes('minimize') ||
    lowerName.includes('rows') ||
    lowerName.includes('spacing') ||
    lowerName.includes('table')
  )
    return 'Layout';

  // Development - brackets, code, codepen, container, cpu-chip, data, database, dataflow, file-code, git, package, puzzle-piece, qr-code, server, terminal, variable
  if (
    lowerName.includes('bracket') ||
    lowerName.includes('code') ||
    lowerName.includes('codepen') ||
    lowerName.includes('container') ||
    lowerName.includes('cpuchip') ||
    lowerName.includes('data') ||
    lowerName.includes('database') ||
    lowerName.includes('dataflow') ||
    lowerName.includes('git') ||
    lowerName.includes('package') ||
    lowerName.includes('puzzlepiece') ||
    lowerName.includes('qrcode') ||
    lowerName.includes('server') ||
    lowerName.includes('terminal') ||
    lowerName.includes('variable')
  )
    return 'Development';

  // Alerts & feedback - alert, announcement, bell, notification, thumbs
  if (
    lowerName.includes('alert') ||
    lowerName.includes('announcement') ||
    lowerName.includes('bell') ||
    lowerName.includes('notification') ||
    lowerName.includes('thumbs')
  )
    return 'Alerts & feedback';

  // Shapes - circle, cube, dice, hexagon, octagon, pentagon, square, star, triangle
  if (
    (lowerName.includes('circle') && !lowerName.includes('chart')) ||
    lowerName.includes('cube') ||
    lowerName.includes('dice') ||
    lowerName.includes('hexagon') ||
    lowerName.includes('octagon') ||
    lowerName.includes('pentagon') ||
    (lowerName.includes('square') && !lowerName.includes('message')) ||
    (lowerName.includes('star') && !lowerName.includes('starter')) ||
    lowerName.includes('triangle')
  )
    return 'Shapes';

  // Files - file, folder, paperclip, clipboard, sticker, box
  if (
    lowerName.includes('file') ||
    lowerName.includes('folder') ||
    lowerName.includes('paperclip') ||
    lowerName.includes('clipboard') ||
    lowerName.includes('sticker') ||
    lowerName === 'boxicon'
  )
    return 'Files';

  // Media & devices - airplay, airpods, battery, bluetooth, chrome-cast, clapperboard, disc, fast, film, gaming-pad, hard-drive, headphones, keyboard, laptop, lightbulb, microphone, modem, monitor, mouse, music-note, pause, phone-01/02, play, podcast, power, printer, recording, repeat, rss, shuffle, signal, simcard, skip, sliders, speaker, stop, tablet, tv, usb-flash-drive, video-recorder, voicemail, volume, webcam, wifi, youtube
  if (
    lowerName.includes('airplay') ||
    lowerName.includes('airpods') ||
    lowerName.includes('battery') ||
    lowerName.includes('bluetooth') ||
    lowerName.includes('chromecast') ||
    lowerName.includes('clapperboard') ||
    lowerName.includes('disc') ||
    lowerName.includes('fastbackward') ||
    lowerName.includes('fastforward') ||
    lowerName.includes('film') ||
    lowerName.includes('gamingpad') ||
    lowerName.includes('harddrive') ||
    lowerName.includes('headphones') ||
    lowerName.includes('keyboard') ||
    lowerName.includes('laptop') ||
    lowerName.includes('lightbulb') ||
    lowerName.includes('microphone') ||
    lowerName.includes('modem') ||
    lowerName.includes('monitor') ||
    lowerName.includes('mouse') ||
    lowerName.includes('musicnote') ||
    lowerName.includes('pause') ||
    lowerName.includes('phone01') ||
    lowerName.includes('phone02') ||
    lowerName.includes('play') ||
    lowerName.includes('podcast') ||
    lowerName.includes('power') ||
    lowerName.includes('printer') ||
    lowerName.includes('recording') ||
    lowerName.includes('repeat') ||
    lowerName.includes('rss') ||
    lowerName.includes('shuffle') ||
    lowerName.includes('signal') ||
    lowerName.includes('simcard') ||
    lowerName.includes('skip') ||
    lowerName.includes('sliders') ||
    lowerName.includes('speaker') ||
    lowerName.includes('stop') ||
    lowerName.includes('tablet') ||
    lowerName.includes('tv0') ||
    lowerName.includes('usbflashdrive') ||
    lowerName.includes('videorecorder') ||
    lowerName.includes('voicemail') ||
    lowerName.includes('volume') ||
    lowerName.includes('webcam') ||
    lowerName.includes('wifi') ||
    lowerName.includes('youtube')
  )
    return 'Media & devices';

  // Security - face-id, fingerprint, key, lock, passcode, scan, shield
  if (
    lowerName.includes('faceid') ||
    lowerName.includes('fingerprint') ||
    lowerName.includes('key') ||
    lowerName.includes('lock') ||
    lowerName.includes('passcode') ||
    lowerName.includes('scan') ||
    lowerName.includes('shield')
  )
    return 'Security';

  // Editor - align-center/justify/left/right, attachment, bezier-curve, bold, brush, circle-cut, code-snippet, colors, command, contrast, crop, cursor, delete, dotpoints, drop, dropper, eraser, feather, figma, framer, hand, heading, image-indent, italic, left-indent, letter-spacing, line-height, magic-wand, move, paint, palette, paragraph, pen-tool, pencil, perspective, pilcrow, reflect, right-indent, roller-brush, scale, scissors, skew, strikethrough, subscript, text-input, transform, type, underline, zoom
  if (
    lowerName.includes('aligncenter') ||
    lowerName.includes('alignjustify') ||
    lowerName.includes('alignlefticon') ||
    lowerName.includes('alignrighticon') ||
    lowerName.includes('attachment') ||
    lowerName.includes('beziercurve') ||
    lowerName.includes('bold') ||
    lowerName.includes('brush') ||
    lowerName.includes('circlecut') ||
    lowerName.includes('codesnippet') ||
    lowerName.includes('colors') ||
    lowerName.includes('command') ||
    lowerName.includes('contrast') ||
    lowerName.includes('crop') ||
    lowerName.includes('cursor') ||
    lowerName.includes('delete') ||
    lowerName.includes('dotpoints') ||
    lowerName.includes('drop') ||
    lowerName.includes('dropper') ||
    lowerName.includes('eraser') ||
    lowerName.includes('feather') ||
    lowerName.includes('figma') ||
    lowerName.includes('framer') ||
    lowerName.includes('hand') ||
    lowerName.includes('heading') ||
    lowerName.includes('imageindent') ||
    lowerName.includes('italic') ||
    lowerName.includes('leftindent') ||
    lowerName.includes('letterspacing') ||
    lowerName.includes('lineheight') ||
    lowerName.includes('magicwand') ||
    lowerName.includes('move') ||
    lowerName.includes('paint') ||
    lowerName.includes('palette') ||
    lowerName.includes('paragraphspacing') ||
    lowerName.includes('paragraphwrap') ||
    lowerName.includes('pentool') ||
    lowerName.includes('pencil') ||
    lowerName.includes('perspective') ||
    lowerName.includes('pilcrow') ||
    lowerName.includes('reflect') ||
    lowerName.includes('rightindent') ||
    lowerName.includes('rollerbrush') ||
    lowerName.includes('scale') ||
    lowerName.includes('scissors') ||
    lowerName.includes('skew') ||
    lowerName.includes('strikethrough') ||
    lowerName.includes('subscript') ||
    lowerName.includes('superscript') ||
    lowerName.includes('orderedlist') ||
    lowerName.includes('quote') ||
    lowerName.includes('tasklist') ||
    lowerName.includes('highlighter') ||
    lowerName.includes('textinput') ||
    lowerName.includes('transform') ||
    lowerName.includes('type') ||
    lowerName.includes('underline') ||
    lowerName.includes('zoom')
  )
    return 'Editor';

  // Education - atom, award, backpack, beaker, book, briefcase, calculator, certificate, glasses, globe-slated, graduation-hat, microscope, ruler, stand, telescope, trophy
  if (
    lowerName.includes('atom') ||
    lowerName.includes('award') ||
    lowerName.includes('backpack') ||
    lowerName.includes('beaker') ||
    lowerName.includes('book') ||
    lowerName.includes('briefcase') ||
    lowerName.includes('calculator') ||
    lowerName.includes('certificate') ||
    lowerName.includes('glasses') ||
    lowerName.includes('globeslated') ||
    lowerName.includes('graduationhat') ||
    lowerName.includes('microscope') ||
    lowerName.includes('ruler') ||
    lowerName.includes('stand') ||
    lowerName.includes('telescope') ||
    lowerName.includes('trophy')
  )
    return 'Education';

  // Finance & eCommerce - bank, coins, credit-card, cryptocurrency, currency, diamond, gift, piggy-bank, receipt, safe, sale, scales, shopping-bag, shopping-cart, tag, wallet
  if (
    lowerName.includes('bank') ||
    lowerName.includes('coin') ||
    lowerName.includes('creditcard') ||
    lowerName.includes('cryptocurrency') ||
    lowerName.includes('currency') ||
    lowerName.includes('diamond') ||
    lowerName.includes('gift') ||
    lowerName.includes('piggybank') ||
    lowerName.includes('receipt') ||
    lowerName.includes('safe') ||
    lowerName.includes('sale') ||
    lowerName.includes('scales') ||
    lowerName.includes('shoppingbag') ||
    lowerName.includes('shoppingcart') ||
    lowerName.includes('tag') ||
    lowerName.includes('wallet')
  )
    return 'Finance & eCommerce';

  // Maps & travel - bus, car, compass, flag, globe (not slated), luggage, map, mark, marker-pin, navigation-pointer, passport, plane, rocket, route, ticket, train, tram, truck
  if (
    lowerName.includes('bus') ||
    lowerName.includes('car0') ||
    lowerName.includes('compass') ||
    lowerName.includes('flag') ||
    (lowerName.includes('globe') && !lowerName.includes('slated')) ||
    lowerName.includes('luggage') ||
    lowerName.includes('map') ||
    lowerName.includes('markicon') ||
    lowerName.includes('markerpin') ||
    lowerName.includes('navigationpointer') ||
    lowerName.includes('passport') ||
    lowerName.includes('plane') ||
    lowerName.includes('rocket') ||
    lowerName.includes('route') ||
    lowerName.includes('ticket') ||
    lowerName.includes('train') ||
    lowerName.includes('tram') ||
    lowerName.includes('truck')
  )
    return 'Maps & travel';

  // Images - camera, flash, image (not indent)
  if (
    lowerName.includes('camera') ||
    lowerName.includes('flash') ||
    (lowerName.includes('image') && !lowerName.includes('indent'))
  )
    return 'Images';

  // Time - alarm-clock, calendar, clock, hourglass, watch
  if (
    lowerName.includes('alarmclock') ||
    lowerName.includes('calendar') ||
    lowerName.includes('clock') ||
    lowerName.includes('hourglass') ||
    lowerName.includes('watch')
  )
    return 'Time';

  // Weather - cloud, droplets, hurricane, lightning, moon, snowflake, stars, sun, sunrise, sunset, thermometer, umbrella, waves, wind
  if (
    lowerName.includes('cloud') ||
    lowerName.includes('droplet') ||
    lowerName.includes('hurricane') ||
    lowerName.includes('lightning') ||
    lowerName.includes('moon') ||
    lowerName.includes('snowflake') ||
    lowerName.includes('stars') ||
    lowerName.includes('sun') ||
    lowerName.includes('sunrise') ||
    lowerName.includes('sunset') ||
    lowerName.includes('thermometer') ||
    lowerName.includes('umbrella') ||
    lowerName.includes('waves') ||
    lowerName.includes('wind')
  )
    return 'Weather';

  return 'General';
};

function buildCategorizedIcons(allIcons: IconEntry[]): Record<string, IconEntry[]> {
  const categories: Record<string, IconEntry[]> = {};

  for (const entry of allIcons) {
    const category = categorizeIcon(entry.name);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(entry);
  }

  const sorted: Record<string, IconEntry[]> = {};
  for (const key of Object.keys(categories).sort()) {
    sorted[key] = categories[key].sort((a, b) => a.name.localeCompare(b.name));
  }

  return sorted;
}

// Format icon name for display
const formatIconName = (name: string): string => {
  return name
    .replace(/Icon$/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

// Convert hash to category name for matching
const hashToCategory = (
  hash: string,
  categories: Record<string, IconEntry[]>,
): string | null => {
  if (!hash) return null;
  const normalized = hash.replace('#', '').toLowerCase();
  return (
    Object.keys(categories).find(
      (cat) => cat.toLowerCase().replace(/[&\s]+/g, '-') === normalized,
    ) ?? null
  );
};

// Async loader for all icons — keeps them out of the shared bundle
async function loadAllIcons(): Promise<{
  allIcons: IconEntry[];
  byCategory: Record<string, IconEntry[]>;
}> {
  const mod = await import('@kayou/icons');
  const allIcons = Object.entries(mod)
    .filter(([name]) => name.endsWith('Icon'))
    .map(([name, component]) => ({
      name,
      component: component as IconComponent,
    }));
  return { allIcons, byCategory: buildCategorizedIcons(allIcons) };
}

export default function IconsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
  const [copiedIcon, setCopiedIcon] = createSignal<string | null>(null);

  const [iconsData, setIconsData] = createSignal<{
    allIcons: IconEntry[];
    byCategory: Record<string, IconEntry[]>;
  } | null>(null);

  onMount(() => {
    void loadAllIcons().then(setIconsData);
  });

  const byCategory = () => iconsData()?.byCategory ?? {};
  const allIconsList = () => iconsData()?.allIcons ?? [];

  // Sync selected category from URL hash
  createEffect(() => {
    const hash = location.hash;
    const categories = byCategory();
    setSelectedCategory(hashToCategory(hash, categories));
  });

  const filteredIcons = createMemo(() => {
    const query = searchQuery().toLowerCase();
    const category = selectedCategory();
    const categories = byCategory();

    const result: { name: string; component: IconComponent; category: string }[] = [];

    for (const [cat, icons] of Object.entries(categories)) {
      if (category && category !== cat) continue;

      for (const icon of icons) {
        const displayName = formatIconName(icon.name).toLowerCase();
        if (
          !query ||
          displayName.includes(query) ||
          icon.name.toLowerCase().includes(query)
        ) {
          result.push({ ...icon, category: cat });
        }
      }
    }

    return result;
  });

  const copyIconName = (iconName: string, e: MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div class="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <div class="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-blue-950/20">
        {/* Decorative icon */}
        <div class="pointer-events-none absolute -top-20 -right-20 opacity-[0.07] dark:opacity-[0.04]">
          <Star01Icon class="size-[500px] text-blue-600" />
        </div>

        <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Stats bar */}
          <div class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span class="font-medium text-neutral-900 dark:text-white">
              {allIconsList().length} icons
            </span>
          </div>

          {/* Main headline */}
          <h1 class="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl dark:text-white">
            Beautiful SVG icons for your SolidJS projects.
          </h1>

          {/* Links */}
        </div>
      </div>

      {/* Search bar */}
      <div class="border-t border-neutral-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-4 py-6">
            <SearchSmIcon class="size-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search all icons..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="flex-1 border-0 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-neutral-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div class="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-wrap gap-2 py-4">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              class={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory() === null
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              All
            </button>
            <For each={Object.keys(byCategory())}>
              {(category) => (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  class={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory() === category
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {category}
                </button>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Show
          when={iconsData()}
          fallback={
            <div class="flex items-center justify-center py-20">
              <p class="text-sm text-neutral-400 dark:text-neutral-500">
                Loading icons...
              </p>
            </div>
          }
        >
          {/* Results Header */}
          <div class="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            <Show
              when={searchQuery() || selectedCategory()}
              fallback={<span>Showing all {allIconsList().length} icons</span>}
            >
              <span>
                {filteredIcons().length} {filteredIcons().length === 1 ? 'icon' : 'icons'}
                <Show when={selectedCategory()}>
                  <span>
                    {' '}
                    in{' '}
                    <span class="font-medium text-neutral-900 dark:text-white">
                      {selectedCategory()}
                    </span>
                  </span>
                </Show>
                <Show when={searchQuery()}>
                  <span>
                    {' '}
                    matching "
                    <span class="font-medium text-neutral-900 dark:text-white">
                      {searchQuery()}
                    </span>
                    "
                  </span>
                </Show>
              </span>
            </Show>
          </div>

          {/* Icons Grid */}
          <Show
            when={filteredIcons().length > 0}
            fallback={
              <div class="flex flex-col items-center justify-center py-20">
                <div class="rounded-full bg-neutral-100 p-4 dark:bg-neutral-900">
                  <SearchSmIcon class="size-8 text-neutral-400" />
                </div>
                <h3 class="mt-4 text-lg font-medium text-neutral-950 dark:text-white">
                  No icons found
                </h3>
                <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Try a different search term or category.
                </p>
              </div>
            }
          >
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              <For each={filteredIcons()}>
                {(icon) => {
                  const IconComponent = icon.component;
                  return (
                    <div class="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-transparent bg-neutral-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md dark:bg-neutral-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30">
                      <div class="flex size-5 items-center justify-center text-neutral-700 transition-colors group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-blue-400">
                        <IconComponent class="size-5" />
                      </div>
                      <span class="w-full truncate text-center text-xs text-neutral-500 group-hover:text-blue-600 dark:text-neutral-400 dark:group-hover:text-blue-400">
                        {formatIconName(icon.name)}
                      </span>

                      {/* Copy button on hover */}
                      <button
                        onClick={(e) => copyIconName(icon.name, e)}
                        class="absolute top-2 right-2 flex cursor-pointer items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-neutral-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        title={`Copy ${icon.name}`}
                      >
                        <Copy01Icon class="size-3" />
                        Copy
                      </button>

                      {/* Copied overlay */}
                      <Show when={copiedIcon() === icon.name}>
                        <div class="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500 text-xs font-medium text-white">
                          Copied!
                        </div>
                      </Show>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
