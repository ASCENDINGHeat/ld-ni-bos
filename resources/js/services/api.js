/**
 * API Service for LD-NI-BOS PC E-Commerce
 * Connects frontend to Laravel REST backend
 */

const TOKEN_KEY = 'ld_auth_token';
const USER_KEY = 'ld_auth_user';

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function getStoredUser() {
    try {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch {
        return null;
    }
}

export function setStoredUser(user) {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
}

export function clearAuthStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Core fetch wrapper with auth header & error handling
 */
export async function apiFetch(endpoint, options = {}) {
    const token = getStoredToken();
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(endpoint, {
        ...options,
        headers,
    });

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const error = new Error(data?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.errors = data?.errors || {};
        error.data = data;
        throw error;
    }

    return data;
}

/**
 * Normalizes backend product data for frontend component consumption
 */
export function normalizeProduct(apiProduct) {
    if (!apiProduct) return null;

    const specsObj = apiProduct.specifications || {};
    const specsList = Object.entries(specsObj).map(
        ([key, val]) => `${key.replace(/_/g, ' ')}: ${val}`
    );

    const categorySlug = apiProduct.category?.slug || apiProduct.category || '';
    const categoryName = apiProduct.category?.name || apiProduct.categoryName || categorySlug;

    const cpuSocket = specsObj.socket || specsObj.cpu_socket || (specsObj.processor ? specsObj.processor.split(' ')[0] : null);
    const tdp = specsObj.tdp || specsObj.tdp_daya || specsObj.power_consumption || null;
    const chipset = specsObj.chipset || (specsObj.motherboard ? specsObj.motherboard.split(' ')[0] : null);
    const ramFormFactor = specsObj.tipe_memori || specsObj.form_factor || (specsObj.ram ? 'DDR5' : null);
    const warranty = specsObj.garansi || specsObj.warranty || 'Garansi Resmi';

    const stockCount = typeof apiProduct.stock === 'number' ? apiProduct.stock : 0;
    const inStock = Boolean(apiProduct.is_in_stock ?? (stockCount > 0));

    return {
        ...apiProduct,
        id: apiProduct.id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        type: apiProduct.type,
        brand: apiProduct.brand || 'Official',
        price: Number(apiProduct.price || 0),
        stockCount,
        stock: stockCount > 0 ? (stockCount <= 3 ? 'Stok Terbatas' : `${stockCount} Tersedia`) : 'Stok Habis',
        inStock,
        category: categorySlug,
        categoryName,
        categoryObj: apiProduct.category,
        description: apiProduct.description || '',
        specifications: specsObj,
        technicalSpecs: specsObj,
        specs: specsList,
        cpuSocket,
        tdp,
        chipset,
        ramFormFactor,
        warranty,
        image: apiProduct.image_url || null,
        gallery: (apiProduct.images && apiProduct.images.length > 0)
            ? apiProduct.images.map((img, idx) => ({ url: img, label: `Sudut ${idx + 1}` }))
            : (apiProduct.image_url ? [{ url: apiProduct.image_url, label: 'Tampak Utama' }] : []),
        badge: apiProduct.type === 'prebuilt' ? 'PC Siap Pakai' : (stockCount <= 3 && stockCount > 0 ? 'Stok Terbatas' : null),
        is_wishlisted: Boolean(apiProduct.is_wishlisted),
    };
}

/**
 * Normalizes backend cart item for frontend cart components
 */
export function normalizeCartItem(apiCartItem) {
    const product = normalizeProduct(apiCartItem.product);
    return {
        id: apiCartItem.id, // Cart item ID in DB
        cartItemId: apiCartItem.id,
        productId: apiCartItem.product_id,
        name: product?.name || 'Komponen PC',
        price: Number(apiCartItem.unit_price || product?.price || 0),
        quantity: apiCartItem.quantity,
        subtotal: Number(apiCartItem.subtotal || 0),
        image: product?.image,
        category: product?.category,
        categoryName: product?.categoryName,
        brand: product?.brand,
        stock: product?.stock,
        maxStock: product?.stockCount ?? 99,
        cpuSocket: product?.cpuSocket,
        ramFormFactor: product?.ramFormFactor,
        product,
    };
}

// ==========================================
// Category APIs
// ==========================================
export async function getCategories(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    const result = await apiFetch(`/api/categories${query ? `?${query}` : ''}`);
    return result.data || [];
}

// ==========================================
// Product APIs
// ==========================================
export async function getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params.type) searchParams.set('type', params.type);
    if (params.brand) searchParams.set('brand', params.brand);
    if (params.min_price) searchParams.set('min_price', params.min_price);
    if (params.max_price) searchParams.set('max_price', params.max_price);
    if (params.in_stock) searchParams.set('in_stock', '1');
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.per_page) searchParams.set('per_page', params.per_page);
    if (params.page) searchParams.set('page', params.page);

    const query = searchParams.toString();
    const result = await apiFetch(`/api/products${query ? `?${query}` : ''}`);
    return {
        data: (result.data || []).map(normalizeProduct),
        meta: result.meta || {},
        links: result.links || {},
    };
}

export async function getProductDetail(slug) {
    const result = await apiFetch(`/api/products/${encodeURIComponent(slug)}`);
    return normalizeProduct(result.data);
}

export async function getRelatedProducts(slug) {
    const result = await apiFetch(`/api/products/${encodeURIComponent(slug)}/related`);
    return (result.data || []).map(normalizeProduct);
}

// ==========================================
// Wishlist APIs
// ==========================================
export async function getWishlist() {
    const result = await apiFetch('/api/wishlist');
    return (result.data || []).map((item) => {
        const product = normalizeProduct(item.product);
        return {
            ...product,
            wishlistEntryId: item.id,
        };
    });
}

export async function addToWishlist(productId) {
    const result = await apiFetch('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
    });
    return result;
}

export async function toggleWishlist(productId) {
    const result = await apiFetch('/api/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
    });
    return result;
}

export async function removeFromWishlist(productId) {
    const result = await apiFetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
    });
    return result;
}

// ==========================================
// Cart APIs
// ==========================================
export async function getCart() {
    const result = await apiFetch('/api/cart');
    return {
        items: (result.items || []).map(normalizeCartItem),
        summary: result.summary || {
            total_unique_items: 0,
            total_quantity: 0,
            total_price: 0,
            formatted_total_price: 'Rp 0',
        },
    };
}

export async function addToCart(productId, quantity = 1) {
    const result = await apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
    });
    return {
        message: result.message,
        cartItem: result.cart_item ? normalizeCartItem(result.cart_item) : null,
    };
}

export async function updateCartItemQuantity(cartItemId, quantity) {
    const result = await apiFetch(`/api/cart/${cartItemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
    });
    return {
        message: result.message,
        cartItem: result.cart_item ? normalizeCartItem(result.cart_item) : null,
    };
}

export async function removeCartItem(cartItemId) {
    return await apiFetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
    });
}

export async function clearCart() {
    return await apiFetch('/api/cart', {
        method: 'DELETE',
    });
}

// ==========================================
// Auth & Profile APIs
// ==========================================
export async function getCurrentUserProfile() {
    const result = await apiFetch('/api/user');
    return result.data || result;
}

export async function logoutUser() {
    return await apiFetch('/api/logout', {
        method: 'POST',
    });
}
