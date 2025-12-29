"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import NotificationModal from "./NotificationModal";

// Define a more explicit type for a Notification object
interface Notification {
  isRead: boolean;
  id: string | number; // Assuming a notification has an ID
  title: string; // Assuming a notification has a title
  [key: string]: unknown; // Allow for other keys, but this is less preferred
}

export default function NotificationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load unread count from localStorage
  useEffect(() => {
    if (mounted) {
      const savedNotifications = localStorage.getItem("notifications");
      if (savedNotifications) {
        try {
          // Change the variable type to unknown first, which is safer
          const parsedData: unknown = JSON.parse(savedNotifications);
          
          // Use a type guard or assertion to confirm it's an array of Notification
          if (Array.isArray(parsedData)) {
            // Assert the type for the filter operation
            const notifications = parsedData as Notification[]; 
            const unread = notifications.filter((n) => !n.isRead).length;
            setUnreadCount(unread);
          } else {
             // Fallback if the data isn't an array (though this shouldn't happen)
             console.error("Parsed data is not an array.");
             setUnreadCount(5); // Default fallback
          }

        } catch (error) {
          console.error("Error parsing notifications:", error);
          setUnreadCount(5); // Default fallback
        }
      } else {
        // Default unread count from dummy data
        setUnreadCount(5);
      }
    }
  }, [mounted]);

  // Listen for storage changes to update unread count
  useEffect(() => {
    if (mounted) {
      const handleStorageChange = () => {
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
          try {
            // Change the variable type to unknown first
            const parsedData: unknown = JSON.parse(savedNotifications);
            
            // Use a type guard to confirm it's an array
            if (Array.isArray(parsedData)) {
                // Assert the type
                const notifications = parsedData as Notification[];
                const unread = notifications.filter((n) => !n.isRead).length;
                setUnreadCount(unread);
            }

          } catch (error) {
            console.error("Error parsing notifications:", error);
          }
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
        onClick={() => setIsModalOpen(true)}
      >
        <Bell className="w-5 h-5 text-awqaf-primary hover:text-awqaf-primary transition-colors duration-200" />
      </Button>
    );
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 rounded-full bg-accent-100 hover:bg-accent-200 hover:text-awqaf-primary transition-colors duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          <Bell className="w-5 h-5 text-awqaf-primary hover:text-awqaf-primary transition-colors duration-200" />
        </Button>

        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}