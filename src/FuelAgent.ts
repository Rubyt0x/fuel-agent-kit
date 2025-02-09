let addLiquidity: ((params: AddLiquidityParams, privateKey: string) => Promise<any>) | undefined;
let swapExactInput: ((params: SwapExactInputParams, privateKey: string) => Promise<any>) | undefined;

async function loadMiraModules() {
  try {
      const miraAddLiquidity = await import('./mira/addLiquidity.js');
      addLiquidity = (params: AddLiquidityParams, privateKey: string) => {
          return miraAddLiquidity.addLiquidity(params, privateKey);
      };
  } catch (error) {
      console.warn("⚠ Mira Add Liquidity is disabled due to import issues.");
      addLiquidity = undefined;
  }

  try {
      const miraSwap = await import('./mira/swap.js');
      swapExactInput = (params: SwapExactInputParams, privateKey: string) => {
          return miraSwap.swapExactInput(params, privateKey);
      };
  } catch (error) {
      console.warn("⚠ Mira Swap functionality is disabled due to import issues.");
      swapExactInput = undefined;
  }
}

async function initialize() {
  await loadMiraModules(); // Load Mira dynamically
}

import { borrowAsset, type BorrowAssetParams } from './swaylend/borrow.js';
import {
  supplyCollateral,
  type SupplyCollateralParams,
} from './swaylend/supply.js';
import {
  transfer as walletTransfer,
  type TransferParams,
} from './transfers/transfers.js';
import { createAgent } from './agent.js';
import type { AgentExecutor } from 'langchain/agents';
import { getOwnBalance, type GetOwnBalanceParams } from './read/balance.js';
import type { modelMapping } from './utils/models.js';
import type { SwapExactInputParams } from './mira/swap.js';
import type { AddLiquidityParams } from './mira/addLiquidity.js';

initialize().catch(console.error);

export interface FuelAgentConfig {
  walletPrivateKey: string;
  model: keyof typeof modelMapping;
  openAiApiKey?: string;
  anthropicApiKey?: string;
  googleGeminiApiKey?: string;
}

export class FuelAgent {
  private walletPrivateKey: string;
  private agentExecutor: AgentExecutor;
  private model: keyof typeof modelMapping;
  private openAiApiKey?: string;
  private anthropicApiKey?: string;
  private googleGeminiApiKey?: string;

  constructor(config: FuelAgentConfig) {
    this.walletPrivateKey = config.walletPrivateKey;
    this.model = config.model;
    this.openAiApiKey = config.openAiApiKey;
    this.anthropicApiKey = config.anthropicApiKey;
    this.googleGeminiApiKey = config.googleGeminiApiKey;

    if (!this.walletPrivateKey) {
      throw new Error('Fuel wallet private key is required.');
    }

    this.agentExecutor = createAgent(
      this,
      this.model,
      this.openAiApiKey,
      this.anthropicApiKey,
      this.googleGeminiApiKey,
    );
  }

  getCredentials() {
    return {
      walletPrivateKey: this.walletPrivateKey,
      openAiApiKey: this.openAiApiKey || '',
      anthropicApiKey: this.anthropicApiKey || '',
      googleGeminiApiKey: this.googleGeminiApiKey || '',
    };
  }

  async execute(input: string) {
    const response = await this.agentExecutor.invoke({
      input,
    });

    return response;
  }

  async swapExactInput(params: SwapExactInputParams) {
    if (!swapExactInput) {
        throw new Error("Mira Swap is disabled due to import issues.");
    }
    return await swapExactInput(params, this.walletPrivateKey); // Pass privateKey
}

  async transfer(params: TransferParams) {
    return await walletTransfer(params, this.walletPrivateKey);
  }

  async supplyCollateral(params: SupplyCollateralParams) {
    return await supplyCollateral(params, this.walletPrivateKey);
  }

  async borrowAsset(params: BorrowAssetParams) {
    return await borrowAsset(params, this.walletPrivateKey);
  }

  async addLiquidity(params: AddLiquidityParams) {
    if (!addLiquidity) {
        throw new Error("Mira Add Liquidity is disabled due to import issues.");
    }
    return await addLiquidity(params, this.walletPrivateKey); // Pass privateKey
}

  async getOwnBalance(params: GetOwnBalanceParams) {
    return await getOwnBalance(params, this.walletPrivateKey);
  }
}
