import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Chemix-Encyclopedia title", () => {
  render(<App />);

  const titleElement = screen.getByText(/Chemix-Encyclopedia/i);

  expect(titleElement).toBeInTheDocument();
});

test("renders scientific subtitle", () => {
  render(<App />);

  const subtitleElement = screen.getByText(
    /Interactive Scientific Chemistry Experience/i
  );

  expect(subtitleElement).toBeInTheDocument();
});