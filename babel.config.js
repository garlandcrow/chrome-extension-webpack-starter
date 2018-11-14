const presets = [
  [
    "@babel/env",
    {
      targets: {
        chrome: "56",
      },
      useBuiltIns: "usage",
    },
  ],
]

module.exports = { presets }