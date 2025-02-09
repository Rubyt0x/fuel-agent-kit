import { test, beforeEach } from 'vitest';
import { createTestAgent, type FuelAgentType } from './setup.js';

let agent: FuelAgentType;

beforeEach(() => {
  agent = createTestAgent();
});

test('swap exact input', async () => {
  if (!agent.swapExactInput) {
    console.warn("⚠ Skipping test: Mira Swap is disabled.");
    return;
  }

  console.log(
    await agent.swapExactInput({
      amount: '0.0001',
      fromSymbol: 'ETH',
      toSymbol: 'USDC',
    }),
  );
});

test('swap via natural language', async () => {
  if (!agent.execute) {
    console.warn("⚠ Skipping test: AI Agent execution is disabled.");
    return;
  }

  console.log(await agent.execute('Swap 0.1 USDC to ETH with 5% slippage'));
});
