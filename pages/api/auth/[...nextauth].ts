// NextAuthDoc
// https://next-auth.js.org/

import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { GenericObject } from "next-auth/_utils";

export default NextAuth({
  // ログインに使用するAPIを指定
  // ログイン認証機能を実装するにはそれぞれのAPIでIDとシークレットキーが必要になる
  // [,]で複数可能
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      scope: "",
    }),
    // 複数可能
    /**
     *
     * Apple: Apple;
     * Auth0: Auth0;
     * Email: Email;
     * Facebook: Facebook;
     * GitHub: GitHub;
     * GitLab: GitLab;
     * Google: Google;
     * Slack: Slack;
     * Spotify: Spotify;
     * Twitter: Twitter;
     */
  ],
  callbacks: {
    /**
     * 説明
     * https://qiita.com/shizen-shin/items/c700b012b982ff9002e6
     * @param  {object} user     User object
     * @param  {object} account  Provider account
     * @param  {object} profile  Provider profile
     * @return {boolean|string}  Return `true` to allow sign in
     *                           Return `false` to deny access
     *                           Return `string` to redirect to (eg.: "/unauthorized")
     */
    // サインインした時のコンソールに[signIn]と表示する
    async signIn(_user, _account, _profile) {
      console.log("signIn!");
      return true;
    },
    /**
     * @param  {string} url      URL provided as callback URL by the client
     * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
     * @return {string}          URL the client will be redirect to
     */
    // 指定したURLに遷移する
    // 今回の場合はbaseURLなので、TOPに移動する
    // そしてコンソールに表示
    async redirect(url, baseUrl) {
      console.log("redirect!");
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    // JWT が作成・更新された時に実行する処理を記述
    async jwt(token, _user, account, _profile, _isNewUser) {
      console.log("jwt!");
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */

    // 操作した感じ、ログインが成功し、リダイレクトが完了したときにコンソールに出ている
    async session(session, token) {
      console.log("session!");
      // Add property to session, like an access_token from a provider.
      session.accessToken = (token as GenericObject).accessToken;
      return session;
    },
  },
});
