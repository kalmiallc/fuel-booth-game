const fuel = window.fuel || {};

class FuelTransactions {
  timeouts = {
    boost: false,
  };
  constructor() {
    this.timeouts = { boost: false };
  }

  async trigger_race_event() {
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/Europe/Ljubljana');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch time data:', error);
    }
  }


  async onBoost() {
    console.log("boost");

    if (!this.timeouts.boost) {
      this.trigger_race_event();
      this.timeouts.boost = true;
      setTimeout(() => {
        this.timeouts.boost = false;
      }, 200);
    }
  }
}

fuel.Transactions = new FuelTransactions();
