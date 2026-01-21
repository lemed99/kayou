import { createSignal, For, Show, createMemo, JSX } from 'solid-js';
import { Button, Checkbox, Badge, ToggleSwitch } from '@exowpee/solidly';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Grid01Icon,
  HeartIcon,
  ListIcon,
  SearchMdIcon,
  ShoppingCart01Icon,
  Sliders01Icon,
  Star01Icon,
  XCloseIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating: number;
  reviews: number;
  brand: string;
  image?: string;
}

const productsData: Product[] = [
  { id: 1, name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, status: 'In Stock', rating: 4.8, reviews: 1250, brand: 'Apple' },
  { id: 2, name: 'Running Shoes Pro', category: 'Sports', price: 149, status: 'In Stock', rating: 4.5, reviews: 890, brand: 'Nike' },
  { id: 3, name: 'Espresso Machine', category: 'Home', price: 299, status: 'Low Stock', rating: 4.2, reviews: 567, brand: 'Breville' },
  { id: 4, name: 'Wireless Earbuds', category: 'Electronics', price: 199, status: 'In Stock', rating: 4.6, reviews: 2100, brand: 'Sony' },
  { id: 5, name: 'Yoga Mat Premium', category: 'Sports', price: 89, status: 'In Stock', rating: 4.3, reviews: 445, brand: 'Lululemon' },
  { id: 6, name: 'Smart Watch Ultra', category: 'Electronics', price: 799, status: 'Out of Stock', rating: 4.7, reviews: 1890, brand: 'Apple' },
  { id: 7, name: 'Stand Mixer', category: 'Home', price: 449, status: 'In Stock', rating: 4.1, reviews: 780, brand: 'KitchenAid' },
  { id: 8, name: 'Basketball Official', category: 'Sports', price: 39, status: 'Low Stock', rating: 4.4, reviews: 320, brand: 'Wilson' },
  { id: 9, name: 'Noise-Canceling Headphones', category: 'Electronics', price: 379, status: 'In Stock', rating: 4.9, reviews: 3200, brand: 'Sony' },
  { id: 10, name: 'Air Purifier', category: 'Home', price: 599, status: 'In Stock', rating: 4.5, reviews: 920, brand: 'Dyson' },
  { id: 11, name: 'Tennis Racket Pro', category: 'Sports', price: 229, status: 'In Stock', rating: 4.6, reviews: 560, brand: 'Wilson' },
  { id: 12, name: 'Smart Speaker', category: 'Electronics', price: 99, status: 'In Stock', rating: 4.3, reviews: 4500, brand: 'Amazon' },
];

const categories = ['Electronics', 'Sports', 'Home'];
const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
const brands = [...new Set(productsData.map(p => p.brand))];

// ============================================================================
// Variant 1: Modern Sidebar Layout
// ============================================================================
const SearchFilterModern = () => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategories, setSelectedCategories] = createSignal<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = createSignal<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = createSignal<Set<string>>(new Set());
  const [priceRange, setPriceRange] = createSignal({ min: '', max: '' });
  const [sortBy, setSortBy] = createSignal('featured');
  const [viewMode, setViewMode] = createSignal<'grid' | 'list'>('grid');

  const toggleCategory = (cat: string) => {
    const newSet = new Set(selectedCategories());
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    setSelectedCategories(newSet);
  };

  const toggleStatus = (status: string) => {
    const newSet = new Set(selectedStatuses());
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    setSelectedStatuses(newSet);
  };

  const toggleBrand = (brand: string) => {
    const newSet = new Set(selectedBrands());
    if (newSet.has(brand)) {
      newSet.delete(brand);
    } else {
      newSet.add(brand);
    }
    setSelectedBrands(newSet);
  };

  const filteredProducts = createMemo(() => {
    let result = productsData;

    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    }
    if (selectedCategories().size > 0) result = result.filter(p => selectedCategories().has(p.category));
    if (selectedStatuses().size > 0) result = result.filter(p => selectedStatuses().has(p.status));
    if (selectedBrands().size > 0) result = result.filter(p => selectedBrands().has(p.brand));
    if (priceRange().min) result = result.filter(p => p.price >= parseFloat(priceRange().min));
    if (priceRange().max) result = result.filter(p => p.price <= parseFloat(priceRange().max));

    return [...result].sort((a, b) => {
      switch (sortBy()) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviews - a.reviews;
        default: return 0;
      }
    });
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setSelectedStatuses(new Set());
    setSelectedBrands(new Set());
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
  };

  const activeFilterCount = createMemo(() => {
    let count = 0;
    if (searchQuery()) count++;
    if (selectedCategories().size > 0) count += selectedCategories().size;
    if (selectedStatuses().size > 0) count += selectedStatuses().size;
    if (selectedBrands().size > 0) count += selectedBrands().size;
    if (priceRange().min || priceRange().max) count++;
    return count;
  });

  return (
    <div class="flex min-h-full bg-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Sidebar Filters */}
      <aside class="w-72 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-6  dark:border-gray-700/50 dark:bg-gray-900/70">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Sliders01Icon class="size-5 text-gray-600 dark:text-gray-400" />
            <h2 class="font-semibold text-gray-900 dark:text-white">Filters</h2>
          </div>
          <Show when={activeFilterCount() > 0}>
            <button onClick={clearFilters} class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Clear all ({activeFilterCount()})
            </button>
          </Show>
        </div>

        {/* Category Filter */}
        <div class="mt-6">
          <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Category</h3>
          <div class="space-y-2">
            <For each={categories}>
              {(cat) => (
                <label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={selectedCategories().has(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                  <span class="ml-auto text-xs text-gray-400">
                    {productsData.filter(p => p.category === cat).length}
                  </span>
                </label>
              )}
            </For>
          </div>
        </div>

        {/* Status Filter */}
        <div class="mt-6">
          <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Availability</h3>
          <div class="space-y-2">
            <For each={statuses}>
              {(status) => (
                <label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedStatuses().has(status)}
                    onChange={() => toggleStatus(status)}
                  />
                  <span class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span class={`size-2 rounded-full ${
                      status === 'In Stock' ? 'bg-green-500' :
                      status === 'Low Stock' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {status}
                  </span>
                </label>
              )}
            </For>
          </div>
        </div>

        {/* Brand Filter */}
        <div class="mt-6">
          <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Brand</h3>
          <div class="space-y-2">
            <For each={brands}>
              {(brand) => (
                <label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands().has(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{brand}</span>
                </label>
              )}
            </For>
          </div>
        </div>

        {/* Price Range */}
        <div class="mt-6">
          <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Price Range</h3>
          <div class="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange().min}
              onInput={(e) => setPriceRange(prev => ({ ...prev, min: e.currentTarget.value }))}
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange().max}
              onInput={(e) => setPriceRange(prev => ({ ...prev, max: e.currentTarget.value }))}
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex-1 p-6">
        {/* Search and Sort Bar */}
        <div class="mb-6 flex items-center justify-between gap-4">
          <div class="relative flex-1 max-w-lg">
            <SearchMdIcon class="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400  transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-white"
            />
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts().length} products
            </span>
            <select
              value={sortBy()}
              onChange={(e) => setSortBy(e.currentTarget.value)}
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm  focus:border-blue-500 focus:outline-none dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
            <div class="flex rounded-lg border border-gray-200 bg-white p-1  dark:border-gray-700/50 dark:bg-gray-900/50">
              <button
                onClick={() => setViewMode('grid')}
                class={`rounded-md p-2 transition-colors ${
                  viewMode() === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'text-gray-400'
                }`}
              >
                <Grid01Icon class="size-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                class={`rounded-md p-2 transition-colors ${
                  viewMode() === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'text-gray-400'
                }`}
              >
                <ListIcon class="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        <Show when={activeFilterCount() > 0}>
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            <For each={Array.from(selectedCategories())}>
              {(cat) => (
                <button
                  onClick={() => toggleCategory(cat)}
                  class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {cat}
                  <XCloseIcon class="size-3" />
                </button>
              )}
            </For>
            <For each={Array.from(selectedBrands())}>
              {(brand) => (
                <button
                  onClick={() => toggleBrand(brand)}
                  class="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                >
                  {brand}
                  <XCloseIcon class="size-3" />
                </button>
              )}
            </For>
          </div>
        </Show>

        {/* Products Grid */}
        <Show when={viewMode() === 'grid'}>
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <For each={filteredProducts()}>
              {(product) => (
                <div class="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-4  transition-all hover:border-blue-200 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-900/50 dark:hover:border-blue-600/50">
                  {/* Image Placeholder */}
                  <div class="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gray-100 dark:from-gray-700 dark:to-gray-800">
                    <div class="absolute inset-0 flex items-center justify-center">
                      <ShoppingCart01Icon class="size-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <button class="absolute right-2 top-2 rounded-full bg-white p-2 text-gray-400 opacity-0 shadow-sm transition-all hover:text-red-500 group-hover:opacity-100 dark:bg-gray-800">
                      <HeartIcon class="size-4" />
                    </button>
                    <Show when={product.status !== 'In Stock'}>
                      <span class={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                      }`}>
                        {product.status}
                      </span>
                    </Show>
                  </div>

                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                    <h3 class="mt-1 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {product.name}
                    </h3>
                    <div class="mt-2 flex items-center gap-1">
                      <Star01Icon class="size-4 text-yellow-400" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
                      <span class="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                      <span class="text-xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                      <Button color="blue" size="sm" class="shadow-lg shadow-blue-500/25">
                        <span class="flex items-center gap-1">
                          <ShoppingCart01Icon class="size-4" />
                          Add
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={viewMode() === 'list'}>
          <div class="space-y-3">
            <For each={filteredProducts()}>
              {(product) => (
                <div class="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4  transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-900/50">
                  <div class="flex size-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:from-gray-700 dark:to-gray-800">
                    <ShoppingCart01Icon class="size-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                    <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white">{product.name}</h3>
                    <div class="mt-1 flex items-center gap-2">
                      <div class="flex items-center gap-1">
                        <Star01Icon class="size-3.5 text-yellow-400" />
                        <span class="text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
                      </div>
                      <span class="text-xs text-gray-400">({product.reviews.toLocaleString()} reviews)</span>
                      <Badge color={product.status === 'In Stock' ? 'success' : product.status === 'Low Stock' ? 'warning' : 'failure'} size="sm">
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xl font-bold text-gray-900 dark:text-white">${product.price}</p>
                    <Button color="blue" size="sm" class="mt-2">
                      <span class="flex items-center gap-1">
                        <ShoppingCart01Icon class="size-4" />
                        Add to Cart
                      </span>
                    </Button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={filteredProducts().length === 0}>
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <SearchMdIcon class="size-16 text-gray-300 dark:text-gray-600" />
            <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">No products found</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
            <Button color="light" class="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        </Show>
      </main>
    </div>
  );
};

// ============================================================================
// Variant 2: Horizontal Filter Bar
// ============================================================================
const SearchFilterHorizontal = () => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
  const [priceFilter, setPriceFilter] = createSignal<string | null>(null);
  const [sortBy, setSortBy] = createSignal('featured');
  const [showOnlyInStock, setShowOnlyInStock] = createSignal(false);

  const filteredProducts = createMemo(() => {
    let result = productsData;

    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }
    if (selectedCategory()) result = result.filter(p => p.category === selectedCategory());
    if (showOnlyInStock()) result = result.filter(p => p.status === 'In Stock');

    if (priceFilter()) {
      switch (priceFilter()) {
        case 'under50': result = result.filter(p => p.price < 50); break;
        case '50-100': result = result.filter(p => p.price >= 50 && p.price <= 100); break;
        case '100-500': result = result.filter(p => p.price >= 100 && p.price <= 500); break;
        case 'over500': result = result.filter(p => p.price > 500); break;
      }
    }

    return [...result].sort((a, b) => {
      switch (sortBy()) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });
  });

  return (
    <div class="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="px-6 py-4">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shop All Products</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts().length} products available
          </p>
        </div>

        {/* Filter Bar */}
        <div class="flex items-center gap-4 border-t border-gray-100 px-6 py-3 dark:border-gray-800">
          {/* Search */}
          <div class="relative w-64">
            <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory() || ''}
            onChange={(e) => setSelectedCategory(e.currentTarget.value || null)}
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            <For each={categories}>{(cat) => <option value={cat}>{cat}</option>}</For>
          </select>

          {/* Price */}
          <select
            value={priceFilter() || ''}
            onChange={(e) => setPriceFilter(e.currentTarget.value || null)}
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Any Price</option>
            <option value="under50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="over500">Over $500</option>
          </select>

          {/* In Stock Toggle */}
          <ToggleSwitch
            checked={showOnlyInStock()}
            onChange={setShowOnlyInStock}
            label="In Stock Only"
          />

          <div class="ml-auto flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Sort:</span>
            <select
              value={sortBy()}
              onChange={(e) => setSortBy(e.currentTarget.value)}
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div class="p-6">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <For each={filteredProducts()}>
            {(product) => (
              <div class="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div class="relative aspect-square bg-gray-100 dark:bg-gray-800">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <ShoppingCart01Icon class="size-10 text-gray-300 dark:text-gray-600" />
                  </div>
                </div>
                <div class="p-4">
                  <p class="text-xs font-medium text-blue-600 dark:text-blue-400">{product.brand}</p>
                  <h3 class="mt-1 font-medium text-gray-900 dark:text-white">{product.name}</h3>
                  <div class="mt-2 flex items-center gap-1">
                    <div class="flex">
                      <For each={[1, 2, 3, 4, 5]}>
                        {(i) => (
                          <Star01Icon
                            class={`size-3.5 ${i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}
                          />
                        )}
                      </For>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
                  </div>
                  <div class="mt-3 flex items-center justify-between">
                    <span class="text-lg font-bold text-gray-900 dark:text-white">${product.price}</span>
                    <Button color="light" size="sm">
                      <ShoppingCart01Icon class="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 3: Compact Collapsible Filters
// ============================================================================
const SearchFilterCompact = () => {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [openSection, setOpenSection] = createSignal<string | null>('category');
  const [selectedFilters, setSelectedFilters] = createSignal<Record<string, Set<string>>>({
    category: new Set(),
    brand: new Set(),
    status: new Set(),
  });
  const [sortBy, setSortBy] = createSignal('featured');

  const toggleFilter = (type: string, value: string) => {
    const current = selectedFilters()[type] || new Set();
    const newSet = new Set(current);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedFilters(prev => ({ ...prev, [type]: newSet }));
  };

  const filteredProducts = createMemo(() => {
    let result = productsData;

    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    const filters = selectedFilters();
    if (filters.category.size > 0) result = result.filter(p => filters.category.has(p.category));
    if (filters.brand.size > 0) result = result.filter(p => filters.brand.has(p.brand));
    if (filters.status.size > 0) result = result.filter(p => filters.status.has(p.status));

    return [...result].sort((a, b) => {
      switch (sortBy()) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });
  });

  const totalActiveFilters = createMemo(() => {
    const filters = selectedFilters();
    return filters.category.size + filters.brand.size + filters.status.size;
  });

  const FilterSection = (props: { title: string; id: string; children: JSX.Element }) => (
    <div class="border-b border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setOpenSection(openSection() === props.id ? null : props.id)}
        class="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span class="text-sm font-medium text-gray-900 dark:text-white">{props.title}</span>
        {openSection() === props.id ? (
          <ChevronUpIcon class="size-4 text-gray-400" />
        ) : (
          <ChevronDownIcon class="size-4 text-gray-400" />
        )}
      </button>
      <Show when={openSection() === props.id}>
        <div class="px-4 pb-4">{props.children}</div>
      </Show>
    </div>
  );

  return (
    <div class="flex min-h-full bg-white dark:bg-gray-900">
      {/* Compact Sidebar */}
      <aside class="w-60 shrink-0 border-r border-gray-100 dark:border-gray-800">
        <div class="sticky top-0">
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">Filters</span>
            <Show when={totalActiveFilters() > 0}>
              <button
                onClick={() => setSelectedFilters({ category: new Set(), brand: new Set(), status: new Set() })}
                class="text-xs text-blue-600 hover:text-blue-500"
              >
                Clear ({totalActiveFilters()})
              </button>
            </Show>
          </div>

          <FilterSection title="Category" id="category">
            <div class="space-y-1">
              <For each={categories}>
                {(cat) => (
                  <button
                    onClick={() => toggleFilter('category', cat)}
                    class={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors ${
                      selectedFilters().category.has(cat)
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat}
                    <Show when={selectedFilters().category.has(cat)}>
                      <CheckCircleIcon class="size-4" />
                    </Show>
                  </button>
                )}
              </For>
            </div>
          </FilterSection>

          <FilterSection title="Brand" id="brand">
            <div class="space-y-1">
              <For each={brands}>
                {(brand) => (
                  <button
                    onClick={() => toggleFilter('brand', brand)}
                    class={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors ${
                      selectedFilters().brand.has(brand)
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    {brand}
                    <Show when={selectedFilters().brand.has(brand)}>
                      <CheckCircleIcon class="size-4" />
                    </Show>
                  </button>
                )}
              </For>
            </div>
          </FilterSection>

          <FilterSection title="Availability" id="status">
            <div class="space-y-1">
              <For each={statuses}>
                {(status) => (
                  <button
                    onClick={() => toggleFilter('status', status)}
                    class={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors ${
                      selectedFilters().status.has(status)
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span class="flex items-center gap-2">
                      <span class={`size-2 rounded-full ${
                        status === 'In Stock' ? 'bg-green-500' :
                        status === 'Low Stock' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {status}
                    </span>
                    <Show when={selectedFilters().status.has(status)}>
                      <CheckCircleIcon class="size-4" />
                    </Show>
                  </button>
                )}
              </For>
            </div>
          </FilterSection>
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex-1 p-6">
        <div class="mb-6 flex items-center gap-4">
          <div class="relative flex-1 max-w-md">
            <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-4 text-sm focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <select
            value={sortBy()}
            onChange={(e) => setSortBy(e.currentTarget.value)}
            class="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts().length} results
          </span>
        </div>

        <div class="space-y-2">
          <For each={filteredProducts()}>
            {(product) => (
              <div class="group flex items-center gap-4 rounded-lg border border-gray-100 p-3 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800/50">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <ShoppingCart01Icon class="size-6 text-gray-400" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-medium text-gray-900 dark:text-white">{product.name}</h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">by {product.brand}</span>
                  </div>
                  <div class="mt-1 flex items-center gap-3 text-sm">
                    <span class="flex items-center gap-1">
                      <Star01Icon class="size-3.5 text-yellow-400" />
                      {product.rating}
                    </span>
                    <span class="text-gray-400">·</span>
                    <span class="text-gray-500 dark:text-gray-400">{product.category}</span>
                    <span class="text-gray-400">·</span>
                    <span class={
                      product.status === 'In Stock' ? 'text-green-600 dark:text-green-400' :
                      product.status === 'Low Stock' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">${product.price}</p>
                </div>
                <button class="shrink-0 rounded-lg bg-gray-900 p-2 text-white opacity-0 transition-all hover:bg-gray-800 group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900">
                  <ArrowRightIcon class="size-4" />
                </button>
              </div>
            )}
          </For>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const searchFilterModernCode = `import { createSignal, For, Show, createMemo } from 'solid-js';
import { Button, Checkbox, Badge } from '@exowpee/solidly';
import { SearchMdIcon, Sliders01Icon, Grid01Icon, ListIcon, Star01Icon } from '@exowpee/solidly/icons';

export default function SearchFilterModern() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategories, setSelectedCategories] = createSignal(new Set());
  const [priceRange, setPriceRange] = createSignal({ min: '', max: '' });
  const [viewMode, setViewMode] = createSignal('grid');

  const filteredProducts = createMemo(() => {
    let result = products;
    if (searchQuery()) result = result.filter(p => p.name.includes(searchQuery()));
    if (selectedCategories().size > 0) result = result.filter(p => selectedCategories().has(p.category));
    return result;
  });

  return (
    <div class="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside class="w-72 border-r border-gray-200 bg-white p-6 ">
        <div class="flex items-center justify-between">
          <h2>Filters</h2>
          <button onClick={clearFilters}>Clear all</button>
        </div>

        <div class="mt-6">
          <h3>Category</h3>
          <For each={categories}>
            {(cat) => (
              <Checkbox
                checked={selectedCategories().has(cat)}
                onChange={() => toggleCategory(cat)}
                label={cat}
              />
            )}
          </For>
        </div>

        <div class="mt-6">
          <h3>Price Range</h3>
          <div class="flex gap-2">
            <input placeholder="Min" />
            <input placeholder="Max" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main class="flex-1 p-6">
        <div class="flex items-center gap-4">
          <input placeholder="Search..." class="flex-1 rounded-xl border-gray-200 bg-white" />
          <select>Sort options</select>
          <div class="flex gap-1">
            <button onClick={() => setViewMode('grid')}><Grid01Icon /></button>
            <button onClick={() => setViewMode('list')}><ListIcon /></button>
          </div>
        </div>

        {/* Product Grid */}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <For each={filteredProducts()}>
            {(product) => (
              <div class="rounded-2xl border-gray-200 bg-white p-4 ">
                <h3>{product.name}</h3>
                <div class="flex items-center gap-1">
                  <Star01Icon class="text-yellow-400" />
                  {product.rating}
                </div>
                <p class="text-xl font-bold">\${product.price}</p>
              </div>
            )}
          </For>
        </div>
      </main>
    </div>
  );
}`;

const searchFilterHorizontalCode = `import { createSignal, For, createMemo } from 'solid-js';
import { Button, ToggleSwitch } from '@exowpee/solidly';

export default function SearchFilterHorizontal() {
  const [searchQuery, setSearchQuery] = createSignal('');
  const [selectedCategory, setSelectedCategory] = createSignal(null);
  const [showOnlyInStock, setShowOnlyInStock] = createSignal(false);

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="border-b bg-white">
        <h1>Shop All Products</h1>

        {/* Horizontal Filter Bar */}
        <div class="flex items-center gap-4 border-t px-6 py-3">
          <input placeholder="Search..." />
          <select>All Categories</select>
          <select>Any Price</select>
          <ToggleSwitch checked={showOnlyInStock()} onChange={setShowOnlyInStock} />
          <span>In Stock Only</span>
          <select class="ml-auto">Sort options</select>
        </div>
      </header>

      <div class="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <For each={filteredProducts()}>
          {(product) => (
            <div class="rounded-xl border bg-white p-4">
              <p class="text-xs text-blue-600">{product.brand}</p>
              <h3>{product.name}</h3>
              <p class="text-lg font-bold">\${product.price}</p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}`;

const searchFilterCompactCode = `import { createSignal, For, Show, createMemo } from 'solid-js';
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@exowpee/solidly/icons';

export default function SearchFilterCompact() {
  const [openSection, setOpenSection] = createSignal('category');
  const [selectedFilters, setSelectedFilters] = createSignal({
    category: new Set(),
    brand: new Set(),
  });

  const FilterSection = ({ title, id, children }) => (
    <div class="border-b">
      <button onClick={() => setOpenSection(openSection() === id ? null : id)}
        class="flex w-full items-center justify-between p-3">
        {title}
        {openSection() === id ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      <Show when={openSection() === id}>
        <div class="px-4 pb-4">{children}</div>
      </Show>
    </div>
  );

  return (
    <div class="flex min-h-screen bg-white">
      {/* Compact Collapsible Sidebar */}
      <aside class="w-60 border-r">
        <FilterSection title="Category" id="category">
          <For each={categories}>
            {(cat) => (
              <button onClick={() => toggleFilter('category', cat)}
                class={selectedFilters().category.has(cat) ? 'bg-blue-50 text-blue-700' : ''}>
                {cat}
                <Show when={selectedFilters().category.has(cat)}>
                  <CheckCircleIcon />
                </Show>
              </button>
            )}
          </For>
        </FilterSection>
      </aside>

      {/* Compact Product List */}
      <main class="flex-1 p-6">
        <For each={filteredProducts()}>
          {(product) => (
            <div class="flex items-center gap-4 rounded-lg border p-3">
              <h3>{product.name}</h3>
              <span>{product.brand}</span>
              <span>\${product.price}</span>
            </div>
          )}
        </For>
      </main>
    </div>
  );
}`;

export default function SearchFilterBlockPage() {
  return (
    <BlocksDocPage
      title="Search & Filter"
      description="Premium search and filter interfaces with multiple layouts: modern sidebar with glassmorphism, horizontal filter bar, or compact collapsible filters. Perfect for e-commerce and catalog pages."
      category="Data Management"
      isPro
      variants={[
        {
          id: 'modern',
          title: 'Modern Sidebar Layout',
          description: 'Glassmorphism sidebar with checkbox filters, price range, and grid/list toggle.',
          component: SearchFilterModern,
          code: searchFilterModernCode,
        },
        {
          id: 'horizontal',
          title: 'Horizontal Filter Bar',
          description: 'Clean horizontal filter bar with dropdowns and toggle switch.',
          component: SearchFilterHorizontal,
          code: searchFilterHorizontalCode,
        },
        {
          id: 'compact',
          title: 'Compact Collapsible',
          description: 'Minimal sidebar with collapsible filter sections.',
          component: SearchFilterCompact,
          code: searchFilterCompactCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Checkbox', path: '/components/checkbox' },
        { name: 'ToggleSwitch', path: '/components/toggle-switch' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        { name: 'Table View', path: '/blocks/data-management/table-view', description: 'Data table with filters and sorting' },
        { name: 'List View', path: '/blocks/data-management/list-view', description: 'Card-based list layout' },
        { name: 'CRUD Interface', path: '/blocks/data-management/crud-interface', description: 'Create, read, update, delete operations' },
      ]}
    />
  );
}

// Export components for iframe preview
export { SearchFilterModern, SearchFilterHorizontal, SearchFilterCompact };
