const fuel = window.fuel || {};

const API_SCORE_URL = 'http://127.0.0.1:3002/users/score';

const statusMessages = {
  0: "Racing Event",
  1: "Finished Event",
  2: "Destroyed Event"
};

class FuelTransactions {
  timeouts = {
    boost: false,
  };
  constructor() {
    this.timeouts = { boost: false };
  }

  async trigger_start_call(username, email) {
    console.log(`IN FUNCTION START CALL his_user_name: ${username}\nhis_email: ${email}`);
  }

  async trigger_dead_call(username) {
    console.log(`IN FUNCTION DEAD CALL his_user_name: ${username}`);
    if (username === "") {
      console.log('Aborting on Destroy call! Username is empty.\nSet: user("your_username").');
      return;
    } 
    
    const data = {
      username: username,
      time_seconds: 1,
      distance: 0,
      score_type: "DESTROYED",
    };
    try {
      const response = await fetch(API_SCORE_URL, {
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

  async trigger_finish_call(username, time_milliseconds, speed, damage) {
    if (username === "") {
      console.log('Aborting on Finish call! Username is empty.\nSet: user("your_username").');
      return;
    } 
    const data = {
        username: username,
        time_seconds: time_milliseconds,
        distance: 100,
        score_type: "FINISHED",
        speed: speed,
        damage: damage,
    };

    try {
        const response = await fetch(API_SCORE_URL, {
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

  async trigger_boost_call(username, time_milliseconds, speed, damage) {
    if (username === "") {
      console.log('Aborting on boost call! Username is empty.\nSet: user("your_username").');
      return;
    }
    console.log(`${username} on B(${time_milliseconds.toFixed(2)}), for ${time_milliseconds} seconds`);
    
    try {
      const response = await fetch(API_SCORE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          time_seconds: time_milliseconds,
          distance: 0,
          score_type: 'RACING',
          speed: speed,
          damage: damage,
        })
      });
      const data = await response.json();
      if (response.ok) {
        // console.log('Score tracked successfully at TRX:', data.data.transactionId);
        console.log('+1 TRX ', data.data.transactionId);
      } else {
        console.error('Error tracking score:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }
  async onBoost(time_milliseconds, speed, damage) {
    const username = $("#player_username").val();
  
    if (!this.timeouts.boost) {
      this.trigger_boost_call(username, time_milliseconds, speed, damage);
      this.timeouts.boost = true;
      setTimeout(() => {
        this.timeouts.boost = false;
      }, 200);
    }
  } 

  async onTrack(time_milliseconds, speed, damage) {
    const username = $('#player_username').val();
    this.trigger_boost_call(username, time_milliseconds, speed, damage);    
    
  }


  async onStart() {
    const username = $('#player_username').val();
    this.trigger_boost_call(username, 0, 0, 100);
    //this.trigger_start_call(username, variable_temporary);
  }

  async onDead() {
    const username = $('#player_username').val();
    this.trigger_dead_call(username);
  }

  async onRaceFinish(time_milliseconds, speed, damage) {
    const username = $('#player_username').val();
    console.log(`On FINISH his_user_name: ${username}\ntime_seconds: ${(time_milliseconds / 1000)}`);

    this.trigger_finish_call(username, time_milliseconds, speed, damage);
  }
}

fuel.Transactions = new FuelTransactions();
