export default {
  meEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  loginEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/login`,
  registerEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/register`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
