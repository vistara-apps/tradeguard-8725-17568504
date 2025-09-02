'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { base } from 'viem/chains';
import Card from './Card';
import Button from './Button';
import { PAYMENT_PLANS } from '../lib/payments';

interface PaymentUIProps {
  onSuccess: (planId: string) => void;
  feature?: string;
}

export default function PaymentUI({ onSuccess, feature = 'Leverage Impact Simulator' }: PaymentUIProps) {
  const { address } = useAccount();
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PAYMENT_PLANS>('SINGLE_CALCULATION');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePaymentSuccess = async (txHash: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Process payment
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: address,
          planId: selectedPlan,
          txHash,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to process payment');
      }
      
      // Call onSuccess callback
      onSuccess(selectedPlan);
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const plan = PAYMENT_PLANS[selectedPlan];
  
  // Transaction call data
  const calls = [
    {
      to: process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS as `0x${string}` || '0xYourDevAddressHere' as `0x${string}`,
      value: BigInt(Math.floor(plan.price * 1e18)), // Convert ETH to wei
      data: '0x' as `0x${string}`,
    },
  ];
  
  return (
    <div className="mt-lg">
      <h2 className="text-heading mb-md">Unlock {feature}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        {Object.entries(PAYMENT_PLANS).map(([id, plan]) => (
          <Card 
            key={id} 
            className={`cursor-pointer transition-base ${selectedPlan === id ? 'border-2 border-accent' : ''}`}
            onClick={() => setSelectedPlan(id as keyof typeof PAYMENT_PLANS)}
          >
            <h3 className="text-heading mb-sm">{plan.name}</h3>
            <p className="text-xl mb-md">{plan.price} ETH</p>
            <p className="text-text-secondary mb-md">{plan.description}</p>
            <ul className="list-disc pl-lg">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      
      {error && (
        <div className="bg-destructive p-md rounded-md mb-md">
          <p>{error}</p>
        </div>
      )}
      
      {isProcessing ? (
        <div className="flex items-center justify-center p-lg">
          <p>Processing payment...</p>
        </div>
      ) : (
        <Transaction
          chainId={base.id}
          calls={calls}
          onSuccess={(data) => handlePaymentSuccess(data.transactionHash)}
        >
          <TransactionButton text={`Pay ${plan.price} ETH for ${plan.name}`} />
        </Transaction>
      )}
    </div>
  );
}

