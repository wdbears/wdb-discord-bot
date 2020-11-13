class WdbError extends Error {
  constructor(command, code, message) {
    super(message);
    this.command = command;
    this.code = code;
    this.name = 'WdbError';
  }

  get reply() {
    if (this.code >= 500) return this.fatalErrorMsg;
    // else if (this.code === 403) sendMessageToAdmins();
    return this.message;
  }

  get fatalErrorMsg() {
    const msg = `something went wrong using the "${this.command}" command. Contact Monke or Meowdy and give them this info: 
    Error code: ${this.code} 
    Call stack: ${this.stack}`;

    return msg;
  }
}

export default WdbError;
