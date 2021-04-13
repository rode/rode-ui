import { When } from "cypress-cucumber-preprocessor/steps";
import * as selectors from "../../pages/index";

When(/^I click the "([^"]*)" button$/, (buttonName) => {
  const button = `${buttonName}Button`;
  cy.contains(selectors[button]).click();
});
