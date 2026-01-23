/* eslint-disable solid/no-innerhtml */
import {
  Component,
  For,
  type JSX,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import * as Icons from '@exowpee/solidly-icons';

import { formatCodeToHTML } from '../helpers/formatCodeToHTML';

/** Icon component type */
type IconComponent = Component<{ class?: string } & JSX.SvgSVGAttributes<SVGSVGElement>>;

// Get all icon names from the exports
const allIcons = Object.entries(Icons).filter(([name]) => name.endsWith('Icon'));

// Categorize icons based on Untitled UI icon categories
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

// Build categorized icon list
const iconsByCategory = createMemo(() => {
  const categories: Record<string, { name: string; component: IconComponent }[]> = {};

  for (const [name, component] of allIcons) {
    const category = categorizeIcon(name);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ name, component: component as IconComponent });
  }

  // Sort categories alphabetically
  const sortedCategories: Record<string, { name: string; component: IconComponent }[]> =
    {};
  for (const key of Object.keys(categories).sort()) {
    sortedCategories[key] = categories[key].sort((a, b) => a.name.localeCompare(b.name));
  }

  return sortedCategories;
});

// Get all categories
const allCategories = createMemo(() => Object.keys(iconsByCategory()).sort());

// Format icon name for display
const formatIconName = (name: string): string => {
  return name
    .replace(/Icon$/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

const codeExample = `import { ArrowRightIcon, CheckIcon } from '@exowpee/solidly-icons';

function MyComponent() {
  return (
    <button class="flex items-center gap-2">
      Continue <ArrowRightIcon class="size-5" />
    </button>
  );
}`;

export default function IconsPage() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
  const [copiedIcon, setCopiedIcon] = createSignal<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [isDark, setIsDark] = createSignal(false);

  // Track dark mode via document.documentElement class
  onMount(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    onCleanup(() => observer.disconnect());
  });

  const filteredIcons = createMemo(() => {
    const query = searchQuery().toLowerCase();
    const category = selectedCategory();
    const categories = iconsByCategory();

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
    <div class="min-h-screen bg-white dark:bg-gray-900">
      {/* Header - heroicons style */}
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/20">
        {/* Decorative icon */}
        <div class="pointer-events-none absolute -right-20 -top-20 opacity-[0.07] dark:opacity-[0.04]">
          <Icons.Star01Icon class="size-[500px] text-blue-600" />
        </div>

        <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Stats bar */}
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium text-gray-900 dark:text-white">
              {allIcons.length} icons
            </span>
            <span>·</span>
            <span>Free & open source</span>
            <span>·</span>
            <span>SolidJS</span>
          </div>

          {/* Main headline */}
          <h1 class="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Beautiful hand-crafted SVG icons, from{' '}
            <a
              href="https://www.untitledui.com/icons"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Untitled UI
            </a>
            .
          </h1>

          {/* Links */}
          <div class="mt-8 flex items-center gap-6">
            <a
              href="https://www.untitledui.com/icons"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Icons.LinkExternal01Icon class="size-5" />
              <span>Untitled UI Icons</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search bar - minimal style */}
      <div class="border-t border-gray-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-4 py-6">
            <Icons.SearchSmIcon class="size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search all icons..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[12rem_1fr]">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen())}
            class="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg lg:hidden dark:bg-white dark:text-gray-900"
          >
            <Icons.FilterFunnel01Icon class="size-5" />
            Categories
          </button>

          {/* Sidebar - sticky */}
          <aside
            class={`fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto border-r border-gray-200 bg-white pt-4 transition-transform lg:relative lg:row-span-1 lg:w-auto lg:translate-x-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:pt-0 dark:border-gray-800 dark:bg-gray-900 lg:dark:bg-transparent ${
              sidebarOpen() ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Mobile Close Button */}
            <div class="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden dark:border-gray-800">
              <span class="font-medium text-gray-900 dark:text-white">Categories</span>
              <button onClick={() => setSidebarOpen(false)}>
                <Icons.XCloseIcon class="size-5 text-gray-500" />
              </button>
            </div>

            <nav class="top-8 p-4 lg:p-0">
              <ul class="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSidebarOpen(false);
                    }}
                    class={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      selectedCategory() === null
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>All Icons</span>
                    <span
                      class={`rounded-full px-2 py-0.5 text-xs ${
                        selectedCategory() === null
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                      }`}
                    >
                      {allIcons.length}
                    </span>
                  </button>
                </li>
                <li class="pt-2">
                  <div class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Categories
                  </div>
                </li>
                <For each={allCategories()}>
                  {(category) => (
                    <li>
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setSidebarOpen(false);
                        }}
                        class={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedCategory() === category
                            ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span>{category}</span>
                        <span
                          class={`rounded-full px-2 py-0.5 text-xs ${
                            selectedCategory() === category
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400'
                          }`}
                        >
                          {iconsByCategory()[category]?.length || 0}
                        </span>
                      </button>
                    </li>
                  )}
                </For>
              </ul>
            </nav>
          </aside>

          {/* Sidebar Overlay for Mobile */}
          <Show when={sidebarOpen()}>
            <div
              class="fixed inset-0 z-30 bg-gray-950/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          </Show>

          {/* Main Content - height matches sidebar */}
          <main class="flex h-[1400px] min-w-0 flex-col overflow-hidden">
            {/* Results Header - fixed */}
            <div class="mb-4 shrink-0 text-sm text-gray-600 dark:text-gray-400">
              <Show
                when={searchQuery() || selectedCategory()}
                fallback={<span>Showing all {allIcons.length} icons</span>}
              >
                <span>
                  {filteredIcons().length}{' '}
                  {filteredIcons().length === 1 ? 'icon' : 'icons'}
                  {selectedCategory() && (
                    <span>
                      {' '}
                      in{' '}
                      <span class="font-medium text-gray-900 dark:text-white">
                        {selectedCategory()}
                      </span>
                    </span>
                  )}
                  {searchQuery() && (
                    <span>
                      {' '}
                      matching "
                      <span class="font-medium text-gray-900 dark:text-white">
                        {searchQuery()}
                      </span>
                      "
                    </span>
                  )}
                </span>
              </Show>
            </div>

            {/* Icons Grid - scrollable */}
            <div class="min-h-0 flex-1 overflow-y-auto pb-8">
              <Show
                when={filteredIcons().length > 0}
                fallback={
                  <div class="flex flex-col items-center justify-center py-20">
                    <div class="rounded-full bg-gray-100 p-4 dark:bg-gray-900">
                      <Icons.SearchSmIcon class="size-8 text-gray-400" />
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-gray-950 dark:text-white">
                      No icons found
                    </h3>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
                        <div class="group relative flex flex-col items-center gap-2 rounded-xl border border-transparent bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md dark:bg-gray-900 dark:hover:border-blue-800 dark:hover:bg-blue-950/30">
                          <div class="flex size-5 items-center justify-center text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                            <IconComponent class="size-5" />
                          </div>
                          <span class="w-full truncate text-center text-xs text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400">
                            {formatIconName(icon.name)}
                          </span>

                          {/* Copy button on hover */}
                          <button
                            onClick={(e) => copyIconName(icon.name, e)}
                            class="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 opacity-0 shadow-sm transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                            title={`Copy ${icon.name}`}
                          >
                            <Icons.Copy01Icon class="size-3" />
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
            </div>
          </main>
        </div>
      </div>

      {/* How to use Section - at bottom */}
      <div class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-gray-950 dark:text-white">How to use</h2>
          <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <div innerHTML={formatCodeToHTML(codeExample, isDark() ? 'dark' : 'light')} />
          </div>
          <div class="mt-6 flex flex-wrap gap-6">
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.CheckCircleIcon class="size-5 text-green-500" />
              <span>Tree-shakeable</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.CheckCircleIcon class="size-5 text-green-500" />
              <span>TypeScript support</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.CheckCircleIcon class="size-5 text-green-500" />
              <span>SSR compatible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
