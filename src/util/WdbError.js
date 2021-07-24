class WdbError extends Error {
  constructor(command, code, message, stack) {
    super(message);
    this.command = command;
    this.code = code;
    this.name = 'WdbError';
    this.stack = stack;
  }

  get reply() {
    if (this.code >= 500) return this.fatalErrorMsg;
    // if (this.code === 403) this.sendMessageToAdmins();
    return this.message;
  }

  get fatalErrorMsg() {
    const msg = `something went wrong using the "${this.command}" command. 
    Contact Monke or Meowdy and give them this info: 
    Error code: ${this.code}, Error message: ${this.message}
    Call stack: ${this.stack}`;

    return msg;
  }
}

export default WdbError;
