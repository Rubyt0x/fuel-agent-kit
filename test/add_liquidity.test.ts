import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('add liquidity', async () => {
  if (!agent.addLiquidity) {
    console.warn("⚠ Skipping test: Mira Add Liquidity is disabled.");
    return;
  }

  console.log(
    await agent.addLiquidity({
      amount0: '0.0001',
      asset0Symbol: 'ETH',
      asset1Symbol: 'USDT',
    }),
  );
});

test('add liquidity via natural language', async () => {
  if (!agent.execute) {
    console.warn("⚠ Skipping test: AI Agent execution is disabled.");
    return;
  }

  console.log(
    await agent.execute(
      'Add liquidity into USDC/USDT pool for 0.1 USDC with 5% slippage',
    ),
  );
});
