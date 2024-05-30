const fuel = window.fuel || {};

const address = "0xe58df86a96a6d74bf4481657ed4b083d455df4aa05ae86a149f5d2b24db2262a";
const statusMessages = {
  0: "Racing Event",
  1: "Finished Event",
  2: "Destroyed Event"
};


const TRANS_V_1_QUERY_TRANSACTIONS_ID_FOR_ADDRESS = `
  query Transactions($address: Address) {
    transactionsByOwner(owner: $address, first: 3000) {
      nodes {
        id
      }
    }
  }
  `;

const TRANS_TRACK_EVENT_QUERY = `
  query Transactions($address: Address) {
    transactionsByOwner(owner: $address, first: 300) {
      nodes {
        receipts {
          __typename
          receiptType
          data
        }
      }
    }
  }
`;

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
          query: TRANS_V_1_QUERY_TRANSACTIONS_ID_FOR_ADDRESS,
          variables: {
            address: address
          }
         }),
        
      });
      let data = await response.json();
      if(show_data){
        console.log('#',data["data"]["transactionsByOwner"]["nodes"].length, 'TRX', data["data"]["transactionsByOwner"]["nodes"]);
      }
    } catch (error) {
      console.error('Failed to fetch time data:', error);
    }
  }


  
  async read_address_events_receipts() {

    const extractAndConvertValuesFromHex = (hexString) => {
      // Remove the '0x' prefix if present
      const cleanHex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    
      // Define the positions and lengths of the values to extract
      const positions = [
        { start: 0, length: 16 },
        { start: 16, length: 16 },
        { start: 32, length: 16 },
        { start: 48, length: 64 }  // This position (username-hash) will be skipped for number conversion
      ];
    
      // Extract values based on defined positions
      const hexValues = positions.map(pos => cleanHex.slice(pos.start, pos.start + pos.length));
    
      // Convert hex values to decimal, except for the last one (username-hash) which remains in hex
      const decimalValues = hexValues.slice(0, -1).map(value => parseInt(value, 16));
      const lastValue = hexValues[hexValues.length - 1];
    
      return [...decimalValues, lastValue];
    };
     
  // Function to filter and log track events
  const logTrackEvents = (logDataFields) => {
    logDataFields.forEach(hexString => {
      const values = extractAndConvertValuesFromHex(hexString);
      const status = values[1];
      const message = statusMessages[status];
      if (message) {
        console.log(`|${status}||${message}(Time: ${values[0]} Distance: ${values[2]})\nHash Identifier: ${values[3]}`);
      } else {
        console.log(`|${status}||Unknown Event(Time: ${values[0]} Distance: ${values[2]})\nHash Identifier: ${values[3]}`);
      }
    });
  };

    try {
      let response = await fetch('https://beta-5.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ 
          query: TRANS_TRACK_EVENT_QUERY,
          variables: {
            address: address
          }
         }),
        
      });
      let data = await response.json();
      // console.log(data);
      const transactions = data["data"]["transactionsByOwner"]["nodes"];

      // Flatten the array of receipts
      const allReceipts = transactions.flatMap(tx => tx.receipts);
  
      // Filter receipts by type 'LOG_DATA'
      const logDataReceipts = allReceipts.filter(receipt => receipt.receiptType === 'LOG_DATA');
      const logDataFields = logDataReceipts.map(receipt => receipt.data);

      
      logTrackEvents(logDataFields);
      
      // console.log(data["data"]["transactionsByOwner"]["nodes"]);

    } catch (error) {
      console.error('Failed to fetch receipts data:', error);
    }
  }

  async trigger_start_call(username, email) {
    console.log(`IN FUNCTION START CALL his_user_name: ${username}\nhis_email: ${email}`);
  }

  async trigger_dead_call(username, distance) {
    console.log(`IN FUNCTION DEAD CALL his_user_name: ${username}\ndistance: ${distance}`);
    if (username === "") {
      console.log('Aborting on Destroy call! Username is empty.\nSet: user("your_username").');
      return;
    } 
    const url = 'http://127.0.0.1:3002/users/score';
    const data = {
      username: username,
      time_seconds: 1,
      distance: distance,
      score_type: "DESTROYED",
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
          console.log('Destroyed score submitted successfully:');
          console.log('high-score ', result.data.high_score);
          console.log('+1 TRX ', result.data.transactionId);
      } else {
          console.error('Error submitting destroyed score:', result);
      }
  } catch (error) {
      console.error('Network error:', error);
  }
  }

  async trigger_finish_call(username, time_seconds) {
    //console.log(`IN FUNCTION FINISH CALL his_user_name: ${username}\ntime_seconds: ${time_seconds}\ndamage: ${damage}`);
    //console.log(`IN FUNCTION FINISH CALL`);
    if (username === "") {
      console.log('Aborting on Finish call! Username is empty.\nSet: user("your_username").');
      return;
    } 
    const url = 'http://127.0.0.1:3002/users/score';
    const data = {
        username: username,
        time_seconds: time_seconds,
        distance: 1,
        score_type: "FINISHED",
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
            console.log('Finished score submitted successfully:');
            console.log('high-score ', result.data.high_score);
            console.log('+1 TRX ', result.data.transactionId);
        } else {
            console.error('Error submitting final score:', result);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
  }

  async trigger_boost_call(username, time_seconds, distance) {
    if (username === "") {
      console.log('Aborting on boost call! Username is empty.\nSet: user("your_username").');
      return;
    }
    console.log(`${username} on B(${distance.toFixed(2)}), for ${time_seconds} seconds`);
   
    const url = 'http://127.0.0.1:3002/users/score';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          time_seconds: time_seconds,
          distance: distance,
          score_type: 'RACING',
        })
      });
      const data = await response.json();
      if (response.ok) {
        // console.log('Score tracked successfully at TRX:', data.data.transactionId);
        console.log('+1 TRX ', data.data.transactionId);
        this.read_address_events(true);
      } else {
        console.error('Error tracking score:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }
  async onBoost(time_seconds, distance) {
    const username = $("#player_username").val();
  
    if (!this.timeouts.boost) {
      this.trigger_boost_call(username, time_seconds, distance);
      this.timeouts.boost = true;
      setTimeout(() => {
        this.timeouts.boost = false;
      }, 200);
    }
  }


  async onStart(variable_temporary) {
    const username = $('#player_username').val();
    //this.trigger_start_call(username, variable_temporary);

    this.read_address_events_receipts();
    this.read_address_events(true);
    //calling with mock values
    // this.trigger_finish_call(username, 212+username.length);
    
  }

  async onDead(distance) {
    const username = $('#player_username').val();
    console.log(`On DEAD his_user_name: ${username}\ndistance: ${distance}`);

    this.trigger_dead_call(username, distance);

  }

  async onRaceFinish(time_seconds) {
    const username = $('#player_username').val();
    console.log(`On FINISH his_user_name: ${username}\ntime_seconds: ${time_seconds}`);

    this.trigger_finish_call(username, time_seconds);
  }
}

fuel.Transactions = new FuelTransactions();
