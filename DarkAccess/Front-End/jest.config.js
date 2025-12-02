module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!(react-router|react-router-dom|@remix-run)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
