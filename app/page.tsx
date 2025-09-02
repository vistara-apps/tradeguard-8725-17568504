    'use client';

    import { useState } from 'react';
    import { useAccount } from 'wagmi';
    import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
    import { base } from 'viem/chains';
    import NumberInput from './components/NumberInput';
    import InputSlider from './components/InputSlider';
    import Button from './components/Button';
    import Card from './components/Card';
    import Dropdown from './components/Dropdown';
    import Tooltip from './components/Tooltip';

    export default function Home() {
      const { address } = useAccount();
      const [accountBalance, setAccountBalance] = useState('');
      const [riskPercentage, setRiskPercentage] = useState(1);
      const [stopLoss, setStopLoss] = useState('');
      const [entryPrice, setEntryPrice] = useState('');
      const [takeProfit, setTakeProfit] = useState('');
      const [leverage, setLeverage] = useState(1);
      const [asset, setAsset] = useState('BTC');
      const [results, setResults] = useState(null);
      const [insight, setInsight] = useState('');
      const [simResults, setSimResults] = useState(null);
      const [showAdvanced, setShowAdvanced] = useState(false);

      const assets = ['BTC', 'ETH', 'USDC'];

      const handleCalculate = async () => {
        try {
          const balance = parseFloat(accountBalance);
          const riskPct = riskPercentage / 100;
          const entry = parseFloat(entryPrice);
          const sl = parseFloat(stopLoss);
          const tp = parseFloat(takeProfit);
          const lev = leverage;

          if (isNaN(balance) || isNaN(riskPct) || isNaN(entry) || isNaN(sl) || isNaN(tp) || isNaN(lev)) {
            throw new Error('Invalid inputs');
          }

          const stopDistance = Math.abs(entry - sl);
          const riskAmount = balance * riskPct;
          const positionSize = riskAmount / stopDistance;
          const rewardDistance = Math.abs(tp - entry);
          const rewardAmount = rewardDistance * positionSize;
          const riskRewardRatio = rewardAmount / riskAmount;
          const marginRequired = (positionSize * entry) / lev;

          const calcResults = {
            positionSize,
            riskAmount,
            rewardAmount,
            riskRewardRatio,
            marginRequired,
            calculationTimestamp: Date.now(),
          };
          setResults(calcResults);

          // Save to Redis via API
          if (address) {
            await fetch('/api/save-calculation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: address, ...calcResults }),
            });
          }

          // Get AI insight
          const res = await fetch('/api/insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(calcResults),
          });
          const data = await res.json();
          setInsight(data.insight);
        } catch (error) {
          console.error('Calculation error:', error);
          setResults(null);
          setInsight('');
        }
      };

      const handleSimulate = (levLevels = [1, 5, 10, 20]) => {
        if (!results) return;
        const sim = levLevels.map(lev => {
          const margin = (results.positionSize * parseFloat(entryPrice)) / lev;
          const amplifiedProfit = results.rewardAmount * lev;
          const amplifiedLoss = results.riskAmount * lev;
          return { lev, margin, amplifiedProfit, amplifiedLoss };
        });
        setSimResults(sim);
      };

      const handlePaymentSuccess = () => {
        setShowAdvanced(true);
        handleSimulate();
      };

      const calls = [
        {
          to: '0xYourDevAddressHere' as `0x${string}`, // Replace with actual address
          value: BigInt(1000000000000000), // 0.001 ETH
          data: '0x' as `0x${string}`,
        },
      ];

      return (
        <div className="max-w-md mx-auto px-4 py-8">
          <h1 className="text-display mb-xl">TradeGuard</h1>
          <p className="text-body mb-lg">Calculate optimal position sizes and risk metrics.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
            <Tooltip content="Your total account balance in USD">
              <NumberInput
                label="Account Balance ($)"
                value={accountBalance}
                onChange={setAccountBalance}
                variant="withSteppers"
              />
            </Tooltip>
            <InputSlider
              label="Risk Percentage (%)"
              value={riskPercentage}
              onChange={setRiskPercentage}
              min={0.1}
              max={5}
              step={0.1}
            />
            <NumberInput
              label="Stop-Loss Price ($)"
              value={stopLoss}
              onChange={setStopLoss}
            />
            <NumberInput
              label="Entry Price ($)"
              value={entryPrice}
              onChange={setEntryPrice}
            />
            <NumberInput
              label="Take-Profit Price ($)"
              value={takeProfit}
              onChange={setTakeProfit}
            />
            <InputSlider
              label="Leverage"
              value={leverage}
              onChange={setLeverage}
              min={1}
              max={100}
              step={1}
            />
            <Dropdown
              label="Asset"
              options={assets}
              value={asset}
              onChange={setAsset}
            />
          </div>

          <Button variant="primary" onClick={handleCalculate}>
            Calculate
          </Button>

          {results && (
            <Card className="mt-lg">
              <h2 className="text-heading mb-md">Results</h2>
              <p>Position Size: {results.positionSize.toFixed(4)} {asset}</p>
              <p>Risk Amount: ${results.riskAmount.toFixed(2)}</p>
              <p>Reward Amount: ${results.rewardAmount.toFixed(2)}</p>
              <p>Risk/Reward Ratio: {results.riskRewardRatio.toFixed(2)}</p>
              <p>Margin Required: ${results.marginRequired.toFixed(2)}</p>
              {insight && <p className="mt-md text-secondary">AI Insight: {insight}</p>}
            </Card>
          )}

          <div className="mt-lg">
            <h2 className="text-heading mb-md">Leverage Impact Simulator (Advanced)</h2>
            {!showAdvanced ? (
              <Transaction
                chainId={base.id}
                calls={calls}
                onSuccess={handlePaymentSuccess}
              >
                <TransactionButton text="Pay 0.001 ETH for Simulation" />
              </Transaction>
            ) : (
              simResults && simResults.map((sim, i) => (
                <Card key={i} className="mb-md">
                  <p>Leverage: {sim.lev}x</p>
                  <p>Margin: ${sim.margin.toFixed(2)}</p>
                  <p>Amplified Profit: ${sim.amplifiedProfit.toFixed(2)}</p>
                  <p>Amplified Loss: ${sim.amplifiedLoss.toFixed(2)}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      );
    }
  