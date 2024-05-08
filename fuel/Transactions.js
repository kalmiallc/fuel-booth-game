const fuel = window.fuel || {};

const LATEST_TRANSACTIONS_QUERY = `
  query LatestTransactions {
    transactions(last: 15) {
      nodes {
        id
        inputs {
          __typename
          ... on InputCoin {
            owner
            utxoId
            amount
            assetId
          }
          ... on InputContract {
            utxoId
            contract {
              id
            }
          }
          ... on InputMessage {
            sender
            recipient
            amount
            data
          }
        }
        outputs {
          __typename
          ... on CoinOutput {
            to
            amount
            assetId
          }
          ... on ContractOutput {
            inputIndex
            balanceRoot
            stateRoot
          }
          ... on ChangeOutput {
            to
            amount
            assetId
          }
          ... on VariableOutput {
            to
            amount
            assetId
          }
          ... on ContractCreated {
            contract {
              id
            }
            stateRoot
          }
        }
        status {
          __typename
          ... on FailureStatus {
            reason
            programState {
              returnType
            }
          }
        }
      }
    }
  }`;

const MESSAGES_QUERY = `
  query MessageInfo($address: Address) {
    transactionsByOwner(owner: $address, first: 5) {
        nodes {
          amount
          sender
          recipient
          nonce
          data
          daHeight
        }
      }
    }`;


const TRANS_V_1_QUERY = `
  query Transactions($address: Address) {
    transactionsByOwner(owner: $address, first: 300) {
      nodes {
        id
        isScript
        rawPayload
        receipts {
          __typename
          ... on Receipt {
            receiptType
            data
          }
        }
      }
    }
  }
  `;
const address = "0xeeff1c9a4d500e3af174d0db0115ef2917d9e804e68009b5c1e12aeaffb1323c";


class FuelTransactions {
  timeouts = {
    boost: false,
  };
  constructor() {
    this.timeouts = { boost: false };
  }

  async read_address_events() {
    try {
      let response = await fetch('https://beta-5.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ 
          query: TRANS_V_1_QUERY,
          variables: {
            address: address
          }
         }),
        
      });
      let data = await response.json();
      console.log('Version  DEPLOYED RACE BOARD Transactions:', data["data"]["transactionsByOwner"]["nodes"]);
    } catch (error) {
      console.error('Failed to fetch time data:', error);
    }
  }

async read_last_events() {
    try {
      let response = await fetch('https://beta-5.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ 
          query: LATEST_TRANSACTIONS_QUERY
         }),
        
      });
      let data = await response.json();
      console.log('LATEST 15 FUEL TRANSACTIONS:', data["data"]["transactions"]["nodes"]);
    } catch (error) {
      console.error('Failed to fetch time data:', error);
    }
  }


  async onBoost() {
    console.log("boost");

    if (!this.timeouts.boost) {
      this.read_address_events();
      this.read_last_events();
      this.timeouts.boost = true;
      setTimeout(() => {
        this.timeouts.boost = false;
      }, 200);
    }
  }
}

fuel.Transactions = new FuelTransactions();
