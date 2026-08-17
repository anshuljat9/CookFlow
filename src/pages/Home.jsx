import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Zap, Search, Truck, Heart, Sparkles, Clock, Loader2 } from 'lucide-react';
import { getPopularRecipes, getQuickRecipes, getTrendingRecipes } from '../data/recipes';
import { cuisines } from '../data/categories';
import RecipeCard from '../components/RecipeCard';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import LoadingState from '../components/LoadingState';

const howItWorks = [
  {
    step: '01',
    icon: Search,
    title: 'Discover',
    description: 'Find recipes from videos, search by ingredients, or browse curated collections.'
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Adapt',
    description: 'Get smart substitutions, scale servings, and customize to your dietary needs.'
  },
  {
    step: '03',
    icon: ChefHat,
    title: 'Cook',
    description: 'Follow step-by-step cooking mode with timers, voice control, and music.'
  }
];

const features = [
  { icon: Zap, title: 'Quick Recipes', description: 'Meals ready in under 30 minutes' },
  { icon: Heart, title: 'Personalized', description: 'Recipes tailored to your pantry' },
  { icon: Truck, title: 'Smart Shopping', description: 'Generate grocery lists instantly' },
  { icon: Clock, title: 'Cooking Mode', description: 'Hands-free step-by-step guidance' },
];

export default function Home() {
  const popularRecipes = getPopularRecipes();
  const quickRecipes = getQuickRecipes();
  const trendingRecipes = getTrendingRecipes();

  const renderSection = (title, recipes, linkText, linkPath, icon) => (
    <section className="py-12 sm:py-16" aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id={title.toLowerCase().replace(/\s+/g, '-')} className="section-title">{title}</h2>
            <p className="section-subtitle">Curated just for you</p>
          </div>
          <Link to={linkPath} className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {linkText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <LoadingState variant="card" size="lg" />
        )}
        <Link to={linkPath} className="sm:hidden mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
          {linkText}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );

  return (
    <div className="animate-fade-in">
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-warm-50 to-transparent dark:from-charcoal-950 dark:to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23dcc9a3%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="container-custom relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>New: Import recipes from videos with AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 dark:text-warm-100 leading-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              From Scroll{' '}
              <span className="text-primary-600 dark:text-primary-400">to Plate.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-charcoal-600 dark:text-charcoal-300 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              Turn food inspiration into recipes you can actually cook. Discover, adapt, and cook with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/import">
                <Button size="lg" leftIcon={<Sparkles className="h-5 w-5" />} className="w-full sm:w-auto">
                  Import a Recipe
                </Button>
              </Link>
              <Link to="/kitchen">
                <Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />} className="w-full sm:w-auto">
                  What's in My Kitchen?
                </Button>
              </Link>
            </div>

            <div className="relative max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '400ms' }}>
              <SearchBar 
                placeholder="What are you craving? (e.g., chicken tikka, pasta carbonara...)"
                onSubmit={(q) => q && console.log('Search:', q)}
                onChange={() => {}}
                defaultValue=""
                className="w-full"
              />
              <p className="mt-3 text-sm text-charcoal-500 dark:text-charcoal-400">
                Search 10,000+ recipes by ingredient, cuisine, or dish name
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-50 dark:from-charcoal-950 to-transparent pointer-events-none" />
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-charcoal-900" aria-labelledby="features-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="section-title">Why CookFlow?</h2>
            <p className="section-subtitle">Built for the way you actually cook</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="card p-6 text-center group hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 dark:group-hover:bg-primary-600 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {renderSection('Popular Recipes', popularRecipes, 'View all popular', '/explore?sort=popular', Heart)}
      {renderSection('Quick & Easy', quickRecipes, 'View all quick', '/explore?time=under-30', Zap)}
      {renderSection('Trending Now', trendingRecipes, 'View trending', '/explore?sort=trending', Sparkles)}

      <section className="py-12 sm:py-16 bg-warm-50 dark:bg-charcoal-900" aria-labelledby="cuisines-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="cuisines-heading" className="section-title">Explore by Cuisine</h2>
            <p className="section-subtitle">Travel the world from your kitchen</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {cuisines.map(cuisine => (
              <Link 
                key={cuisine.id} 
                to={`/explore?cuisine=${cuisine.id}`}
                className="card-interactive aspect-square relative overflow-hidden p-6 flex flex-col items-center justify-center text-center group"
              >
                <span className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">{cuisine.icon}</span>
                <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cuisine.name}</h3>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="how-it-works-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="how-it-works-heading" className="section-title">How CookFlow Works</h2>
            <p className="section-subtitle">Three simple steps from inspiration to dinner</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {step.step}
                </div>
                <div className="pt-20">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-warm-100 mb-2">{step.title}</h3>
                  <p className="text-charcoal-500 dark:text-charcoal-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+8px)] right-[calc(50%+8px)] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 dark:bg-primary-700" aria-labelledby="cta-heading">
        <div className="container-custom text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start cooking?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of home cooks who've turned their food inspiration into delicious meals.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/import">
              <Button size="lg" variant="secondary" leftIcon={<Sparkles className="h-5 w-5" />} className="w-full sm:w-auto">
                Import Your First Recipe
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Browse Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}