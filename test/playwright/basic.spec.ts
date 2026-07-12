// import { test, expect } from '@playwright/test';
// Import necessary Synpress modules and setup
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from "../wallet-setup/basic.setup"

// Create a test instance with Synpress and MetaMask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("TSender");
});

test("shows connect wallet message", async ({ page, context, metamaskPage, extensionId }) => {
    await page.goto("/");

    await expect(
        page.getByText("Please connect a wallet")
    ).toBeVisible();

    const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)
    await page.getByTestId('rk-connect-button').click()
    await page.getByTestId('rk-wallet-option-metaMask').waitFor({
      state: 'visible',
      timeout: 30000
    })
    await page.getByTestId('rk-wallet-option-metaMask').click()
    await metamask.connectToDapp()

    const customNetwork = {
      name: 'Anvil',
      rpcUrl: 'http://127.0.0.1:8545',
      chainId: 31337,
      symbol: 'ETH',
    }

    await metamask.addNetwork(customNetwork)

    await page.getByText("Token Address").waitFor({
    state: 'visible',
    timeout: 30000
  });
});
