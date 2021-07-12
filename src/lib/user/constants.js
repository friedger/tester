import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from "@stacks/blockchain-api-client";
import { StacksTestnet } from "@stacks/network";

export const local = false;
export const mocknet = true;
export const noSidecar = false;
export const mainnet = false;

export const authOrigin = "https://app.blockstack.org";

export const CONTRACT_ADDRESS = mainnet
  ? "SPB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6" //ADDR1 from Stacks.toml
  : "ST16KQ2VQSSJFGQJPNYC04P1SGVP77C760AJH38F2";
export const HODL_TOKEN_CONTRACT = "hodl-token";
export const GENUINE_CONTRACT_NAME = "genuine-v1";
export const MARKET_CONTRACT_NAME = "my-market-v5";
export const ROCKET_MARKET_CONTRACT_NAME = "rocket-market-v3";
export const ROCKET_FACTORY_CONTRACT_NAME = "rocket-factory-v5";
export const ROCKET_TOKEN_CONTRACT_NAME = "rocket-token";
export const POOL_REGISTRY_CONTRACT_NAME = "pool-registry-v2";
export const GENESIS_CONTRACT_ADDRESS = "ST000000000000000000002AMW42H";
export const BNS_CONTRACT_NAME = "bns";

export const STACK_API_URL = mainnet
  ? "https://stacks-node-api.testnet.stacks.co"
  : mocknet
  ? "http://localhost:3999"
  : "https://stacks-node-api.testnet.stacks.co";
export const STACKS_API_WS_URL = mainnet
  ? "https://stacks-node-api.testnet.stacks.co"
  : mocknet
  ? "http://localhost:3999"
  : "https://stacks-node-api.testnet.stacks.co";
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = new StacksTestnet();
NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
console.log(config);
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
