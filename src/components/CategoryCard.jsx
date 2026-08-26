import { Link } from 'react-router-dom';

const CATEGORY_URL_MAP = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snacks: 'snacks',
  desserts: 'desserts',
  drinks: 'drinks',
};

const CATEGORY_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
  desserts: 'Desserts',
  drinks: 'Drinks',
};

export default function CategoryCard({ category, className = '' }) {
  const urlKey = CATEGORY_URL_MAP[category.id] || category.id;
  const label = CATEGORY_LABELS[category.id] || category.name;

  return (
    <Link
      to={`/explore?category=${category.id}`}
      className={`card-interactive aspect-square relative overflow-hidden p-6 flex flex-col items-center justify-center text-center group ${className}`}
      aria-label={`Explore ${label} recipes`}
    >
      <span className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
        {category.icon}
      </span>
      <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {label}
      </h3>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
    </Link>
  );
}