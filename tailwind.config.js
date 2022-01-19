module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      cursor: {
        'zoom-in': 'zoom-in'
      }
    }
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'active'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    lineClamp: ['responsive']
  },
  plugins: [
    require('@neojp/tailwindcss-line-clamp-utilities')
    // require('@tailwindcss/custom-forms')
  ],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
};
