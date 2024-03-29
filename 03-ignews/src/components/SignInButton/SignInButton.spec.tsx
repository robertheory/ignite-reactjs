import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";
import { mocked } from "jest-mock";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
	it("renders correctly when user isn't autheticated", () => {
		const useSessionMocked = mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: "unauthenticated",
		});

		render(<SignInButton />);

		expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
	});

	it("renders correctly when user is autheticated", () => {
		const useSessionMocked = mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: {
				user: {
					name: "John Doe",
					email: "john.doe@example.com",
					image: "",
				},
				expires: "fake-expires",
			},
			status: "authenticated",
		});

		render(<SignInButton />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});
});
