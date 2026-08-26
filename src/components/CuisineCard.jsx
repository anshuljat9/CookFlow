import { Link } from 'react-router-dom';

export default function CuisineCard({ cuisine, className = '' }) {
  return (
    <Link
      to={`/explore?cuisine=${cuisine.id}`}
      className={`card-interactive aspect-square relative overflow-hidden p-6 flex flex-col items-center justify-center text-center group ${className}`}
      aria-label={`Explore ${cuisine.name} recipes`}
    >
      <span className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
        {cuisine.icon}
      </span>
      <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {cuisine.name}
      </h3>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
    </Link>
  );
}