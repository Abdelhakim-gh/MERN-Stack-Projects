import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react";
import {useFinancialRecords} from './../../contexts/financialContext'

function FinancialForm() {
	const [desc, setDesc] = useState("");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("");
	const [method, setMethod] = useState("");

	const {records, addRecord} = useFinancialRecords()

	const {user} = useUser()

	const handleSubmit = (e) => {
		e.preventDefault();
		// make sure to specify properties names exist in the db
		const newRecord = {
			userId: user.id ?? "", // if user is not logged in 
			date: new Date().toISOString(),
			// date: new Date().toISOString(),
			description: desc,
			amount: parseFloat(amount),
			category,
			payementMethod: method,
		};
		console.log(newRecord);

		addRecord(newRecord).then(() => onClear())
		
	}

	const onClear = () => {
		setDesc("");
		setAmount("");
		setCategory("");
		setMethod("");
	}

	// useEffect(() => {

	// }, [])


    return (
    <>
		<div className="form-container">
		<form onSubmit={handleSubmit}>
			<div className="form-field">
			<label>Description:</label>
			<input
				type="text"
				placeholder="Lable & descrption"
				required
				className="input"
				value={desc}
				onChange={(e) => setDesc(e.target.value)}
			/>
			</div>
			<div className="form-field">
			<label>Amount:</label>
			<input
				type="number"
				placeholder="Expense - / Revenue +"
				required
				className="input"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
			/>
			</div>
			<div className="form-field">
			<label>Category:</label>
			<select
				required
				className="input"
				value={category}
				onChange={(e) => setCategory(e.target.value)}
			>
				<option value="">Select a Category</option>
				<option value="Food">Food</option>
				<option value="Rent">Rent</option>
				<option value="Salary">Salary</option>
				<option value="Utilities">Utilities</option>
				<option value="Entertainment">Entertainment</option>
				<option value="Other">Other</option>
			</select>
			</div>
			<div className="form-field">
			<label>Payment Method:</label>
			<select
				required
				className="input"
				value={method}
				onChange={(e) => setMethod(e.target.value)}
			>
				<option value="">Select a Payment Method</option>
				<option value="Credit Card">Credit Card</option>
				<option value="Cash">Cash</option>
				<option value="Bank Transfer">Bank Transfer</option>
			</select>
			</div>
			<button type="submit" className="button">
				Add Record
			</button>
			<button type="clear" onClick={onClear} className="button">
				Clear
			</button>
		</form>
		</div>
    </>
    )
}

export default FinancialForm