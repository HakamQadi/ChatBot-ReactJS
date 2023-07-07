import { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import './App.css';


const conf = new Configuration({
  organization: "org-Example",
  apiKey: "sk-Example"
})

const openAi = new OpenAIApi(conf)   //This instance will be used to make requests to the OpenAI API.


function App() {

  const [message, setMassege] = useState('')
  const [chats, setChats] = useState([])
  const [isTyping, setIsTyping] = useState(false)



  const chat = async (e, message) => {
    if (e.key === 'Enter') {
      setMassege('');
      return;
    }
    e.preventDefault()
    setIsTyping(true)
    let chatMsgs = chats
    chatMsgs.push({ role: 'user', content: message })
    setChats(chatMsgs)
    // setMassege('')

    await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are HakamGPT. You helping with coding"
        },
        ...chats
      ],

    }).then((result) => {
      // console.log(result)
      chatMsgs.push(result.data.choices[0].message)
      setMassege(chatMsgs)
      setIsTyping(false)
    }).catch((e) => console.log(e))
  }
  return (
    <div className="App">
      <h1 style={{
        color: "yellow"
      }}>Welcome to HakamGPT</h1>
      <hr />
      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
              <span>
                <b>{chat.role === "user" ? "Me" : "HakamGPT"}</b>
              </span>
              <span>:</span>
              <span>{chat.content}</span>
            </p>
          ))
          : ""}
      </section>
      {isTyping ? (<div>
        <p>
          <i>Typing ...</i>
        </p>
      </div>) : ''}
      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name='message'
          placeholder='Type a Message and hit Enter'
          onChange={(e) => setMassege(e.target.value)} />
      </form>
    </div>
  );
}

export default App;
