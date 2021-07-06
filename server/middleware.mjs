import config from 'config';
import {auth} from 'express-openid-connect';

export const oidc = () => {
    const {
        clientId,
        clientSecret,
        issuerUrl,
        scope,
    } = config.get('oidc');

    const {
        secret: appSecret,
        url: appUrl,
    } = config.get('app');

    return auth({
        authRequired: false,
        authorizationParams: {
            response_type: 'code',
            response_mode: 'form_post',
            scope: scope,
        },
        enableTelemetry: false,
        issuerBaseURL: issuerUrl,
        baseURL: appUrl,
        clientID: clientId,
        clientSecret: clientSecret,
        secret: appSecret,
        idpLogout: true,
    })
}

export const tokenRefresh = () => async (req, res, next) => {
    if (!req.oidc?.accessToken) {
        req.accessToken = null
        return next();
    }

    let accessToken = req.oidc.accessToken;

    const {isExpired, access_token: token, refresh} = accessToken;
    if (token && isExpired()) {
        console.log('token expired, refreshing');
        accessToken = await refresh();
        console.log('refreshed')
    }

    req.accessToken = accessToken.access_token
    next();
}
