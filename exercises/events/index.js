// --- Directions
// Create an 'eventing' library out of the
// Events class.  The Events class should
// have methods 'on', 'trigger', and 'off'.

class Events {
  constructor(eventName) {
    this.eventName = eventName;
    this.functions = [];
  }
  // Register an event handler
  // $('button').on('click', fn())
  on(eventName, callback) {
    this.eventName = eventName;
    this.functions.push(callback);
  }
  // Trigger all callbacks associated
  // with a given eventName
  trigger(eventName) {
    if (eventName === this.eventName) {
      this.functions.forEach(fn => fn());
    }
  }

  // Remove all event handlers associated
  // with the given eventName
  off(eventName) {
    if (eventName === this.eventName) {
      this.functions = [];
    }
  }
}

module.exports = Events;
