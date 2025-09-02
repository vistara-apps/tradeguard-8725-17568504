'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Card from './Card';
import Button from './Button';
import { SavedParameters } from '../types';

interface SavedParametersProps {
  onSelect: (params: SavedParameters) => void;
}

export default function SavedParametersComponent({ onSelect }: SavedParametersProps) {
  const { address } = useAccount();
  const [savedParams, setSavedParams] = useState<SavedParameters[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newParamName, setNewParamName] = useState('');
  
  // Fetch saved parameters
  const fetchSavedParameters = async () => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/get-parameters?userId=${address}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch saved parameters');
      }
      
      setSavedParams(data.data || []);
    } catch (error) {
      console.error('Fetch saved parameters error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch saved parameters');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save current parameters
  const saveCurrentParameters = async (accountBalance: number, riskPercentage: number, asset?: string) => {
    if (!address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/save-parameters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: address,
          name: newParamName,
          accountBalance,
          riskPercentage,
          asset,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save parameters');
      }
      
      // Refresh saved parameters
      await fetchSavedParameters();
      
      // Reset form
      setNewParamName('');
      setShowSaveForm(false);
    } catch (error) {
      console.error('Save parameters error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save parameters');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load saved parameters on mount
  useEffect(() => {
    if (address) {
      fetchSavedParameters();
    }
  }, [address]);
  
  if (!address) {
    return (
      <Card className="mt-lg">
        <p>Connect your wallet to access saved parameters</p>
      </Card>
    );
  }
  
  return (
    <div className="mt-lg">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-heading">Saved Parameters</h2>
        <Button 
          variant="secondary" 
          onClick={() => setShowSaveForm(!showSaveForm)}
        >
          {showSaveForm ? 'Cancel' : 'Save Current'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive p-md rounded-md mb-md">
          <p>{error}</p>
        </div>
      )}
      
      {showSaveForm && (
        <Card className="mb-lg">
          <h3 className="text-heading mb-md">Save Current Parameters</h3>
          <div className="mb-md">
            <label className="block mb-sm">Name</label>
            <input
              type="text"
              value={newParamName}
              onChange={(e) => setNewParamName(e.target.value)}
              placeholder="My Trading Setup"
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={() => {
                // This is just a placeholder - the actual implementation would get current values from the parent component
                saveCurrentParameters(10000, 1, 'BTC');
              }}
              disabled={!newParamName || isLoading}
            >
              Save
            </Button>
          </div>
        </Card>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center p-lg">
          <p>Loading saved parameters...</p>
        </div>
      ) : savedParams.length === 0 ? (
        <Card>
          <p>No saved parameters yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {savedParams.map((param) => (
            <Card key={param.id} className="cursor-pointer hover:border-accent transition-base">
              <h3 className="text-heading mb-sm">{param.name}</h3>
              <p>Balance: ${param.accountBalance.toFixed(2)}</p>
              <p>Risk: {param.riskPercentage.toFixed(1)}%</p>
              {param.asset && <p>Asset: {param.asset}</p>}
              <div className="flex justify-end mt-md">
                <Button variant="primary" onClick={() => onSelect(param)}>
                  Load
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

