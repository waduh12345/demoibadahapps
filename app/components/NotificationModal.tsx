"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Trash2,
  CheckCheck,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "reminder" | "achievement" | "system";
  isRead: boolean;
  createdAt: string;
  icon?: string;
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Waktu Sholat Dzuhur",
    message:
      "Waktu sholat Dzuhur akan dimulai dalam 15 menit. Siapkan diri untuk sholat berjamaah.",
    type: "reminder",
    isRead: false,
    createdAt: "2024-01-15T12:00:00Z",
    icon: "🕌",
  },
  {
    id: "2",
    title: "Pencapaian Baru!",
    message:
      "Selamat! Anda telah menyelesaikan 7 hari berturut-turut membaca Al-Quran. Teruskan semangatnya!",
    type: "achievement",
    isRead: false,
    createdAt: "2024-01-15T10:30:00Z",
    icon: "🏆",
  },
  {
    id: "3",
    title: "Artikel Baru Tersedia",
    message:
      "Artikel 'Keutamaan Sholat Berjamaah di Masjid' telah dipublikasi. Baca sekarang untuk menambah ilmu.",
    type: "info",
    isRead: true,
    createdAt: "2024-01-15T09:15:00Z",
    icon: "📚",
  },
  {
    id: "4",
    title: "Pengingat Puasa Sunnah",
    message:
      "Besok adalah hari Senin. Jangan lupa untuk berpuasa sunnah Senin Kamis.",
    type: "reminder",
    isRead: false,
    createdAt: "2024-01-15T08:00:00Z",
    icon: "🌙",
  },
  {
    id: "5",
    title: "Update Aplikasi",
    message:
      "Versi terbaru IbadahApp telah tersedia dengan fitur kalender hijriyah yang lebih akurat.",
    type: "system",
    isRead: true,
    createdAt: "2024-01-14T16:45:00Z",
    icon: "🔄",
  },
  {
    id: "6",
    title: "Dzikir Pagi",
    message:
      "Waktunya untuk dzikir pagi. Mari mulai hari dengan mengingat Allah SWT.",
    type: "reminder",
    isRead: false,
    createdAt: "2024-01-14T06:00:00Z",
    icon: "☀️",
  },
  {
    id: "7",
    title: "Hadist Harian",
    message:
      "Hadist hari ini: 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah dia berkata baik atau diam.'",
    type: "info",
    isRead: true,
    createdAt: "2024-01-14T05:30:00Z",
    icon: "📖",
  },
  {
    id: "8",
    title: "Target Bulanan Tercapai",
    message:
      "Selamat! Anda telah mencapai target membaca 1 juz Al-Quran bulan ini. Pertahankan konsistensinya!",
    type: "achievement",
    isRead: false,
    createdAt: "2024-01-13T20:00:00Z",
    icon: "🎯",
  },
];

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
}: NotificationModalProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load notifications from localStorage
  useEffect(() => {
    if (mounted) {
      const savedNotifications = localStorage.getItem("notifications");
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error("Error parsing notifications:", error);
        }
      }
    }
  }, [mounted]);

  // Save notifications to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("notifications", JSON.stringify(notifications));
      } catch (error) {
        console.error("Error saving notifications:", error);
      }
    }
  }, [notifications, mounted]);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") {
      return !notification.isRead;
    }
    return true;
  });

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Get type icon and color
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "reminder":
        return { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-100" };
      case "achievement":
        return {
          icon: Star,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      case "info":
        return { icon: Info, color: "text-green-600", bgColor: "bg-green-100" };
      case "system":
        return {
          icon: AlertCircle,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
      default:
        return { icon: Bell, color: "text-gray-600", bgColor: "bg-gray-100" };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between font-comfortaa">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-awqaf-primary" />
              Notifikasi
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Tandai Semua
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Filter */}
        <div className="flex gap-2 pb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            Semua
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1"
          >
            Belum Dibaca
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-awqaf-foreground-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-card-foreground font-comfortaa mb-2">
                {filter === "unread"
                  ? "Tidak ada notifikasi baru"
                  : "Belum ada notifikasi"}
              </h3>
              <p className="text-sm text-awqaf-foreground-secondary font-comfortaa">
                {filter === "unread"
                  ? "Semua notifikasi telah dibaca"
                  : "Notifikasi akan muncul di sini"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const typeInfo = getTypeInfo(notification.type);
              const IconComponent = typeInfo.icon;

              return (
                <Card
                  key={notification.id}
                  className={`border-awqaf-border-light transition-all duration-200 ${
                    !notification.isRead ? "bg-accent-50" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.bgColor}`}
                      >
                        {notification.icon ? (
                          <span className="text-lg">{notification.icon}</span>
                        ) : (
                          <IconComponent
                            className={`w-5 h-5 ${typeInfo.color}`}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3
                            className={`font-semibold font-comfortaa ${
                              !notification.isRead
                                ? "text-card-foreground"
                                : "text-awqaf-foreground-secondary"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-awqaf-primary rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>

                        <p className="text-sm text-awqaf-foreground-secondary font-comfortaa line-clamp-2 mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-awqaf-foreground-secondary font-comfortaa">
                            {formatDate(notification.createdAt)}
                          </span>

                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 h-6 w-6"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="p-1 h-6 w-6"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
