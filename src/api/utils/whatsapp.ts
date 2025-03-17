const WhatsApp = {
  verify: async (tel: string) => {
    try {
      const response = await fetch(
        `https://api.inovstar.com/core/v2/api/wa-number-check/55${tel}`,
        {
          method: 'Post',
          headers: {
            'access-token': `${process.env.WHATSAPP_TOKEN1}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return await response.json();
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  sendText: async (tel: string, msg: string) => {
    try {
      const response = await fetch(
        `https://api.inovstar.com/core/v2/api/chats/send-text`,
        {
          method: 'Post',
          headers: {
            'access-token': `${process.env.WHATSAPP_TOKEN1}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: '+55' + tel,
            message: msg,
            forceSend: true,
            verifyContact: false,
          }),
        },
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

export default WhatsApp;
