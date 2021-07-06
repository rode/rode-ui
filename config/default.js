module.exports = {
    app: {
        dev: true,
        secret: process.env.APP_SECRET,
        url: process.env.APP_URL || 'http://localhost:3000',
    },
    rode: {
        url: process.env.RODE_URL || 'http://localhost:50051',
    },
    oidc: {
        clientId: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        enabled: process.env.OIDC_ENABLED || false,
        issuerUrl: process.env.OIDC_ISSUER_URL,
        scope: process.env.OIDC_SCOPE || 'openid profile email',
    },
};
