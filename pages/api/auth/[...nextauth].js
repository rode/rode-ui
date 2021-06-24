import NextAuth from 'next-auth'
import * as sessionStorage from 'pages/api/utils/session';

export default NextAuth({
    providers: [
        {
            id: 'sso',
            name: 'sso',
            type: 'oauth',
            version: '2.0',
            scope: 'openid profile email',
            params: {grant_type: 'authorization_code'},
            accessTokenUrl: 'https://keycloak.local/auth/realms/rode-demo/protocol/openid-connect/token',
            requestTokenUrl: 'https://keycloak.local/auth/realms/rode-demo/protocol/openid-connect/auth',
            authorizationUrl: 'https://keycloak.local/auth/realms/rode-demo/protocol/openid-connect/auth?response_type=code',
            profileUrl: 'https://keycloak.local/auth/realms/rode-demo/protocol/openid-connect/userinfo',
            clientId: 'rode-ui',
            clientSecret: process.env.CLIENT_SECRET,
            profile: (profile) => {
                // console.log('profile?', profile)

                return {
                    ...profile,
                    id: profile.sub,
                    type: 'oauth',
                }
            },
        },
    ],
    callbacks: {
        jwt: async (token, user, account, profile, isNewUser) => {
            // console.log('token', token)
            // console.log('user', user)
            // console.log('account', account)
            // console.log('profile', profile)
            // console.log('isNewUser', isNewUser)

            if (account && account.id && account.accessToken) {
                token.accessToken = account.accessToken
                console.log('setting accessToken for ', account.id)
                console.log('accessToken', account.accessToken)
                // sessions[account.id] = account.accessToken
                sessionStorage.set(account.id, account.accessToken)
            }

            return token
        },
    },
    secret: 'abc123',
})
