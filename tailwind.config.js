module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {}
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'active'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    lineClamp: ['responsive']
  },
  plugins: [
    require('@neojp/tailwindcss-line-clamp-utilities')
    // require('@tailwindcss/custom-forms')
  ]
};
