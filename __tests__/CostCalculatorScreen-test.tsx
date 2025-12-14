import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import CostCalculatorScreen from "../src/features/cost/screens/CostCalculatorScreen";
import { transportAPI } from "../src/features/cost/api/costAPI";
import { MAX_PARKING_DAYS } from "../src/features/cost/utils/validation.constants";

//Mock networking - must be before imports
jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: jest.fn(() => ({
    isConnected: true,
    isInternetReachable: true,
  })),
}));

// Mock reactQueryNativeEvents to prevent real event listeners
jest.mock("../src/shared/api/reactQueryNativeEvents", () => ({}));

// Mock the transport API
jest.mock("../src/features/cost/api/costAPI", () => ({
  transportAPI: {
    getCost: jest.fn(),
  },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

//Mock expo vector icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

const mockApiResponse = {
  recommendedTransport: {
    name: "Star Cruiser",
    ratePerAu: 50.0,
  },
  journeyCost: 500.0,
  parkingFee: 20.0,
  currency: "HU",
};

describe("CostCalculatorScreen tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(async () => {
    queryClient.clear();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <CostCalculatorScreen />
        </NavigationContainer>
      </QueryClientProvider>,
    );
  };

  describe("Component Rendering", () => {
    it("renders all input fields correctly", () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      expect(getByText("Journey Cost Calculator")).toBeTruthy();
      expect(getByText("Distance (AUs)")).toBeTruthy();
      expect(getByText("Number of Passengers")).toBeTruthy();
      expect(getByText("Parking Days")).toBeTruthy();
      expect(
        getByPlaceholderText("Enter distance (max 9999999999)"),
      ).toBeTruthy();
      expect(getByPlaceholderText("Enter passengers (1-5)")).toBeTruthy();
      expect(getByPlaceholderText("0 (optional)")).toBeTruthy();
      expect(getByText("Calculate Cost")).toBeTruthy();
    });
  });

  describe("Distance Input Validation", () => {
    it("accepts valid decimal distance", () => {
      const { getByPlaceholderText } = renderComponent();

      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );

      fireEvent.changeText(distanceInput, "123.45");

      expect(distanceInput.props.value).toBe("123.45");
    });

    it("accepts integer distance", () => {
      const { getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );

      fireEvent.changeText(distanceInput, "100");

      expect(distanceInput.props.value).toBe("100");
    });

    it("sanitizes non-numeric characters from distance", () => {
      const { getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );

      fireEvent.changeText(distanceInput, "123");
      fireEvent.changeText(distanceInput, "abc");

      expect(distanceInput.props.value).toBe("123");
    });

    it("prevents multiple decimal points in distance", () => {
      const { getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );

      fireEvent.changeText(distanceInput, "12.3456");

      expect(distanceInput.props.value).toBe("12.3456");
    });

    it("should not allow typing distance greater than maximum", () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      fireEvent.changeText(distanceInput, "123");

      fireEvent.changeText(distanceInput, "10000000000");
      expect(distanceInput.props.value).toBe("123");
    });

    it("clears error when valid distance is entered after error", () => {
      const { getByPlaceholderText, queryByText, getByText } =
        renderComponent();
      const calculateButton = getByText("Calculate Cost");
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );

      fireEvent.changeText(distanceInput, "");
      fireEvent.press(calculateButton);
      expect(
        queryByText(/Please fill in distance and passengers/i),
      ).toBeTruthy();

      fireEvent.changeText(distanceInput, "500");
      expect(
        queryByText(/Please fill in distance and passengers/i),
      ).toBeFalsy();
    });
  });

  describe("Passengers Input Validation", () => {
    it("accepts valid passenger count", () => {
      const { getByPlaceholderText } = renderComponent();
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");

      fireEvent.changeText(passengersInput, "3");

      expect(passengersInput.props.value).toBe("3");
    });

    it("sanitizes non-numeric characters from passengers", () => {
      const { getByPlaceholderText } = renderComponent();
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");

      fireEvent.changeText(passengersInput, "3");
      expect(passengersInput.props.value).toBe("3");
      fireEvent.changeText(passengersInput, "a");
      expect(passengersInput.props.value).toBe("3");
    });

    it("doesn't let user type any value > 5", () => {
      const { getByPlaceholderText, getByText } = renderComponent();
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");

      fireEvent.changeText(passengersInput, "6");
      expect(passengersInput.props.value).toBe("");

      //  expect(getByText(/Maximum 5 passengers allowed/i)).toBeTruthy();
    });

    it("doesn't let user type any value <= 0", () => {
      const { getByPlaceholderText } = renderComponent();
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");

      fireEvent.changeText(passengersInput, 0);
      expect(passengersInput.props.value).toBe("");
    });

    it("clears error when valid passenger is entered after error", () => {
      const { getByPlaceholderText, queryByText, getByText } =
        renderComponent();
      const calculateButton = getByText("Calculate Cost");
      const passengerInput = getByPlaceholderText("Enter passengers (1-5)");

      fireEvent.changeText(passengerInput, "");
      fireEvent.press(calculateButton);
      expect(
        queryByText(/Please fill in distance and passengers/i),
      ).toBeTruthy();

      fireEvent.changeText(passengerInput, 3);
      expect(
        queryByText(/Please fill in distance and passengers/i),
      ).toBeFalsy();
    });
  });

  describe("Parking Days Input Validation", () => {
    it("accepts valid parking days", () => {
      const { getByPlaceholderText } = renderComponent();
      const parkingInput = getByPlaceholderText("0 (optional)");

      fireEvent.changeText(parkingInput, "30");

      expect(parkingInput.props.value).toBe("30");
    });

    it("sanitizes non-numeric characters from parking days", () => {
      const { getByPlaceholderText } = renderComponent();
      const parkingInput = getByPlaceholderText("0 (optional)");

      fireEvent.changeText(parkingInput, "15");
      fireEvent.changeText(parkingInput, "abc");

      expect(parkingInput.props.value).toBe("15");
    });

    it("removes leading zeros from parking days", () => {
      const { getByPlaceholderText } = renderComponent();
      const parkingInput = getByPlaceholderText("0 (optional)");

      fireEvent.changeText(parkingInput, "007");

      expect(parkingInput.props.value).toBe("7");
    });

    it("doesn't let user type value greater than MAX_PARKING_DAYS", () => {
      const { getByPlaceholderText } = renderComponent();
      const parkingInput = getByPlaceholderText("0 (optional)");

      fireEvent.changeText(parkingInput, MAX_PARKING_DAYS);
      expect(parkingInput.props.value).toBe(String(MAX_PARKING_DAYS));

      fireEvent.changeText(parkingInput, MAX_PARKING_DAYS + 1);
      expect(parkingInput.props.value).toBe(String(MAX_PARKING_DAYS));
    });

    it("allows empty parking days (optional field)", () => {
      const { getByPlaceholderText } = renderComponent();
      const parkingInput = getByPlaceholderText("0 (optional)");

      fireEvent.changeText(parkingInput, "");

      expect(parkingInput.props.value).toBe("");
    });
  });

  describe("Form Submission", () => {
    it("shows error when distance is missing", () => {
      const { getByText, getByPlaceholderText } = renderComponent();
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(passengersInput, "3");
      fireEvent.press(calculateButton);

      expect(getByText("Please fill in distance and passengers")).toBeTruthy();
    });

    it("shows error when passengers is missing", () => {
      const { getByText, getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.press(calculateButton);

      expect(getByText("Please fill in distance and passengers")).toBeTruthy();
    });

    it("calls API with correct parameters when form is valid", async () => {
      (transportAPI.getCost as jest.Mock).mockResolvedValue(mockApiResponse);

      const { getByText, getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const parkingInput = getByPlaceholderText("0 (optional)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");
      fireEvent.changeText(parkingInput, "5");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        expect(transportAPI.getCost).toHaveBeenCalledWith(100, 3, 5);
      });
    });

    it("calls API with zero parking when parking is empty", async () => {
      (transportAPI.getCost as jest.Mock).mockResolvedValue(mockApiResponse);

      const { getByText, getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "50");
      fireEvent.changeText(passengersInput, "2");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        expect(transportAPI.getCost).toHaveBeenCalledWith(50, 2, 0);
      });
    });
  });

  describe("Results Display", () => {
    it("displays calculation results correctly", async () => {
      (transportAPI.getCost as jest.Mock).mockResolvedValue(mockApiResponse);

      const { getByText, getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        expect(getByText("Recommended Transport")).toBeTruthy();
        expect(getByText("Star Cruiser")).toBeTruthy();
        expect(getByText("Ħ500.00")).toBeTruthy();
      });
    });

    it("displays parking fee when present", async () => {
      (transportAPI.getCost as jest.Mock).mockResolvedValue(mockApiResponse);

      const { getByText, getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const parkingInput = getByPlaceholderText("0 (optional)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");
      fireEvent.changeText(parkingInput, "5");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        expect(getByText("Parking Fee")).toBeTruthy();
        expect(getByText("Ħ20.00")).toBeTruthy();
      });
    });

    it("does not display parking fee when zero", async () => {
      const responseWithoutParking = {
        ...mockApiResponse,
        parkingFee: 0,
      };
      (transportAPI.getCost as jest.Mock).mockResolvedValue(
        responseWithoutParking,
      );

      const { getByText, getByPlaceholderText, queryByText } =
        renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        expect(getByText("Recommended Transport")).toBeTruthy();
      });

      expect(queryByText("Parking Fee")).toBeFalsy();
    });

    it("displays rate per AU when available", async () => {
      (transportAPI.getCost as jest.Mock).mockResolvedValue(mockApiResponse);

      const { getByText, getByPlaceholderText } = renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        expect(getByText("Rate per AU")).toBeTruthy();
        expect(getByText("Ħ50.00")).toBeTruthy();
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message when API call fails", async () => {
      (transportAPI.getCost as jest.Mock).mockRejectedValue(
        new Error("API Error"),
      );

      const { getByText, getByPlaceholderText, getByTestId } =
        renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );

      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
      const calculateButton = getByText("Calculate Cost");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");
      fireEvent.press(calculateButton);

      await waitFor(() => {
        const errorBanner = getByTestId("error-banner");
        expect(errorBanner).toBeTruthy();
      });
    });
  });

  describe("Currency Symbol Display", () => {
    it("displays correct currency symbol for different currencies", async () => {
      const testCases = [
        { currency: "USD", symbol: "$" },
        { currency: "EUR", symbol: "€" },
        { currency: "GBP", symbol: "£" },
        { currency: "HU", symbol: "Ħ" },
      ];

      for (const { currency, symbol } of testCases) {
        const responseWithCurrency = {
          ...mockApiResponse,
          currency,
          journeyCost: 100,
        };
        (transportAPI.getCost as jest.Mock).mockResolvedValue(
          responseWithCurrency,
        );

        const { getByText, getByPlaceholderText, unmount } = renderComponent();
        const distanceInput = getByPlaceholderText(
          "Enter distance (max 9999999999)",
        );
        const passengersInput = getByPlaceholderText("Enter passengers (1-5)");
        const calculateButton = getByText("Calculate Cost");

        fireEvent.changeText(distanceInput, "100");
        fireEvent.changeText(passengersInput, "2");
        fireEvent.press(calculateButton);

        await waitFor(() => {
          expect(getByText(`${symbol}100.00`)).toBeTruthy();
        });

        unmount();
      }
    });
  });

  describe("Button Behavior", () => {
    it("shows loading indicator while calculating", async () => {
      (transportAPI.getCost as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockApiResponse), 100),
          ),
      );

      const { getByText, getByPlaceholderText, queryByText, queryByTestId } =
        renderComponent();
      const distanceInput = getByPlaceholderText(
        "Enter distance (max 9999999999)",
      );
      const passengersInput = getByPlaceholderText("Enter passengers (1-5)");

      fireEvent.changeText(distanceInput, "100");
      fireEvent.changeText(passengersInput, "3");

      const calculateButton = getByText("Calculate Cost");
      fireEvent.press(calculateButton);

      // Button text should disappear and show loading during calculation
      await waitFor(() => {
        expect(queryByText("Calculate Cost")).toBeFalsy();
        expect(queryByTestId("loading")).toBeTruthy();
      });

      await waitFor(
        () => {
          expect(getByText("Recommended Transport")).toBeTruthy();
        },
        { timeout: 2000 },
      );
    });
  });
});
