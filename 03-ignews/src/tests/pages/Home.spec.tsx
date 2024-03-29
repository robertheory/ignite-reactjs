import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("../../services/stripe");
jest.mock("next-auth/react", () => {
	return {
		useSession() {
			return {
				data: null,
				status: "unauthenticated",
			};
		},
	};
});

describe("Home page", () => {
	it("renders correctly", () => {
		render(
			<Home
				product={{
					price_id: "fake-price-id",
					amount: "R$10,00",
				}}
			/>
		);

		expect(screen.getByText(/R\$10\,00/)).toBeInTheDocument();
	});

	it("loads inital data", async () => {
		const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

		retrieveStripePricesMocked.mockResolvedValue({
			id: "fake-price-id",
			unit_amount: 1000,
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					product: {
						priceId: "fake-price-id",
						amount: "$10.00",
					},
				},
			})
		);
	});
});
