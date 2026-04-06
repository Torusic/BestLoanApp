import React, { useState } from 'react';

function ApplyLoan() {
  const [amount, setAmount] = useState('');
  const [itemCount, setItemCount] = useState(4);
  const [error, setError] = useState('');

  // Increment duration
  const increment = () => {
    if (itemCount >= 24) return;
    setItemCount(itemCount + 1);
  };

  // Decrement duration
  const decrement = () => {
    if (itemCount <= 4) return;
    setItemCount(itemCount - 1);
  };

  // Handle apply button click
  const handleApply = () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }
    setError('');
    // Redirect logic here
    console.log(`Applying for ${amount} for ${itemCount} weeks`);
  };

  // Calculate duration percentage for progress bar
  const durationPercent = ((itemCount - 4) / (24 - 4)) * 100;

  return (
    <section className="flex items-center justify-center  bg-gray-700 p-2">
      <div className="bg-gray-800 w-full max-w-lg md:max-w-5xl lg:max-w-7xl p-2 text-white rounded-2xl flex flex-col items-center justify-center space-y-6">
        


        {/* Form Title */}
        <p className="text-lg md:text-xl text-gray-500 lg:text-2xl font-medium text-center my-4">Enter Amount</p>

        {/* Loan Amount Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full text-center text-4xl md:text-4xl lg:text-5xl py-4 px-7 rounded-lg outline-none "
          placeholder="0.00"
        />
        {error && <p className="text-red-500 text-sm italic mt-1">{error}</p>}

        {/* Duration Selector */}
        <div className="w-full flex flex-col items-center space-y-2">
          <label className="flex items-center text-sm gap-1 text-gray-600">
            Duration <p className="italic">(weeks)</p>
          </label>

          <div className="flex items-center bg-gray-900 px-4 gap-4 py-2 rounded-lg">
            <button onClick={decrement} className="text-gray-500 cursor-pointer text-xl">
              &minus;
            </button>

            <input
              type="number"
              value={itemCount}
              readOnly
              className="w-12 text-center bg-transparent outline-none text-gray-700 font-semibold"
            />

            <button onClick={increment} className="text-gray-500 cursor-pointer text-xl">
              &#43;
            </button>
          </div>

          {/* Duration Progress Bar */}
          <div className="w-full bg-gray-900 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${durationPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Loan Summary Panel */}
        <div className="w-full bg-gray-700 p-4 rounded-lg shadow-inner text-center mt-4">
          <p className="text-gray-700 md:text-base lg:text-lg">
            You are applying for <span className="font-semibold">{amount || 0}</span> currency units
            for <span className="font-semibold">{itemCount}</span> weeks.
          </p>

        </div>

        {/* Apply Button */}
        <div className="my-4 flex items-center justify-center w-full">
          <button
            onClick={handleApply}
            disabled={!amount || amount <= 0}
            className={`p-2 w-full rounded-lg text-white font-medium ${
              !amount || amount <= 0 ? 'bg-gray-00 cursor-not-allowed' : 'bg-green-500'
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
            The maximum loan duration is 24 weeks and minimum is 4 weeks.
          </p>
          <p className="text-xs text-gray-400 italic">
            You will be redirected to the home page to pay the processing fee.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ApplyLoan;