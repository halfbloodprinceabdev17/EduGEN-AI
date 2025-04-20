const plugin = require("tailwindcss/plugin");

const MyClass = plugin(function ({ addUtilities }) {
  addUtilities({
    ".perspective": {
      perspective: "1000px",
    },
    ".transform-style-preserve-3d": {
      "transform-style": "preserve-3d",
    },
    ".backface-hidden": {
      "backface-visibility": "hidden",
    },
    ".rotate-y-180": {
      transform: "rotateY(180deg)",
    },
  });
});

module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [MyClass],
  safelist: [
    {
      pattern:
        /(from|to|via|bg|text)-(blue|rose|yellow|orange|purple|teal)-(100|200|300|400|500|600|700|800|900)/,
      variants: ["hover", "focus"],
    },
  ],
};
