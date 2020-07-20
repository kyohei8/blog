module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {}
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'active'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active']
  }
  // plugins: [require('@tailwindcss/custom-forms')]
};
