# Features Directory

This directory contains self-contained feature modules that can be easily added or removed.

## Structure

Each feature follows this pattern:
- **Isolated**: All feature code stays within its folder
- **Self-contained**: Minimal dependencies on existing code
- **Easily removable**: Can be deleted without breaking core functionality

## Adding a New Feature

1. Create feature folder: `src/features/[feature-name]/`
2. Follow the template structure in `/FEATURE_TEMPLATE.md`
3. Add minimal integration points (routes, navigation)
4. Mark integration points with comments for easy removal

## Removing a Feature

1. Delete the feature folder
2. Remove route files
3. Remove navigation entries
4. Search for `// FEATURE: [feature-name]` comments and remove

## Current Features

- (No features yet - this is the baseline)

## Integration Points

Keep these minimal and clearly marked:
- Route files in `src/app/[feature-name]/`
- Navigation entries in `DashboardLayout.tsx`
- Global state hooks (if needed)
- Shared type exports (if needed)