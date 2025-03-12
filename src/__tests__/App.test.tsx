import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// Mock the config file
jest.mock("../config", () => ({
  apiKey: "test_api_key",
  baseUrl: "https://localhost:7103",
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ description: "sunny" }),
  })
) as jest.Mock;

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the input fields and button", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Country")).toBeInTheDocument();
    expect(screen.getByText("Get Weather")).toBeInTheDocument();
  });

  test("fetches and displays weather data", async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Melbourne" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "AU" },
    });
    fireEvent.click(screen.getByText("Get Weather"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("Weather: sunny")).toBeInTheDocument()
    );
  });

  test("displays an error message when fetch fails", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Failed to fetch weather"),
      })
    );

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Melbourne" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "AU" },
    });
    fireEvent.click(screen.getByText("Get Weather"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("Error: Failed to fetch weather")
      ).toBeInTheDocument()
    );
  });

  test("displays an error message when city or country is not provided", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Get Weather"));

    await waitFor(() =>
      expect(
        screen.getByText("Error: City and Country are required")
      ).toBeInTheDocument()
    );
  });
});
