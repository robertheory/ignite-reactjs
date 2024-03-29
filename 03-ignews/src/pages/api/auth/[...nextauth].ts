import { Expr, query } from "faunadb";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";

export default NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],
	jwt: {
		secret: process.env.SIGNING_KEY,
	},
	callbacks: {
		async session({ session }) {
			try {
				const userActiveSubscription = await fauna.query(
					query.Get(
						query.Intersection([
							query.Match(
								query.Index("subscription_by_user_ref"),
								query.Select(
									"ref",
									query.Get(
										query.Match(
											query.Index("user_by_email"),
											query.Casefold(session.user.email)
										)
									)
								)
							),
							query.Match(query.Index("subscription_by_status"), "active"),
						])
					)
				);

				return {
					...session,
					activeSubscription: userActiveSubscription,
				};
			} catch {
				return {
					...session,
					activeSubscription: null,
				};
			}
		},
		async signIn({ user, account, profile, email, credentials }) {
			try {
				await fauna.query(
					query.If(
						query.Not(
							query.Exists(
								query.Match(
									query.Index("user_by_email"),
									query.Casefold(user.email)
								)
							)
						),
						query.Create(query.Collection("users"), {
							data: { email: user.email },
						}),
						query.Get(
							query.Match(
								query.Index("user_by_email"),
								query.Casefold(user.email)
							)
						)
					)
				);

				return true;
			} catch {
				return false;
			}
		},
	},
});
