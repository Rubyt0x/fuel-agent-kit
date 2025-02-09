let addLiquidity;
let swapExactInput;

async function loadMiraFunctions() {
    try {
        const miraAddLiquidity = await import('./mira/addLiquidity.js');
        addLiquidity = miraAddLiquidity.addLiquidity;
    } catch (error) {
        console.warn("⚠ Mira Add Liquidity is disabled.");
    }

    try {
        const miraSwap = await import('./mira/swap.js');
        swapExactInput = miraSwap.swapExactInput;
    } catch (error) {
        console.warn("⚠ Mira Swap is disabled.");
    }
}

await loadMiraFunctions(); // Load Mira dynamically
