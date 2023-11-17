import TelegramBot from "node-telegram-bot-api";

const token = '6730874491:AAHUZ5Txkfaqe8Z1BeXlceKNjb5PlBXVW30';

const bot = new TelegramBot(token,{polling:true});

const chats =  {};
const gameOptions = {
   reply_markup: JSON.stringify({
      inline_keyboard:[
         [{text:'1',callback_data:'1'}, {text:'2',callback_data:'2'}, {text:'3',callback_data:'3'}],
         [{text:'4',callback_data:'4'}, {text:'5',callback_data:'5'}, {text:'6',callback_data:'6'}],
         [{text:'7',callback_data:'7'},{text:'8',callback_data:'8'},{text:'9',callback_data:'9'}],
         [{text:'0',callback_data:'0'}]
      ]
   })
}
const againOptions = {
   reply_markup: JSON.stringify({
      inline_keyboard:[
         [{text:'Try again',callback_data:'/again'}]
      ]
   })
}
const startGame = async(chatId) =>{
   await bot.sendMessage(chatId,'Try to guess the number from 0 to 9');
   const randomNumber = Math.floor(Math.random() * 10);
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId,'Guess',gameOptions)
}
const start = () => {
   bot.setMyCommands([{
      command:'/start',description:'Начальное приветствие'
   },
   {
      command:'/info',description:'Информация о пользователе'
   },
   {
      command:'/game',description:'Угадай число'
   }])
   bot.on('message', async msg => {
      const text =  msg.text;
      const chatId = msg.chat.id;
      if(text === '/start'){
        await bot.sendSticker(chatId,'https://ant.combot.org/ss/CCatsbyh/fc9400837ead7af1de8e27aa71c71a7c4fd2b4159fb26928e3a9a41c811fdb746036c94e08f832fde6e0ca947dc1ab17ae842b35df73f2ed1d73d617fa4ce81880th.png')
        return bot.sendMessage(chatId,'Welcome to the NdevTgBot');
      }
      if(text === '/info'){
         return bot.sendMessage(chatId,`Your name is ${msg.from.first_name}`);
      }
      if(text === '/game'){
        return startGame(chatId)
      }
      return bot.sendMessage(chatId, 'I dont understand you,try again!')
   })
   bot.on('callback_query', async msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if(data === '/again'){
         return startGame(chatId);
      }
      else if(Number(data) === chats[chatId]){
       return bot.sendMessage(chatId,'Congratulations! You`ve successfuly guessed the number',againOptions)
      }else{
         return bot.sendMessage(chatId,`Unfornutanely , you can not guess the number. The number was ${chats[chatId]}`,againOptions)
      }
   })
}

start();