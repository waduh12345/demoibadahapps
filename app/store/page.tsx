"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  ShoppingCart,
  Store,
  ShoppingBag,
  History,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetPublicStoresQuery,
  useGetPublicProductsQuery,
  useGetPublicProductCategoriesQuery,
} from "@/services/public/store.service";
import { Product } from "@/types/public/store/product";
import { ProductCategory } from "@/types/public/store/category";
import { dummyProducts } from "./data/dummy-products";
import { useI18n } from "@/app/hooks/useI18n";
import { getCurrentLocale } from "@/lib/i18n";

/* ================= Utils ================= */

const formatRupiah = (num: number, locale: string = "id") => {
  const localeMap: Record<string, string> = {
    id: "id-ID",
    en: "en-US",
    ar: "ar-SA",
    fr: "fr-FR",
    kr: "ko-KR",
    jp: "ja-JP",
  };
  return new Intl.NumberFormat(localeMap[locale] || "id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const calculateDiscount = (price: number, markupPrice: number) => {
  if (markupPrice <= price) return 0;
  return Math.round(((markupPrice - price) / markupPrice) * 100);
};

/* ================= Constants ================= */

const sortOptions = [
  { value: "newest", label: "newest" },
  { value: "price_low", label: "priceLow" },
  { value: "price_high", label: "priceHigh" },
  { value: "name", label: "nameAZ" },
];

type CartItem = {
  id: number;
  quantity: number;
};

/* ================= Page ================= */

export default function StorePage() {
  const router = useRouter();
  const { t } = useI18n();
  const locale = getCurrentLocale();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /* ================= API ================= */

  const { data: storesData } = useGetPublicStoresQuery({
    page: 1,
    paginate: 100,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetPublicProductCategoriesQuery({
      page: 1,
      paginate: 100,
    });

  const { data: productsData, isLoading: isLoadingProducts } =
    useGetPublicProductsQuery({
      page: 1,
      paginate: 100,
      store_id: selectedStoreId,
    });

  /* ================= Cart ================= */

  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      const items: CartItem[] = cart ? JSON.parse(cart) : [];
      setCartCount(items.length);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  /* ================= Helper Functions ================= */

  // Get translated name from category based on locale
  const getCategoryName = (category: ProductCategory): string => {
    const translation = category.translations?.find((t) => t.locale === locale);
    return translation?.name || category.name;
  };

  // Get translated name from product based on locale
  const getProductName = (product: Product): string => {
    const translation = product.translations?.find((t) => t.locale === locale);
    return translation?.name || product.name;
  };

  /* ================= Products ================= */

  const allProducts = useMemo(() => {
    const apiProducts = productsData?.data || [];
    return apiProducts.length < 3
      ? [...apiProducts, ...dummyProducts]
      : apiProducts;
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      filtered = filtered.filter((p) => {
        const productName = getProductName(p).toLowerCase();
        return productName.includes(searchQuery.toLowerCase());
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        return p.store_product_category_id === selectedCategory;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  /* ================= Actions ================= */

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();

    const saved = localStorage.getItem("cart");
    const cart: CartItem[] = saved ? JSON.parse(saved) : [];

    const index = cart.findIndex((i) => i.id === product.id);

    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/store/${product.id}`);
  };

  /* ================= Render ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-20">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b">
        <div className="max-w-md mx-auto px-4 py-3 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-awqaf-primary rounded-lg flex items-center justify-center text-white">
                <Store className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-awqaf-primary">{t("store.title")}</h1>
            </div>

            <div className="flex gap-2">
              <Link href="/store/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/store/history">
                <Button variant="ghost" size="icon">
                  <History className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-9 rounded-full"
              placeholder={t("store.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Category */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{t("store.category")}</h3>
          <Button size="sm" variant="ghost" onClick={() => setShowFilters(true)}>
            <Filter className="w-4 h-4 mr-1" />
            {t("store.filter")}
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {/* All Category */}
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            📦 {t("store.all")}
          </Button>
          {/* API Categories */}
          {isLoadingCategories ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-gray-200 rounded animate-pulse"
              />
            ))
          ) : (
            categoriesData?.data.map((cat) => {
              const categoryName = getCategoryName(cat);
              return (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon || "📦"} {categoryName}
                </Button>
              );
            })
          )}
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4">
          {isLoadingProducts
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-gray-100 animate-pulse"
                />
              ))
            : filteredProducts.map((product) => {
                const discount = calculateDiscount(
                  product.price,
                  product.markup_price
                );
                const isInStock = product.stock > 0;

                return (
                  <Card
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder-image.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {discount}% {t("store.discount")}
                        </span>
                      )}
                    </div>

                    <CardContent className="p-3">
                      <Badge className="mb-1">{product.store.name}</Badge>
                      <h3 className="text-sm font-bold line-clamp-2">
                        {getProductName(product)}
                      </h3>
                      <p className="font-bold text-awqaf-primary">
                        {formatRupiah(product.price, locale)}
                      </p>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full"
                        disabled={!isInStock}
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {isInStock ? t("store.addToCart") : t("store.outOfStock")}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
        </div>
      </main>
    </div>
  );
}
