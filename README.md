# CookFlow — AI-Powered Recipe Platform

CookFlow is a modern recipe application that helps you cook with what you have. It features smart ingredient matching, AI-powered substitutions, and an intuitive cooking mode.

## Features

- **Recipe Discovery** — Browse, search, and filter recipes by cuisine, category, diet, and time
- **My Kitchen** — Track ingredients you have on hand
- **Smart Ingredient Matching** — See which recipes you can make with your current kitchen
- **AI Ingredient Substitution** — Get intelligent substitutions for missing ingredients based on what you have
- **Recipe Adaptation** — Adapt recipes with substitutions, see adapted ingredients and instructions
- **Cook Mode** — Step-by-step cooking with timers
- **Light/Dark Mode** — Full theme support
- **Responsive Design** — Works on mobile and desktop

## Architecture

```
src/
├── components/          # React components
│   ├── AdaptRecipeModal.jsx      # Substitution selection UI
│   ├── AdaptedIngredientList.jsx # Adapted ingredients display
│   ├── RecipeComparison.jsx      # Original vs adapted comparison
│   ├── SubstitutionOptionCard.jsx # Substitution option card
│   ├── ConfidenceBadge.jsx       # Confidence level badge
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useRecipeAdaptation.js    # Adapted recipe state management
│   ├── useSubstitutionState.js   # Substitution selection state
│   ├── useKitchen.js             # Kitchen ingredients management
│   └── useKitchenRecipes.js      # Recipe matching with kitchen
├── services/            # Business logic & API
│   ├── substitutionService.js    # Substitution engine (DB + AI)
│   ├── recipeService.js          # Recipe CRUD & search
│   └── ingredientService.js      # Ingredient management
├── utils/               # Utility functions
│   ├── ingredientMatcher.js      # Recipe-kitchen matching algorithm
│   ├── substitutionValidator.js  # AI response validation
│   └── ...
├── pages/               # Page components
│   ├── RecipeDetails.jsx         # Recipe view with adaptation
│   ├── Kitchen.jsx               # My Kitchen & recipe finder
│   ├── Explore.jsx               # Recipe browsing
│   └── ...
└── data/                # Static reference data
```

## Database Schema

The substitution system uses these tables (run `supabase/substitutions_schema.sql`):

- `ingredient_roles` — Ingredient role classifications (fat, liquid, acid, etc.)
- `ingredient_substitutions` — Curated substitution rules with ratios, conditions, confidence
- `user_adapted_recipes` — Persisted adapted recipes (optional, for authenticated users)

Seed data: `supabase/substitutions_seed.sql` (100+ common substitutions)

## AI Substitution Setup

The AI substitution feature uses a Supabase Edge Function (`supabase/functions/ai-substitution/`).

### Required Environment Variables (set in Supabase Dashboard)

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_API_KEY` | OpenAI API key (or compatible provider) | `sk-...` |
| `AI_MODEL` | Model to use | `gpt-4o-mini` |
| `AI_PROVIDER` | Provider name | `openai` |

### Deployment

```bash
# Deploy the edge function
supabase functions deploy ai-substitution

# Set secrets
supabase secrets set AI_API_KEY=your_key AI_MODEL=gpt-4o-mini AI_PROVIDER=openai
```

### How It Works

1. **Rule-First**: Checks curated substitution database for high-confidence matches
2. **AI Fallback**: Calls LLM for context-aware substitutions when no DB match
3. **Validation**: All responses validated against strict schema
4. **Caching**: Results cached locally for 24 hours
5. **Safety**: Rejects unsafe substitutions (structural ingredients, etc.)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Database Setup

Run these in Supabase SQL Editor in order:

1. `supabase/schema.sql` — Core schema
2. `supabase/seed.sql` — Reference data (cuisines, categories, etc.)
3. `supabase/recipes_seed.sql` — Recipe data
4. `supabase/substitutions_schema.sql` — Substitution tables
5. `supabase/substitutions_seed.sql` — Substitution rules

## Part 5 — AI Smart Ingredient Substitution

### User Flow

1. User views recipe with missing ingredients
2. Clicks "Adapt Recipe with AI"
3. System analyzes kitchen ingredients
4. Shows substitution options with confidence, taste/texture impact
5. User accepts/rejects each substitution
6. Adapted recipe saved locally, available for cooking

### Key Components

- **SubstitutionService** — Hybrid DB + AI engine with caching
- **AdaptRecipeModal** — 3-step UI: Loading → Selection → Review
- **RecipeComparison** — Toggle between Original/Adapted/Comparison views
- **Confidence Levels** — High (≥0.80), Medium (0.60-0.79), Low (<0.60)

### Safety Principles

- Never blindly trust LLM output
- Curated database for common substitutions
- AI only for reasoning, context adaptation, unusual cases
- Validation layer rejects unsafe substitutions
- Clear confidence scoring and warnings

## Testing Checklist

- [ ] Missing ingredient detection works with kitchen
- [ ] Common substitutions from database (Heavy Cream → Milk + Butter)
- [ ] Multi-ingredient substitutions supported
- [ ] AI generates context-aware substitutions
- [ ] Structured JSON AI responses
- [ ] Validation rejects malformed responses
- [ ] Confidence levels displayed correctly
- [ ] Quantities and units provided
- [ ] Taste/texture impact explained
- [ ] Accept/reject substitutions
- [ ] Multiple options per ingredient (max 3)
- [ ] Adapted ingredients generated
- [ ] Adapted cooking steps generated
- [ ] Original recipe preserved
- [ ] Original vs adapted comparison
- [ ] Reset to original works
- [ ] Serving changes scale substitutions
- [ ] Local persistence works
- [ ] AI API keys NOT in frontend
- [ ] AI failures don't break app
- [ ] Rule-based substitutions work without AI
- [ ] Existing features intact (search, kitchen, cook mode)
- [ ] Mobile UI works
- [ ] Dark mode works
- [ ] No console errors

## Future Compatibility

The AI service layer is designed to be reusable for:
- Part 6: Reel/YouTube → Recipe extraction
- Part 7: Advanced Cook Mode with adapted steps