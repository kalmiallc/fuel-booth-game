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
      }
    }
  }
  `;
const TRANS_V_2_QUERY = `
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

  async read_address_events(show_data) {
    // this.read_address_events();
    // READS the last transtactions of an address (that triggered the event - The System Wallet)
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
      if(show_data){
        console.log('Transactions for: ', address, data["data"]["transactionsByOwner"]["nodes"]);
      }
    } catch (error) {
      console.error('Failed to fetch time data:', error);
    }
  }

  async trigger_start_call(username, email) {
    console.log(`IN FUNCTION START CALL his_user_name: ${username}\nhis_email: ${email}`);
  }

  async trigger_dead_call(username, email) {
    console.log(`IN FUNCTION DEAD CALL his_user_name: ${username}\nhis_email: ${email}`);
  }

  async trigger_finish_call(username, time_seconds, damage) {
    console.log(`IN FUNCTION FINISH CALL his_user_name: ${username}\ntime_seconds: ${time_seconds}\ndamage: ${damage}`);
    //console.log(`IN FUNCTION FINISH CALL`);
    if (username === "") {
      console.log('Aborting on Finish call! Username is empty.\nSet: user("your_username").');
      return;
    } 
    const url = 'http://127.0.0.1:3002/final-score-user';
    const data = {
        username: username,
        time_seconds: time_seconds,
        damage: damage
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Final score submitted successfully at TRX:', result.data.transactionId);
        } else {
            console.error('Error submitting final score:', result);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
  }

  async read_last_events() {
    // reads all last events from chain
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

  async trigger_boost_call(username, time_seconds, damage, distance, speed) {
    
    if (username === "") {
        console.log('Aborting on boost call! Username is empty.\nSet: user("your_username").');
        return;
    } 
    console.log(`Calling on Boost\nusername: ${username}\ntime_seconds: ${time_seconds}\ndamage: ${damage}\ndistance: ${distance}\nspeed: ${speed}`);
        
    const url = `http://127.0.0.1:3002/track-score-user/${username}?time_seconds=${time_seconds}&damage=${damage}&distance=${distance}&speed=${speed}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            console.log('Score tracked successfully at TRX:', data.data.transactionId);
            this.read_address_events(true);
        } else {
            console.error('Error tracking score:', data);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
  }

  async onBoost(time_seconds, damage, distance, speed) {
    const username = $('#player_username').val();
  
    if (!this.timeouts.boost) {
      //this.read_address_events(false);
      this.trigger_boost_call(username, time_seconds, damage, distance, speed);
      this.timeouts.boost = true;
      setTimeout(() => {
        this.timeouts.boost = false;
      }, 200);
    }
  }


  async onStart(variable_temporary) {
    const username = $('#player_username').val();
    //console.log(`On START his_user_name: ${username}\ndata 1: ${variable_temporary}`);
    this.read_address_events(true);
    this.trigger_finish_call(username, 622, 2);
    //this.trigger_start_call(username, variable_temporary);

  }

  async onDead(variable_temporary) {
    const his_user_name = $('#player_username').val();
    console.log(`On DEAD his_user_name: ${his_user_name}\ndata 1: ${variable_temporary}`);

    this.trigger_dead_call(his_user_name, variable_temporary);

  }

  async onRaceFinish(time_seconds, damage) {
    const username = $('#player_username').val();
    console.log(`On FINISH his_user_name: ${username}\ntime_seconds: ${time_seconds}\ndamage: ${damage}`);

    this.trigger_finish_call(username, time_seconds, damage);
  }
}

fuel.Transactions = new FuelTransactions();
