"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useCheckoutTransactionMutation } from "@/services/public/store.service";
import { Transaction } from "@/types/public/store/transaction";
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

/* ================= Types ================= */

interface CartItem {
  id: number;
  name: string;
  price: number;
  markup_price: number;
  image: string;
  store: { id: number; name: string };
  quantity: number;
  stock: number;
}

type PaymentMethod = "manual" | "automatic";
type GatewayType = "qris" | "bank_transfer";
type GatewayBank = "bca" | "bni" | "bri" | "cimb" | "qris";

/* ================= Page ================= */

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useI18n();
  const locale = getCurrentLocale();
  const [checkoutTransaction, { isLoading: isSubmitting }] =
    useCheckoutTransactionMutation();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("automatic");
  const [gatewayType, setGatewayType] = useState<GatewayType>("qris");
  const [gatewayBank, setGatewayBank] = useState<GatewayBank>("qris");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postcode: "",
    notes: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push("/store/cart");
    }
  }, [router]);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group cart items by store_id
  const groupedCartData = useMemo(() => {
    const grouped: Record<number, CartItem[]> = {};
    cart.forEach((item) => {
      if (!grouped[item.store.id]) {
        grouped[item.store.id] = [];
      }
      grouped[item.store.id].push(item);
    });

    return Object.entries(grouped).map(([storeId, items]) => ({
      store_id: parseInt(storeId),
      details: items.map((item) => ({
        store_product_id: item.id,
        quantity: item.quantity,
      })),
    }));
  }, [cart]);

  const handleCheckout = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.postcode
    ) {
      setError(t("store.pleaseCompleteAllFields"));
      return;
    }

    setError(null);

    try {
      const checkoutData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postcode: formData.postcode,
        notes: formData.notes || undefined,
        payment_method: paymentMethod,
        gateway_type: paymentMethod === "automatic" ? gatewayType : undefined,
        gateway_bank:
          paymentMethod === "automatic" ? gatewayBank : undefined,
        data: groupedCartData,
      };

      const result = await checkoutTransaction(checkoutData).unwrap();
      setTransaction(result);
      setShowPaymentDialog(true);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : t("store.checkoutFailed");
      setError(errorMessage);
    }
  };

  const confirmPayment = () => {
    if (!transaction) return;

    const order = {
      id: transaction.id,
      reference: transaction.reference,
      date: transaction.created_at,
      items: cart,
      total: parseFloat(transaction.total_amount),
      payment_method: transaction.payment_method,
      payment_info: transaction.payment,
      payment_status: transaction.status,
      customer: formData,
    };

    const history = JSON.parse(
      localStorage.getItem("purchase_history") || "[]"
    );
    history.unshift(order);
    localStorage.setItem("purchase_history", JSON.stringify(history));

    localStorage.removeItem("cart");
    router.push("/store/checkout/success");
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-accent-100 pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="bg-background/90 backdrop-blur-md rounded-2xl border px-4 py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-awqaf-primary">
                {t("store.checkoutTitle")}
              </h1>
              <div className="w-10" />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-card-foreground">
              {t("store.customerInfo")}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">{t("store.nameRequired")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t("store.name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("store.emailRequired")} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t("store.email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("store.phoneRequired")} *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder={t("store.phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("store.addressRequired")} *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder={t("store.address")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">{t("store.postcodeRequired")} *</Label>
              <Input
                id="postcode"
                value={formData.postcode}
                onChange={(e) =>
                  setFormData({ ...formData, postcode: e.target.value })
                }
                placeholder={t("store.postcode")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("store.notesOptional")}</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder={t("store.notes")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-card-foreground">
              {t("store.paymentMethod")}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === "automatic" ? "default" : "outline"}
                onClick={() => setPaymentMethod("automatic")}
              >
                {t("store.automatic")}
              </Button>
              <Button
                variant={paymentMethod === "manual" ? "default" : "outline"}
                onClick={() => setPaymentMethod("manual")}
              >
                {t("store.manual")}
              </Button>
            </div>

            {paymentMethod === "automatic" && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t("store.gatewayType")}</Label>
                  <select
                    value={gatewayType}
                    onChange={(e) =>
                      setGatewayType(e.target.value as GatewayType)
                    }
                    className="w-full h-10 px-3 rounded-md border border-awqaf-border-light bg-background text-sm focus:outline-none focus:ring-2 focus:ring-awqaf-primary"
                  >
                    <option value="qris">{t("store.qris")}</option>
                    <option value="bank_transfer">
                      {t("store.bankTransfer")}
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>{t("store.selectBank")}</Label>
                  <select
                    value={gatewayBank}
                    onChange={(e) =>
                      setGatewayBank(e.target.value as GatewayBank)
                    }
                    className="w-full h-10 px-3 rounded-md border border-awqaf-border-light bg-background text-sm focus:outline-none focus:ring-2 focus:ring-awqaf-primary"
                  >
                    <option value="qris">{t("store.qris")}</option>
                    <option value="bca">{t("store.bca")}</option>
                    <option value="bni">{t("store.bni")}</option>
                    <option value="bri">{t("store.bri")}</option>
                    <option value="cimb">{t("store.cimb")}</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-card-foreground">
              Ringkasan Pesanan
            </h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-awqaf-foreground-secondary"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatRupiah(item.price * item.quantity, locale)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-awqaf-primary">
              <span>{t("store.totalAmount")}</span>
              <span>{formatRupiah(calculateTotal(), locale)}</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* BUTTON */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-4 z-50 shadow-lg border-t-2">
        <Button
          onClick={handleCheckout}
          disabled={isSubmitting}
          className="w-full h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("store.processing")}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {t("store.processPayment")}
            </>
          )}
        </Button>
      </div>

      {/* DIALOG */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("store.paymentInstructions")}</DialogTitle>
          </DialogHeader>

          {transaction?.payment && (
            <>
              {transaction.payment.payment_type === "qris" && (
                <div className="text-center space-y-3">
                  <Image
                    src={transaction.payment.account_number}
                    alt="QRIS"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                  <p className="text-xs">
                    {t("store.orderNumber")}: {transaction.reference}
                  </p>
                  <p className="text-xs text-awqaf-foreground-secondary">
                    {new Date(transaction.payment.expired_at).toLocaleString(
                      locale === "id" ? "id-ID" : locale === "en" ? "en-US" : locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : locale === "kr" ? "ko-KR" : "ja-JP"
                    )}
                  </p>
                </div>
              )}

              {transaction.payment.payment_type === "bank_transfer" && (
                <div className="space-y-2">
                  <p className="font-semibold">{transaction.payment.channel}</p>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono">
                      {transaction.payment.account_number}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleCopy(transaction.payment.account_number)
                      }
                    >
                      {copied ? "✔" : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="font-bold">
                    {t("store.totalAmount")}:{" "}
                    {formatRupiah(transaction.payment.amount, locale)}
                  </p>
                </div>
              )}

              <Button onClick={confirmPayment} className="w-full">
                {t("store.iHavePaid")}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
