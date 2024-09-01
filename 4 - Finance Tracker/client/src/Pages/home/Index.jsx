import { useUser } from '@clerk/clerk-react';
import FinancialForm from './financial-form';
import FinancialList from './financial-list';
import { useFinancialRecords } from '../../contexts/financialContext';
import { useMemo } from 'react';

function Index() {
  const { user } = useUser();
  const { financialRecords: records } = useFinancialRecords(); // Changed to match context

  const totalAmount = useMemo(() => {
    return records.reduce((acc, record) => {
      // Convert amount to a number
      const amount = parseFloat(record.amount);
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [records]);

  return (
    <>
      <div className="dashboard-container">
        <h2>Welcome 👋 {user?.firstName} , to your Finances Tracker 💰</h2>
        <FinancialForm />
        <hr style={{border: '1px, solid #333', borderRadius: '4px'}} />
        <div>
          <h3 style={{textAlign: 'center'}}>Total: {totalAmount} 💲</h3>
        </div>
        <FinancialList />
      </div>
    </>
  );
}

export default Index;
