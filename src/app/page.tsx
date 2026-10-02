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
import styles from "./page.module.css";

export default function RootHomePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // First-time visit check: redirect to /login if user has not visited yet
    const visited = localStorage.getItem("neelsh_visited");
    if (!visited) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5" }} />;
  }

  const featured = getFeaturedProducts(8);

  return (
    <>
      {/* Hero: sticky so the contentStack slides over it on scroll */}
      <div className={styles.heroSlot}>
        <Hero />
      </div>

      {/* Everything below slides up and overlaps the hero */}
      <div className={styles.contentStack}>
        {/* New Arrival section right below the hero */}
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
