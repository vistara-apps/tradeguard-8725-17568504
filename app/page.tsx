'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import NumberInput from './components/NumberInput';
import InputSlider from './components/InputSlider';
import Button from './components/Button';
import Card from './components/Card';
import Dropdown from './components/Dropdown';
import Tooltip from './components/Tooltip';
import PaymentUI from './components/PaymentUI';
import SavedParametersComponent from './components/SavedParameters';
import { validateTradeInputs } from './lib/validation';
import { performTradeCalculation, simulateLeverage } from './lib/calculations';
import { SavedParameters, TradeCalculation, LeverageSimulation } from './types';
import { hasFeatureAccess } from './lib/payments';

export default function Home() {
  const { address } = useAccount();
  
  // Form state
  const [accountBalance, setAccountBalance] = useState('');
  const [riskPercentage, setRiskPercentage] = useState(1);
  const [stopLoss, setStopLoss] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [asset, setAsset] = useState('BTC');
  
  // Results state
  const [results, setResults] = useState<TradeCalculation | null>(null);
  const [insight, setInsight] = useState('');
  const [simResults, setSimResults] = useState<LeverageSimulation[] | null>(null);
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);
  
  // Available assets
  const assets = ['BTC', 'ETH', 'USDC', 'SOL', 'AVAX', 'MATIC'];
  
  // Check if user has access to advanced features
  useEffect(() => {
    const checkAccess = async () => {
      if (address) {
        const hasAccess = await hasFeatureAccess(address, 'Leverage Impact Simulator');
        setShowAdvanced(hasAccess);
        setHasCheckedAccess(true);
      } else {
        setShowAdvanced(false);
        setHasCheckedAccess(true);
      }
    };
    
    checkAccess();
  }, [address]);
  
  // Handle form validation and calculation
  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      setErrors({});
      
      // Validate inputs
      const validation = validateTradeInputs({
        accountBalance,
        riskPercentage,
        stopLoss,
        entryPrice,
        takeProfit,
        leverage,
        asset,
      });
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      // Perform calculation
      const calcResults = performTradeCalculation(
        parseFloat(accountBalance),
        riskPercentage,
        parseFloat(entryPrice),
        parseFloat(stopLoss),
        parseFloat(takeProfit),
        leverage
      );
      
      // Create full calculation object
      const fullResults: TradeCalculation = {
        userId: address || 'anonymous',
        accountBalance: parseFloat(accountBalance),
        riskPercentage,
        stopLoss: parseFloat(stopLoss),
        entryPrice: parseFloat(entryPrice),
        takeProfit: parseFloat(takeProfit),
        leverage,
        asset,
        ...calcResults,
        calculationTimestamp: Date.now(),
      };
      
      setResults(fullResults);
      
      // Save to Redis via API if user is connected
      if (address) {
        await fetch('/api/save-calculation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullResults),
        });
      }
      
      // Get AI insight
      const res = await fetch('/api/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calcResults),
      });
      
      const data = await res.json();
      setInsight(data.insight || '');
      
      // Run leverage simulation if user has access
      if (showAdvanced) {
        handleSimulate();
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Handle leverage simulation
  const handleSimulate = (levLevels = [1, 5, 10, 20]) => {
    if (!results) return;
    
    const sim = simulateLeverage(
      results.positionSize,
      results.entryPrice,
      results.riskAmount,
      results.rewardAmount,
      levLevels
    );
    
    setSimResults(sim);
  };
  
  // Handle payment success
  const handlePaymentSuccess = (planId: string) => {
    setShowAdvanced(true);
    handleSimulate();
  };
  
  // Handle loading saved parameters
  const handleLoadSavedParams = (params: SavedParameters) => {
    setAccountBalance(params.accountBalance.toString());
    setRiskPercentage(params.riskPercentage);
    if (params.asset) {
      setAsset(params.asset);
    }
  };
  
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-display mb-xl">TradeGuard</h1>
      <p className="text-body mb-lg">Calculate your crypto risk & position size with confidence.</p>
      
      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
        <Tooltip content="Your total account balance in USD">
          <NumberInput
            label="Account Balance ($)"
            value={accountBalance}
            onChange={setAccountBalance}
            variant="withSteppers"
            error={errors.accountBalance}
          />
        </Tooltip>
        
        <InputSlider
          label="Risk Percentage (%)"
          value={riskPercentage}
          onChange={setRiskPercentage}
          min={0.1}
          max={5}
          step={0.1}
          error={errors.riskPercentage}
        />
        
        <NumberInput
          label="Entry Price ($)"
          value={entryPrice}
          onChange={setEntryPrice}
          error={errors.entryPrice}
        />
        
        <NumberInput
          label="Stop-Loss Price ($)"
          value={stopLoss}
          onChange={setStopLoss}
          error={errors.stopLoss}
        />
        
        <NumberInput
          label="Take-Profit Price ($)"
          value={takeProfit}
          onChange={setTakeProfit}
          error={errors.takeProfit}
        />
        
        <InputSlider
          label="Leverage"
          value={leverage}
          onChange={setLeverage}
          min={1}
          max={100}
          step={1}
          error={errors.leverage}
        />
        
        <Dropdown
          label="Asset"
          options={assets}
          value={asset}
          onChange={setAsset}
          error={errors.asset}
        />
      </div>
      
      {/* General Error */}
      {errors.general && (
        <div className="bg-destructive p-md rounded-md mb-md">
          <p>{errors.general}</p>
        </div>
      )}
      
      {/* Calculate Button */}
      <Button 
        variant="primary" 
        onClick={handleCalculate}
        disabled={isCalculating}
      >
        {isCalculating ? 'Calculating...' : 'Calculate'}
      </Button>
      
      {/* Results */}
      {results && (
        <Card className="mt-lg">
          <h2 className="text-heading mb-md">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <p className="mb-sm">Position Size:</p>
              <p className="text-xl font-semibold">{results.positionSize.toFixed(4)} {asset}</p>
            </div>
            <div>
              <p className="mb-sm">Risk Amount:</p>
              <p className="text-xl font-semibold">${results.riskAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="mb-sm">Reward Amount:</p>
              <p className="text-xl font-semibold">${results.rewardAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="mb-sm">Risk/Reward Ratio:</p>
              <p className="text-xl font-semibold">{results.riskRewardRatio.toFixed(2)}</p>
            </div>
            <div>
              <p className="mb-sm">Margin Required:</p>
              <p className="text-xl font-semibold">${results.marginRequired.toFixed(2)}</p>
            </div>
          </div>
          
          {insight && (
            <div className="mt-lg p-md bg-surface rounded-md">
              <h3 className="text-heading mb-sm">AI Insight</h3>
              <p className="text-text-secondary">{insight}</p>
            </div>
          )}
        </Card>
      )}
      
      {/* Leverage Impact Simulator */}
      {results && hasCheckedAccess && (
        <div className="mt-lg">
          <h2 className="text-heading mb-md">Leverage Impact Simulator</h2>
          
          {!showAdvanced ? (
            <PaymentUI onSuccess={handlePaymentSuccess} feature="Leverage Impact Simulator" />
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
                <Button 
                  variant="secondary" 
                  onClick={() => handleSimulate([1, 5, 10, 20])}
                >
                  Standard Levels
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => handleSimulate([2, 3, 5, 10, 25, 50, 100])}
                >
                  Extended Levels
                </Button>
              </div>
              
              {simResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {simResults.map((sim, i) => (
                    <Card key={i} className="mb-md">
                      <h3 className="text-heading mb-sm">{sim.lev}x Leverage</h3>
                      <p>Margin: ${sim.margin.toFixed(2)}</p>
                      <p>Potential Profit: <span className="text-success">${sim.amplifiedProfit.toFixed(2)}</span></p>
                      <p>Potential Loss: <span className="text-destructive">${sim.amplifiedLoss.toFixed(2)}</span></p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Saved Parameters */}
      {address && (
        <SavedParametersComponent onSelect={handleLoadSavedParams} />
      )}
    </div>
  );
}
