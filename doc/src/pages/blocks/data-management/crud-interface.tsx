import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput, Modal, Badge, Textarea } from '@exowpee/solidly';
import {
  BoxIcon,
  CheckCircleIcon,
  Edit02Icon,
  PackageIcon,
  PlusIcon,
  RefreshCw01Icon,
  SearchMdIcon,
  Tag01Icon,
  CheckIcon,
  Trash01Icon,
  XCircleIcon,
} from '@exowpee/solidly/icons';
import BlocksDocPage from '../../../components/BlocksDocPage';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description?: string;
  sku?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'MacBook Pro 16"', category: 'Electronics', price: 2499.99, stock: 50, status: 'Active', description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD', sku: 'MBP-16-M3' },
  { id: 2, name: 'Nike Air Max 90', category: 'Footwear', price: 149.99, stock: 120, status: 'Active', description: 'Classic sneakers with Air cushioning', sku: 'NAM-90-WHT' },
  { id: 3, name: 'Sony WH-1000XM5', category: 'Electronics', price: 399.99, stock: 0, status: 'Out of Stock', description: 'Premium noise-canceling headphones', sku: 'SNY-WH5-BLK' },
  { id: 4, name: 'Herman Miller Aeron', category: 'Furniture', price: 1395.00, stock: 35, status: 'Active', description: 'Ergonomic office chair', sku: 'HM-AERON-L' },
  { id: 5, name: 'Dyson V15 Detect', category: 'Home', price: 749.99, stock: 25, status: 'Active', description: 'Cordless vacuum cleaner with laser', sku: 'DYS-V15-ABS' },
  { id: 6, name: 'Apple Watch Ultra 2', category: 'Electronics', price: 799.00, stock: 0, status: 'Out of Stock', description: 'Rugged titanium smartwatch', sku: 'AWU-2-TIT' },
];

// ============================================================================
// Variant 1: Modern Card Layout with Modal
// ============================================================================
const CrudModern = () => {
  const [items, setItems] = createSignal(initialProducts);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingItem, setEditingItem] = createSignal<Product | null>(null);
  const [formData, setFormData] = createSignal({ name: '', category: '', price: '', stock: '', description: '', sku: '' });
  const [searchQuery, setSearchQuery] = createSignal('');
  const [isSaving, setIsSaving] = createSignal(false);
  const [deleteConfirm, setDeleteConfirm] = createSignal<number | null>(null);

  const filteredItems = () => {
    if (!searchQuery()) return items();
    const query = searchQuery().toLowerCase();
    return items().filter(item => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ name: '', category: '', price: '', stock: '', description: '', sku: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Product) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
      description: item.description || '',
      sku: item.sku || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const data = formData();
      const editing = editingItem();
      if (editing) {
        setItems(prev => prev.map(item =>
          item.id === editing.id
            ? { ...item, name: data.name, category: data.category, price: parseFloat(data.price), stock: parseInt(data.stock), description: data.description, sku: data.sku, status: parseInt(data.stock) > 0 ? 'Active' : 'Out of Stock' }
            : item
        ));
      } else {
        const newItem: Product = {
          id: Math.max(...items().map(i => i.id)) + 1,
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          description: data.description,
          sku: data.sku,
          status: parseInt(data.stock) > 0 ? 'Active' : 'Out of Stock',
        };
        setItems(prev => [...prev, newItem]);
      }
      setIsSaving(false);
      setIsModalOpen(false);
    }, 800);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setDeleteConfirm(null);
  };

  const stats = {
    total: items().length,
    active: items().filter(i => i.status === 'Active').length,
    outOfStock: items().filter(i => i.status === 'Out of Stock').length,
    totalValue: items().reduce((sum, i) => sum + i.price * i.stock, 0),
  };

  return (
    <div class="min-h-full bg-gray-50 p-6 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-emerald-600 p-2.5 shadow-lg shadow-emerald-500/25">
              <PackageIcon class="size-5 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage your product inventory</p>
            </div>
          </div>
          <Button color="blue" onClick={openCreateModal} class="shadow-lg shadow-blue-500/25">
            <span class="flex items-center gap-2">
              <PlusIcon class="size-4" />
              Add Product
            </span>
          </Button>
        </div>

        {/* Stats */}
        <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div class="rounded-xl border border-gray-200 bg-white p-4  dark:border-gray-700/50 dark:bg-gray-900/50">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BoxIcon class="size-5" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Products</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4  dark:border-gray-700/50 dark:bg-gray-900/50">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircleIcon class="size-5" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">In Stock</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4  dark:border-gray-700/50 dark:bg-gray-900/50">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <XCircleIcon class="size-5" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.outOfStock}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Out of Stock</p>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4  dark:border-gray-700/50 dark:bg-gray-900/50">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Tag01Icon class="size-5" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalValue.toLocaleString()}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div class="mb-6">
        <div class="relative max-w-md">
          <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm  transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700/50 dark:bg-gray-900/50 dark:text-white"
          />
        </div>
      </div>

      {/* Product Table */}
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl  dark:border-gray-700/50 dark:bg-gray-900/70">
        <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Product</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Category</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Price</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Stock</th>
              <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Status</th>
              <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <For each={filteredItems()}>
              {(item) => (
                <tr class="group transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:from-gray-700 dark:to-gray-800">
                        <PackageIcon class="size-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {item.category}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="font-semibold text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{item.stock} units</span>
                  </td>
                  <td class="px-6 py-4">
                    <Badge color={item.status === 'Active' ? 'success' : 'failure'} size="sm">
                      {item.status}
                    </Badge>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        class="rounded-lg p-2 text-gray-400 opacity-0 transition-all hover:bg-blue-100 hover:text-blue-600 group-hover:opacity-100 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                      >
                        <Edit02Icon class="size-4" />
                      </button>
                      <Show when={deleteConfirm() !== item.id}>
                        <button
                          onClick={() => setDeleteConfirm(item.id)}
                          class="rounded-lg p-2 text-gray-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        >
                          <Trash01Icon class="size-4" />
                        </button>
                      </Show>
                      <Show when={deleteConfirm() === item.id}>
                        <div class="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(item.id)}
                            class="rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            class="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </Show>
                    </div>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal show={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <div class="p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-emerald-600 p-2.5">
              <PackageIcon class="size-5 text-white" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {editingItem() ? 'Edit Product' : 'Add Product'}
            </h2>
          </div>

          <form class="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <TextInput
              id="name"
              label="Product Name"
              value={formData().name}
              onInput={(e) => setFormData(prev => ({ ...prev, name: e.currentTarget.value }))}
              placeholder="Enter product name"
            />

            <div class="grid grid-cols-2 gap-4">
              <TextInput
                id="category"
                label="Category"
                value={formData().category}
                onInput={(e) => setFormData(prev => ({ ...prev, category: e.currentTarget.value }))}
                placeholder="e.g. Electronics"
              />
              <TextInput
                id="sku"
                label="SKU"
                value={formData().sku}
                onInput={(e) => setFormData(prev => ({ ...prev, sku: e.currentTarget.value }))}
                placeholder="e.g. PRD-001"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <TextInput
                id="price"
                type="number"
                step="0.01"
                label="Price"
                value={formData().price}
                onInput={(e) => setFormData(prev => ({ ...prev, price: e.currentTarget.value }))}
                placeholder="0.00"
              />
              <TextInput
                id="stock"
                type="number"
                label="Stock"
                value={formData().stock}
                onInput={(e) => setFormData(prev => ({ ...prev, stock: e.currentTarget.value }))}
                placeholder="0"
              />
            </div>

            <Textarea
              id="description"
              label="Description"
              value={formData().description}
              onInput={(e) => setFormData(prev => ({ ...prev, description: e.currentTarget.value }))}
              placeholder="Product description..."
              rows={3}
            />

            <div class="flex justify-end gap-3 pt-4">
              <Button color="light" onClick={() => setIsModalOpen(false)} disabled={isSaving()}>
                Cancel
              </Button>
              <Button type="submit" color="blue" disabled={isSaving()}>
                <span class="flex items-center gap-2">
                  <Show when={isSaving()}>
                    <RefreshCw01Icon class="size-4 animate-spin" />
                  </Show>
                  <Show when={!isSaving()}>
                    <CheckIcon class="size-4" />
                  </Show>
                  {isSaving() ? 'Saving...' : editingItem() ? 'Save Changes' : 'Add Product'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

// ============================================================================
// Variant 2: Split Layout with Detail Panel
// ============================================================================
const CrudSplit = () => {
  const [items, setItems] = createSignal(initialProducts);
  const [selectedItem, setSelectedItem] = createSignal<Product | null>(initialProducts[0]);
  const [isEditing, setIsEditing] = createSignal(false);
  const [editData, setEditData] = createSignal({ name: '', category: '', price: '', stock: '', description: '', sku: '' });

  const startEdit = () => {
    const item = selectedItem();
    if (item) {
      setEditData({
        name: item.name,
        category: item.category,
        price: item.price.toString(),
        stock: item.stock.toString(),
        description: item.description || '',
        sku: item.sku || '',
      });
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    const item = selectedItem();
    const data = editData();
    if (item) {
      const updated: Product = {
        ...item,
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        description: data.description,
        sku: data.sku,
        status: parseInt(data.stock) > 0 ? 'Active' : 'Out of Stock',
      };
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      setSelectedItem(updated);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    const item = selectedItem();
    if (item) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItem(items()[0] || null);
    }
  };

  return (
    <div class="flex h-[700px] flex-col bg-gray-50 md:flex-row dark:bg-gray-900">
      {/* List Panel */}
      <div class="h-64 shrink-0 overflow-y-auto border-b border-gray-200 bg-white md:h-auto md:w-80 md:border-b-0 md:border-r lg:w-96 dark:border-gray-800 dark:bg-gray-900">
        <div class="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Products</h2>
            <Button color="blue" size="xs">
              <span class="flex items-center gap-1">
                <PlusIcon class="size-3.5" />
                Add
              </span>
            </Button>
          </div>
          <div class="relative mt-3">
            <SearchMdIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <For each={items()}>
            {(item) => (
              <button
                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                class={`w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedItem()?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div class="flex items-center gap-3">
                  <div class="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <PackageIcon class="size-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
                  </div>
                  <Badge color={item.status === 'Active' ? 'success' : 'failure'} size="sm">
                    {item.stock}
                  </Badge>
                </div>
              </button>
            )}
          </For>
        </div>
      </div>

      {/* Detail Panel */}
      <div class="flex-1 overflow-y-auto p-6">
        <Show when={selectedItem()}>
          {(item) => (
            <div>
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class="flex size-16 items-center justify-center rounded-2xl bg-emerald-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                    <PackageIcon class="size-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{item().name}</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">SKU: {item().sku}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Show when={!isEditing()}>
                    <Button color="light" size="sm" onClick={startEdit}>
                      <span class="flex items-center gap-1">
                        <Edit02Icon class="size-4" />
                        Edit
                      </span>
                    </Button>
                    <Button color="light" size="sm" onClick={handleDelete} class="text-red-600 hover:bg-red-50 dark:text-red-400">
                      <span class="flex items-center gap-1">
                        <Trash01Icon class="size-4" />
                        Delete
                      </span>
                    </Button>
                  </Show>
                </div>
              </div>

              <Show when={!isEditing()}>
                <div class="mt-8 grid grid-cols-2 gap-6">
                  <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">${item().price.toFixed(2)}</p>
                  </div>
                  <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</p>
                    <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{item().stock} units</p>
                  </div>
                  <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                    <p class="mt-1 text-lg font-medium text-gray-900 dark:text-white">{item().category}</p>
                  </div>
                  <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <div class="mt-2">
                      <Badge color={item().status === 'Active' ? 'success' : 'failure'} size="sm">
                        {item().status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div class="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p class="mt-2 text-gray-700 dark:text-gray-300">{item().description || 'No description provided.'}</p>
                </div>
              </Show>

              <Show when={isEditing()}>
                <div class="mt-8 space-y-4">
                  <TextInput
                    id="edit-name"
                    label="Product Name"
                    value={editData().name}
                    onInput={(e) => setEditData(prev => ({ ...prev, name: e.currentTarget.value }))}
                  />
                  <div class="grid grid-cols-2 gap-4">
                    <TextInput
                      id="edit-category"
                      label="Category"
                      value={editData().category}
                      onInput={(e) => setEditData(prev => ({ ...prev, category: e.currentTarget.value }))}
                    />
                    <TextInput
                      id="edit-sku"
                      label="SKU"
                      value={editData().sku}
                      onInput={(e) => setEditData(prev => ({ ...prev, sku: e.currentTarget.value }))}
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <TextInput
                      id="edit-price"
                      type="number"
                      label="Price"
                      value={editData().price}
                      onInput={(e) => setEditData(prev => ({ ...prev, price: e.currentTarget.value }))}
                    />
                    <TextInput
                      id="edit-stock"
                      type="number"
                      label="Stock"
                      value={editData().stock}
                      onInput={(e) => setEditData(prev => ({ ...prev, stock: e.currentTarget.value }))}
                    />
                  </div>
                  <Textarea
                    id="edit-description"
                    label="Description"
                    value={editData().description}
                    onInput={(e) => setEditData(prev => ({ ...prev, description: e.currentTarget.value }))}
                    rows={3}
                  />
                  <div class="flex justify-end gap-3 pt-4">
                    <Button color="light" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button color="blue" onClick={saveEdit}>
                      <span class="flex items-center gap-1">
                        <CheckIcon class="size-4" />
                        Save Changes
                      </span>
                    </Button>
                  </div>
                </div>
              </Show>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
};

// ============================================================================
// Variant 3: Compact Inline Edit
// ============================================================================
const CrudCompact = () => {
  const [items, setItems] = createSignal(initialProducts);
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [editData, setEditData] = createSignal({ name: '', price: '', stock: '' });
  const [isAdding, setIsAdding] = createSignal(false);
  const [newItem, setNewItem] = createSignal({ name: '', category: '', price: '', stock: '' });

  const startEdit = (item: Product) => {
    setEditingId(item.id);
    setEditData({ name: item.name, price: item.price.toString(), stock: item.stock.toString() });
  };

  const saveEdit = (id: number) => {
    const data = editData();
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, name: data.name, price: parseFloat(data.price), stock: parseInt(data.stock), status: parseInt(data.stock) > 0 ? 'Active' : 'Out of Stock' }
        : item
    ));
    setEditingId(null);
  };

  const addItem = () => {
    const data = newItem();
    if (data.name && data.price) {
      const item: Product = {
        id: Math.max(...items().map(i => i.id), 0) + 1,
        name: data.name,
        category: data.category || 'Uncategorized',
        price: parseFloat(data.price),
        stock: parseInt(data.stock) || 0,
        status: parseInt(data.stock) > 0 ? 'Active' : 'Out of Stock',
      };
      setItems(prev => [...prev, item]);
      setNewItem({ name: '', category: '', price: '', stock: '' });
      setIsAdding(false);
    }
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div class="min-h-full bg-white dark:bg-gray-900">
      <header class="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Inventory</h1>
          <Button
            color="dark"
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding()}
          >
            <span class="flex items-center gap-1">
              <PlusIcon class="size-4" />
              Add
            </span>
          </Button>
        </div>
      </header>

      <div class="p-6">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</th>
              <th class="pb-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</th>
              <th class="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</th>
              <th class="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Stock</th>
              <th class="pb-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
              <th class="pb-3" />
            </tr>
          </thead>
          <tbody>
            {/* Add Row */}
            <Show when={isAdding()}>
              <tr class="border-b border-gray-100 bg-blue-50/50 dark:border-gray-800 dark:bg-blue-900/10">
                <td class="py-3 pr-3">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={newItem().name}
                    onInput={(e) => setNewItem(prev => ({ ...prev, name: e.currentTarget.value }))}
                    class="w-full rounded border-0 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    autofocus
                  />
                </td>
                <td class="py-3 pr-3">
                  <input
                    type="text"
                    placeholder="Category"
                    value={newItem().category}
                    onInput={(e) => setNewItem(prev => ({ ...prev, category: e.currentTarget.value }))}
                    class="w-full rounded border-0 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="py-3 pr-3">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newItem().price}
                    onInput={(e) => setNewItem(prev => ({ ...prev, price: e.currentTarget.value }))}
                    class="w-20 rounded border-0 bg-white px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="py-3 pr-3">
                  <input
                    type="number"
                    placeholder="0"
                    value={newItem().stock}
                    onInput={(e) => setNewItem(prev => ({ ...prev, stock: e.currentTarget.value }))}
                    class="w-16 rounded border-0 bg-white px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="py-3" />
                <td class="py-3">
                  <div class="flex justify-end gap-1">
                    <button
                      onClick={addItem}
                      class="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                    >
                      <CheckIcon class="size-4" />
                    </button>
                    <button
                      onClick={() => { setIsAdding(false); setNewItem({ name: '', category: '', price: '', stock: '' }); }}
                      class="rounded bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <XCircleIcon class="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </Show>

            <For each={items()}>
              {(item) => (
                <tr class="group border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/50">
                  <Show when={editingId() === item.id}>
                    <td class="py-3 pr-3">
                      <input
                        type="text"
                        value={editData().name}
                        onInput={(e) => setEditData(prev => ({ ...prev, name: e.currentTarget.value }))}
                        class="w-full rounded border border-blue-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td class="py-3 pr-3 text-sm text-gray-600 dark:text-gray-300">{item.category}</td>
                    <td class="py-3 pr-3">
                      <input
                        type="number"
                        value={editData().price}
                        onInput={(e) => setEditData(prev => ({ ...prev, price: e.currentTarget.value }))}
                        class="w-20 rounded border border-blue-300 bg-white px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td class="py-3 pr-3">
                      <input
                        type="number"
                        value={editData().stock}
                        onInput={(e) => setEditData(prev => ({ ...prev, stock: e.currentTarget.value }))}
                        class="w-16 rounded border border-blue-300 bg-white px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td class="py-3 pr-3" />
                    <td class="py-3">
                      <div class="flex justify-end gap-1">
                        <button onClick={() => saveEdit(item.id)} class="rounded bg-blue-500 p-1 text-white hover:bg-blue-600">
                          <CheckIcon class="size-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} class="rounded bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">
                          <XCircleIcon class="size-4" />
                        </button>
                      </div>
                    </td>
                  </Show>

                  <Show when={editingId() !== item.id}>
                    <td class="py-3 pr-3">
                      <p class="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    </td>
                    <td class="py-3 pr-3 text-sm text-gray-600 dark:text-gray-300">{item.category}</td>
                    <td class="py-3 pr-3 text-right font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</td>
                    <td class="py-3 pr-3 text-right text-sm text-gray-600 dark:text-gray-300">{item.stock}</td>
                    <td class="py-3 pr-3 text-right">
                      <span class={`inline-flex items-center gap-1 text-sm ${
                        item.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        <span class={`size-1.5 rounded-full ${
                          item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {item.status === 'Active' ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td class="py-3">
                      <div class="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => startEdit(item)} class="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                          <Edit02Icon class="size-4" />
                        </button>
                        <button onClick={() => deleteItem(item.id)} class="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                          <Trash01Icon class="size-4" />
                        </button>
                      </div>
                    </td>
                  </Show>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// Code Examples
// ============================================================================
const crudModernCode = `import { createSignal, For, Show } from 'solid-js';
import { Button, TextInput, Modal, Badge, Textarea } from '@exowpee/solidly';
import { PackageIcon, PlusIcon, SearchMdIcon, Edit02Icon, Trash01Icon } from '@exowpee/solidly/icons';

export default function CrudModern() {
  const [items, setItems] = createSignal([...]);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingItem, setEditingItem] = createSignal(null);
  const [isSaving, setIsSaving] = createSignal(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Save logic...
      setIsSaving(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      {/* Header with Stats */}
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4">
          <p class="text-2xl font-bold">12</p>
          <p class="text-xs">Total Products</p>
        </div>
        {/* More stats... */}
      </div>

      {/* Table with glassmorphism */}
      <div class="rounded-2xl border border-gray-200 bg-white ">
        <table>
          <thead>...</thead>
          <tbody>
            <For each={items()}>
              {(item) => (
                <tr class="group hover:bg-blue-50/50">
                  <td>{item.name}</td>
                  <td>
                    <button onClick={() => openEditModal(item)}
                      class="opacity-0 group-hover:opacity-100">
                      <Edit02Icon />
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Modal with save animation */}
      <Modal isOpen={isModalOpen()}>
        <form onSubmit={handleSave}>
          <TextInput label="Product Name" />
          <Button disabled={isSaving()}>
            {isSaving() ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}`;

const crudSplitCode = `import { createSignal, Show } from 'solid-js';
import { Button, TextInput, Badge, Textarea } from '@exowpee/solidly';

export default function CrudSplit() {
  const [selectedItem, setSelectedItem] = createSignal(null);
  const [isEditing, setIsEditing] = createSignal(false);

  return (
    <div class="flex h-screen">
      {/* List Panel */}
      <div class="w-96 border-r overflow-y-auto">
        <For each={items()}>
          {(item) => (
            <button
              onClick={() => setSelectedItem(item)}
              class={selectedItem()?.id === item.id ? 'bg-blue-50' : ''}>
              <p>{item.name}</p>
              <Badge>{item.stock}</Badge>
            </button>
          )}
        </For>
      </div>

      {/* Detail Panel */}
      <div class="flex-1 p-6">
        <Show when={selectedItem()}>
          <Show when={!isEditing()}>
            <h1>{selectedItem().name}</h1>
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl border p-4">
                <p class="text-2xl font-bold">\${selectedItem().price}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </Show>

          <Show when={isEditing()}>
            <TextInput label="Name" value={editData().name} />
            <Button onClick={saveEdit}>Save Changes</Button>
          </Show>
        </Show>
      </div>
    </div>
  );
}`;

const crudCompactCode = `import { createSignal, For, Show } from 'solid-js';
import { Button } from '@exowpee/solidly';
import { Edit02Icon, Trash01Icon, CheckIcon, XCircleIcon, PlusIcon } from '@exowpee/solidly/icons';

export default function CrudCompact() {
  const [editingId, setEditingId] = createSignal(null);
  const [isAdding, setIsAdding] = createSignal(false);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({ name: item.name, price: item.price, stock: item.stock });
  };

  return (
    <div class="min-h-screen bg-white">
      <table>
        {/* Add Row */}
        <Show when={isAdding()}>
          <tr class="bg-blue-50/50">
            <td><input type="text" placeholder="Product name" autofocus /></td>
            <td><input type="number" placeholder="0.00" /></td>
            <td>
              <button onClick={addItem}><CheckIcon /></button>
              <button onClick={() => setIsAdding(false)}><XCircleIcon /></button>
            </td>
          </tr>
        </Show>

        {/* Inline Edit Rows */}
        <For each={items()}>
          {(item) => (
            <tr class="group hover:bg-gray-50">
              <Show when={editingId() === item.id}>
                <td><input value={editData().name} /></td>
                <td><input value={editData().price} /></td>
                <td>
                  <button onClick={() => saveEdit(item.id)}><CheckIcon /></button>
                </td>
              </Show>
              <Show when={editingId() !== item.id}>
                <td>{item.name}</td>
                <td>\${item.price}</td>
                <td class="opacity-0 group-hover:opacity-100">
                  <button onClick={() => startEdit(item)}><Edit02Icon /></button>
                  <button onClick={() => deleteItem(item.id)}><Trash01Icon /></button>
                </td>
              </Show>
            </tr>
          )}
        </For>
      </table>
    </div>
  );
}`;

export default function CrudInterfaceBlockPage() {
  return (
    <BlocksDocPage
      title="CRUD Interface"
      description="Complete create, read, update, delete interfaces with multiple layouts: modern card design with modal forms, split view with detail panel, or compact inline editing."
      category="Data Management"
      isPro
      variants={[
        {
          id: 'modern',
          title: 'Modern Card Layout',
          description: 'Glassmorphism design with modal form, stats dashboard, and delete confirmation.',
          component: CrudModern,
          code: crudModernCode,
        },
        {
          id: 'split',
          title: 'Split Layout',
          description: 'Master-detail view with list panel and inline form editing.',
          component: CrudSplit,
          code: crudSplitCode,
        },
        {
          id: 'compact',
          title: 'Compact Inline Edit',
          description: 'Minimal table with inline editing and quick add row.',
          component: CrudCompact,
          code: crudCompactCode,
        },
      ]}
      usedComponents={[
        { name: 'Button', path: '/components/button' },
        { name: 'TextInput', path: '/components/text-input' },
        { name: 'Textarea', path: '/components/textarea' },
        { name: 'Modal', path: '/components/modal' },
        { name: 'Badge', path: '/components/badge' },
      ]}
      relatedBlocks={[
        { name: 'Table View', path: '/blocks/data-management/table-view', description: 'Data table with selection and filters' },
        { name: 'Search & Filter', path: '/blocks/data-management/search-filter', description: 'Search and filter interface' },
        { name: 'List View', path: '/blocks/data-management/list-view', description: 'Card-based list layout' },
      ]}
    />
  );
}

// Export components for iframe preview
export { CrudModern, CrudSplit, CrudCompact };
