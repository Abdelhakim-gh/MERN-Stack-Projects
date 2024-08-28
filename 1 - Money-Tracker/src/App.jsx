import { set } from 'mongoose';
import './App.css'
import {useState, useEffect} from "react"

function App() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');

  // to clear form
  const onClickReset = () => {
    setName('');
    setPrice(0);
    setDatetime('');
    setDescription('');
  } 

  // send post request to create transaction
  const handelSubmit = async (e) => {
    e.preventDefault()
    const url = import.meta.env.VITE_API_URL + '/transaction'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        price,
        datetime,
        description
      })
    }).then(response => {
      if (response.ok) {
        console.log(response.json());
        onClickReset(); // to clear the data from the form
      } else {
        throw new Error('Post request Something went wrong')
      }
    })
  }

  // get all transactions
  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + '/transactions'
    const response = await fetch(url)
    return await response.json();
  }

  const [transactions, setTransactions] = useState([])

  useEffect(() => { 
    getTransactions().then(setTransactions)
  },[])

  // total balance
  let balance = 0
  for (const transaction of transactions) {
    balance = balance + transaction.price
  }
  balance = balance.toFixed(2)

  return (
    <>
      <main>
        <h1>Track your expenses and income 📝</h1>
        <h2>Total: ${balance} 💰</h2>
        <form action="" onSubmit={handelSubmit}>
          <div className="basic">
            <input 
              type="text" 
              placeholder={"Item"} 
              value={name}
              onChange={(e) => setName(e.target.value)}  
            />
            <input 
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="description">
          <input 
              type="datetime-local" 
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
            <input 
              type="text" 
              placeholder={"description"} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit">Add Transaction</button>
          {/* to clear data you need to change states */}
          <button type="reset" onClick={onClickReset}>clear</button>
        </form>
        <h3>Number of Transactions: {transactions.length}</h3>
        <div className="transactions">
          {transactions.length > 0 && transactions.map(transaction => (
            <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>  
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={`price ${transaction.price < 0 ? "expence" : "revenue"}`}>
                {transaction.price.toFixed(2)}
              </div>
              <div className="datatime">{transaction.datetime}</div>
            </div>
          </div>
          ))}
        </div>
      </main>
    </>
  )
}

export default App
