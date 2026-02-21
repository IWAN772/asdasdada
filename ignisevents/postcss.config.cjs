// Try to load the new `@tailwindcss/postcss` PostCSS plugin if available
// (recent Tailwind releases moved the PostCSS entry to a separate package).
// Fallback to the classic `tailwindcss` plugin for older installs.
module.exports = {
  plugins: [
    // Use the core tailwindcss plugin for PostCSS processing (v3 compatible)
    require('tailwindcss'),
    require('autoprefixer')
  ]
}
