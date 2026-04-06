import React, { useState } from 'react';
import AxiosToastError from '../../../utils/AxiosToastError';
import Axios from '../../../utils/Axios';
import SummaryApi from '../../../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ApplyLoan() {

  const [apply, setApply] = useState({ amount: '', durationWeeks: 4 });
  const [error, setError] = useState('');
  const navigate=useNavigate()

 
  const increment = () => {
    if (apply.durationWeeks >= 24) return;
    setApply(prev => ({ ...prev, durationWeeks: prev.durationWeeks + 1 }));
  };

 
  const decrement = () => {
    if (apply.durationWeeks <= 4) return;
    setApply(prev => ({ ...prev, durationWeeks: prev.durationWeeks - 1 }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setApply(prev => ({ ...prev, [name]: value }));
  };


  const handleApply = async () => {
    if (!apply.amount || apply.amount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }
    setError('');

    try {
      const response = await Axios({ ...SummaryApi.apply, data: apply });
      if (response.data.success) {
        toast.success(response.data.message);
        setApply({
           amount: '', 
           durationWeeks: 4
          
          });
          navigate('/clientStats/myLoan')

      } else {
        toast.error(response.data.error || 'Something went wrong.');
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

  
  const durationPercent = ((apply.durationWeeks - 4) / (24 - 4)) * 100;

  return (
    <section className="flex items-center justify-center bg-gray-800 rounded-2xl p-4">
      <div className="bg-gray-800 w-full max-w-lg md:max-w-5xl lg:max-w-7xl p-4 text-white rounded-2xl flex flex-col items-center space-y-6">
        
       
        <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-medium text-center">
          Enter Loan Amount
        </p>

    
        <input
          type="number"
          name="amount"
          value={apply.amount}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full text-center text-4xl md:text-4xl lg:text-5xl py-4 px-6 rounded-lg outline-none text-white bg-gray-800"
        />
        {error && <p className="text-red-500 text-sm italic mt-1">{error}</p>}

        {/* Duration Selector */}
        <div className="w-full flex flex-col items-center space-y-2">
          <label className="flex items-center text-sm gap-1 text-gray-400">
            Duration <p className="italic">(weeks)</p>
          </label>

          <div className="flex items-center bg-gray-900 px-4 gap-4 py-2 rounded-lg">
            <button
              onClick={decrement}
              className="text-gray-500 cursor-pointer text-xl"
            >
              &minus;
            </button>

            <input
              type="number"
              name="durationWeeks"
              value={apply.durationWeeks}
              readOnly
              className="w-12 text-center bg-transparent outline-none text-gray-400 font-semibold"
            />

            <button
              onClick={increment}
              className="text-gray-500 cursor-pointer text-xl"
            >
              &#43;
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-900 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${durationPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Loan Summary Panel */}
        <div className="w-full bg-gray-900 p-4 rounded-lg text-center text-white shadow-inner">
          <p className="md:text-base lg:text-lg">
            You are applying for <span className="font-semibold">{apply.amount || 0}</span> currency units
            for <span className="font-semibold">{apply.durationWeeks}</span> weeks.
          </p>
        </div>

        {/* Apply Button */}
        <div className="my-4 flex items-center justify-center w-full">
          <button
            onClick={handleApply}
            disabled={!apply.amount || apply.amount <= 0}
            className={`p-2 w-full rounded-lg text-white font-medium ${
              !apply.amount || apply.amount <= 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-500'
            }`}
          >
            Apply
          </button>
        </div>

        {/* Helpful Tips */}
        <div className="mt-2 text-center space-y-1">
          <p className="text-xs text-gray-400 italic">
            Make sure to review your loan duration and amount before applying.
          </p>
          <p className="text-xs text-gray-400 italic">
            Maximum loan duration is 24 weeks, minimum is 4 weeks.
          </p>
          <p className="text-xs text-gray-400 italic">
            You will be redirected to pay the processing fee after applying.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ApplyLoan;