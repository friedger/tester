import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from "@stacks/blockchain-api-client";
import { StacksMainnet, StacksTestnet } from "@stacks/network";

export const mainnet = false;
export const mocknet = true;
export const localNode = mocknet;

//   console.log({ localNode, mocknet });

export const CONTRACT_ADDRESS = mainnet
  ? "SP39ZPD28F1TTDJWM2ZYGC86WHHBBVHTZ6HTGE1HG" //ADDR1 from Stacks.toml
  : "ST16KQ2VQSSJFGQJPNYC04P1SGVP77C760AJH38F2";
export const CLAMS_CONTRACT_NAME = "clams-v1";
export const GENUINE_CONTRACT_NAME = "genuine-v3";
export const MARKET_CONTRACT_NAME = "marketplace-v5";
export const GENESIS_CONTRACT_ADDRESS = "ST000000000000000000002AMW42H";
export const BNS_CONTRACT_NAME = "bns";

export const STACK_API_URL = localNode
  ? "http://localhost:3999"
  : mainnet
  ? "https://stacks-node-api.mainnet.stacks.co"
  : "https://stacks-node-api.testnet.stacks.co";

export const STACKS_API_WS_URL = localNode
  ? "http://localhost:3999"
  : mainnet
  ? "https://stacks-node-api.mainnet.stacks.co"
  : "https://stacks-node-api.testnet.stacks.co";

export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = mainnet ? new StacksMainnet() : new StacksTestnet();
NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
