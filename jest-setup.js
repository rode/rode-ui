import "@testing-library/jest-dom";
import "jest-chain";
import Chance from "chance";

// eslint-disable-next-line no-unused-vars
const chance = new Chance();

// suppress logs
console.error = jest.fn();
