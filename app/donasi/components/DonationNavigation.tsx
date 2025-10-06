"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { DonationCategory } from "../data/donations";
import Link from "next/link";

interface DonationNavigationProps {
  categories: DonationCategory[];
}

export default function DonationNavigation({
  categories,
}: DonationNavigationProps) {
  return (
    <div className="space-y-4">
      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="border-awqaf-border-light hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{category.icon}</div>
                  <ArrowRight className="w-4 h-4 text-awqaf-foreground-secondary group-hover:text-awqaf-primary transition-colors duration-200" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-card-foreground text-sm font-comfortaa">
                    {category.name}
                  </h4>
                  <p className="text-xs text-awqaf-foreground-secondary font-comfortaa line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Motivational Quote */}
      <Card className="border-awqaf-border-light bg-gradient-to-r from-accent-100 to-accent-200">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-awqaf-primary font-comfortaa mb-1">
            &quot;Sesungguhnya sedekah itu akan memadamkan panas kubur bagi
            pelakunya&quot;
          </p>
          <p className="text-xs text-awqaf-foreground-secondary font-tajawal">
            - HR. Thabrani
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
