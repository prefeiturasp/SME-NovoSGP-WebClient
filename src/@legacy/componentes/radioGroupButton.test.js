import React from "react";
import { render } from "@testing-library/react";
import RadioGroupButton from "./radioGroupButton";
describe("RadioGroupButton", () => {
  it("should render without crashing", () => {
    render(<RadioGroupButton />);
  });
});
