import { createContext, useState, useContext, useEffect } from "react"
import {useUser} from '@clerk/clerk-react'

/**
 * The FinancialRecordsContext is a context that holds the state of the financial records
 * and provides functions to add, update and delete records. It also provides a function
 * to get the records of the user
 */
export const FinancialRecordsContext = createContext()

/**
 * The FinancialRecordsProvider is a component that wraps the FinancialRecordsContext
 * and provides the state and functions to its children
 */
export function FinancialRecordsProvider({children}) {
    
    // The state of the records
    const [financialRecords, setFinancialRecords] = useState([])
    
    // Get the user from Clerk
    const {user} = useUser()

    // The server api endpoint
    const url = (import.meta.env.VITE_SERVER_URL || 'http://localhost:3001') + '/api/financials';

    /**
     * Function to add a new record to the database
     * @param {Object} record The record to be added
     */
    const addRecord =  async (record) => {
        const response = await fetch(url + '/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        })
        try {
            if (response.ok) {
                const newRecord = await response.json();
                setFinancialRecords([...financialRecords, newRecord]);
            } 
        } catch (error) {
            console.error('Failed to add record, Error:', error);
        }
    }

    /**
     * Function to get the records of the user
     */
    const getRecords = async () => {
        if (!user) return // in case the user is not connect
        const response = await fetch(url + `/getAllByUserId/${user.id}`)
        try {
            if (response.ok) {
                const records = await response.json();
                setFinancialRecords(records);
                console.log(records);
            } 
        } catch (error) {
            console.error('Failed to get user records, Error:', error);
        }
    }

    /**
     * Function to update a record in the database
     * @param {string} id The id of the record to be updated
     * @param {Object} newRecord The new record data
     */
    const updateRecord = async (id, newRecord) => {
        const response = await fetch(url + `/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecord)
        })
        try {
            if (response.ok) {
                const updatedRecord = await response.json();
                setFinancialRecords((prev) => prev.map((record) => {
                    if (record._id === id) {
                        return newRecord
                    } else {
                        return record
                    }
                }));
                console.log(updatedRecord);
            } 
        } catch (error) {
            console.error('Failed to update record, Error:', error);
        }
    }

    /**
     * Function to delete a record from the database
     * @param {string} id The id of the record to be deleted
     */
    const deleteRecord = async (id) => {
        if (!user) return // in case the user is not connect
        const response = await fetch(url + `/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        try {
            if (response.ok) {
                setFinancialRecords((prev) => prev.filter((record) => record._id !== id));
            } 
        } catch (error) {
            console.error('Failed to delete record, Error:', error);
        }
    }

    // On page load useEffect
    useEffect(() => {
        getRecords();
    }, [user])

    return (
    <>
        <FinancialRecordsContext.Provider value={{financialRecords, addRecord, updateRecord, deleteRecord}}>
            {children}
        </FinancialRecordsContext.Provider>
    </>
    )
}

/**
 * The useFinancialRecords hook allows to access the state and functions of the
 * FinancialRecordsContext
 */
export const useFinancialRecords = () => {
    const context = useContext(FinancialRecordsContext)
    if (!context) {
        throw new Error('useFinancialRecords must be used within a FinancialRecordsProvider')
    }
    return context;
}

