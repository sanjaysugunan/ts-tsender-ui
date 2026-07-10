1. Create a basic react/nextjs application
2. Connect our wallet, with a nicer connect application
3. Implement this function
   ```javascript
   function airdropERC20(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
    )
    ```
4. Deploy to fleek

My recommendation for the build order

Now that the wallet connection is done, I'd work in this order:

✅ Wallet connect (already done)
✅ Install Tailwind
Build the page layout
Token address input
Recipient list input
Amount list input
Parse CSV/text into arrays
Calculate totalAmount
Token approval
Call airdropERC20
Show transaction status and success/error messages