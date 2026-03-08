import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ToolCatalog from "@/components/ToolCatalog";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <ToolCatalog
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <BlogSection searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
