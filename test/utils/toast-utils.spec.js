import { toast } from "react-toastify";
import { showError, showSuccess } from "utils/toast-utils";

jest.mock("react-toastify");

describe("toast utils", () => {
  let message;

  beforeEach(() => {
    message = chance.sentence();
  });

  describe("showSuccess", () => {
    it("should show the toast with the correct options passed", () => {
      showSuccess(message);

      expect(toast).toHaveBeenCalledWith(message, {
        className: expect.stringContaining("success"),
      });
    });
  });

  describe("showError", () => {
    it("should show the toast with the correct options passed", () => {
      showError(message);

      expect(toast).toHaveBeenCalledWith(message, {
        className: expect.stringContaining("error"),
      });
    });
  });
});
