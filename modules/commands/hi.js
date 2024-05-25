module.exports = new Object({
  config: new Object({
    name: "hi",
    description: "hi",
    usage: "{pn}",
    author: "Rui",
  }),

  onRun: async function ({ api: _0x7B2F, event: _0xE9E8, args: _0x3C6D }) {
    let { messageID: _0x8E6A, senderID: _0x5D72, threadID: _0xC1F9 } = _0xE9E8;
    let _0xAF4B = _0x3C6D.join(" ");

    if (!_0xAF4B) {
      _0x7B2F.sendMessage(
        `Hello, you said none.\n\nThreadID: ${_0xC1F9}\nSenderID: ${_0x5D72}`,
        _0xC1F9,
        _0x8E6A,
      );
    } else {
      _0x7B2F.sendMessage(
        `Hello, you said ${_0xAF4B}.\n\nThreadID: ${_0xC1F9}\nSenderID: ${_0x5D72}`,
        _0xC1F9,
        _0x8E6A,
      );
    }
  },
});
