import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, ArrowRight } from "lucide-react";
import { useCauses, Cause } from "@/hooks/useCauses";
import causeEducation from "@/assets/cause-education.jpg";
import causeElderly from "@/assets/cause-elderly.jpg";
import causeWater from "@/assets/cause-water.jpg";
import causeHealth from "@/assets/cause-health.jpg";
import causeFood from "@/assets/cause-food.jpg";
import causeEnvi from "@/assets/cause-environment.jpg";

const categories = ["All", "Education", "Healthcare", "Elderly Care", "Clean Water", "Food Security", "Environment"];

// Category to image mapping
const categoryImages: Record<string, string> = {
  "Education": causeEducation,
  "Elderly Care": causeElderly,
  "Clean Water": causeWater,
  "Healthcare": causeHealth,
  "Food Security": causeFood,
  "Environment": causeEnvi,
};

// Static fallback data with categories
const staticCauses: (Cause & { category?: string })[] = [
  {
    id: "static-1",
    title: "Senior Care Initiative",
    description: "Providing companionship and essential services to elderly community members living alone.",
    image_url: causeElderly,
    raised_amount: 45000,
    target_amount: 75000,
    ngo_id: "static-ngo-1",
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    ngo: { name: "Care Foundation" },
    category: "Elderly Care",
  },
  {
    id: "static-2",
    title: "Education for Every Child",
    description: "Supplying educational materials and building schools in underserved communities worldwide.",
    image_url: causeEducation,
    raised_amount: 128500,
    target_amount: 150000,
    ngo_id: "static-ngo-2",
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    ngo: { name: "Bright Future Academy" },
    category: "Education",
  },
  {
    id: "static-3",
    title: "Clean Water Project",
    description: "Building sustainable water wells and filtration systems in water-scarce regions.",
    image_url: causeWater,
    raised_amount: 89000,
    target_amount: 100000,
    ngo_id: "static-ngo-3",
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    ngo: { name: "Water for Life" },
    category: "Clean Water",
  },
  {
    id: "static-4",
    title: "Community Health Clinic",
    description: "Providing free healthcare services and medicines to underprivileged families.",
    image_url: causeHealth,
    raised_amount: 67000,
    target_amount: 120000,
    ngo_id: "static-ngo-4",
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    ngo: { name: "Health First Foundation" },
    category: "Healthcare",
  },
  {
    id: "static-5",
    title: "Zero Hunger Campaign",
    description: "Distributing nutritious meals to homeless and hungry families every day.",
    image_url: causeFood,
    raised_amount: 95000,
    target_amount: 200000,
    ngo_id: "static-ngo-5",
    is_active: true,
    start_date: null,
    end_date: null,
    created_at: "",
    ngo: { name: "Food For All" },
    category: "Food Security",
  },
];

const CausesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { data: dbCauses, isLoading } = useCauses();

  // Use database causes if available, otherwise use static data
  const allCauses = dbCauses && dbCauses.length > 0 ? dbCauses : staticCauses;

  // Filter by search and category
  const filteredCauses = allCauses.filter((cause: any) => {
    const matchesSearch = cause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Match category - check if cause has category field or infer from title
    let causeCategory = cause.category || "Education";
    if (!cause.category) {
      // Infer category from title for static data
      const title = cause.title.toLowerCase();
      if (title.includes("senior") || title.includes("elderly")) causeCategory = "Elderly Care";
      else if (title.includes("water")) causeCategory = "Clean Water";
      else if (title.includes("health") || title.includes("clinic")) causeCategory = "Healthcare";
      else if (title.includes("food") || title.includes("hunger")) causeCategory = "Food Security";
      else if (title.includes("environment") || title.includes("green")) causeCategory = "Environment";
      else causeCategory = "Education";
    }
    
    const matchesCategory = selectedCategory === "All" || causeCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getImageUrl = (cause: any, index: number) => {
    if (cause.image_url && !cause.image_url.startsWith('static')) return cause.image_url;
    const category = cause.category || "Education";
    return categoryImages[category] || [causeEducation, causeElderly, causeWater][index % 3];
  };

  const getCauseCategory = (cause: any) => {
    if (cause.category) return cause.category;
    const title = cause.title.toLowerCase();
    if (title.includes("senior") || title.includes("elderly")) return "Elderly Care";
    if (title.includes("water")) return "Clean Water";
    if (title.includes("health") || title.includes("clinic")) return "Healthcare";
    if (title.includes("food") || title.includes("hunger")) return "Food Security";
    if (title.includes("environment") || title.includes("green")) return "Environment";
    return "Education";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="py-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Browse All Causes
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover verified campaigns and find causes that resonate with your heart.
                Every donation makes a difference.
              </p>

              {/* Search */}
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search causes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredCauses.length}</span> causes
              </p>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}

            {/* Causes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCauses.map((cause, index) => (
                <Link
                  key={cause.id}
                  to={`/donate/${cause.id}`}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 border border-border/50">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={getImageUrl(cause, index)}
                        alt={cause.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground">
                          {getCauseCategory(cause)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {cause.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {cause.description}
                      </p>

                      {/* Progress */}
                      <div className="space-y-2">
                        <Progress value={(Number(cause.raised_amount) / Number(cause.target_amount)) * 100} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            ₹{Number(cause.raised_amount).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of ₹{Number(cause.target_amount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <span>by {cause.ngo?.name || "Partner NGO"}</span>
                        </div>
                        <Button variant="hero" size="sm">
                          Donate
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCauses.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No causes found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CausesPage;
