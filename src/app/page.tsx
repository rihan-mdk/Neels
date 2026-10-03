"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedStory from "@/components/home/FeaturedStory";
import CuratedCategories from "@/components/home/CuratedCategories";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BrandStatement from "@/components/home/BrandStatement";
import VisualJournal from "@/components/home/VisualJournal";
import ProductGrid from "@/components/products/ProductGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getFeaturedProducts } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function RootHomePage() {
  const router = useRouter();
  const { user, loading, isGuest } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    const visited = typeof window !== "undefined" ? localStorage.getItem("neelsh_visited") : null;

    if (!user && !isGuest && !visited) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [user, loading, isGuest, router]);

  if (loading || !checked) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5" }} />;
  }

  const featured = getFeaturedProducts(8);

  return (
    <>
      {/* Hero */}
      <div className={styles.heroSlot}>
        <Hero />
      </div>

      {/* Main Content Stack */}
      <div className={styles.contentStack}>
        <NewArrivals />
        <FeaturedStory />
        <CuratedCategories />
        <FeaturedCollections />

        {/* Featured Products */}
        <section className={styles.featuredProducts}>
          <div className={styles.inner}>
            <ScrollReveal>
              <SectionHeading
                title="Selected Pieces"
                subtitle="A curated selection from our current collections."
                centered
              />
            </ScrollReveal>
            <ProductGrid products={featured} columns={4} />
          </div>
        </section>

        <BrandStatement />
        <VisualJournal />
      </div>
    </>
  );
}
