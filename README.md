# TradeGuard

Calculate your crypto risk & position size with confidence.

![TradeGuard](https://tradeguard-8725-17568504.vercel.app/api/frame/image?type=initial)

## Overview

TradeGuard is a Base MiniApp for crypto and forex traders to calculate optimal position sizes, margin requirements, and risk metrics. It helps traders make informed decisions about their trades by providing clear calculations and insights.

## Features

### Position Sizing Calculator

Automatically calculates the correct lot/unit size based on account balance, desired risk percentage, and stop-loss distance in pips or price difference. This ensures traders risk only a predefined percentage of their capital per trade, protecting against catastrophic losses.

### Risk/Reward Ratio Analysis

Calculates the potential profit versus potential loss for a given trade setup, based on entry price, exit target, and stop-loss level. This helps traders identify trades with favorable risk-reward profiles, increasing the likelihood of long-term profitability.

### Margin Requirement Calculator

Shows the exact margin needed to open a specific position size with a given leverage level, common in leveraged trading platforms. This provides clarity on leveraged capital usage, preventing unexpected margin calls and liquidations.

### Leverage Impact Simulator

Illustrates how different leverage levels affect potential profits and losses on a per-trade basis, helping users understand the amplified risk. This educates traders on the impact of leverage, encouraging more responsible trading practices and capital management.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Upstash Redis
- **Authentication**: Wallet-based authentication via Coinbase OnchainKit
- **AI**: OpenAI API for trade insights
- **Blockchain**: Base (Ethereum L2)
- **Farcaster**: Frame integration for social sharing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Upstash Redis account
- OpenAI API key
- Coinbase OnchainKit API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vistara-apps/tradeguard-8725-17568504.git
cd tradeguard-8725-17568504
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with the following variables:

```
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
OPENROUTER_API_KEY=your_openai_api_key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS=your_eth_address
NEYNAR_API_KEY=your_neynar_api_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your account balance, risk percentage, entry price, stop-loss price, and take-profit price.
2. Select your asset and leverage level.
3. Click "Calculate" to see your position size, risk amount, reward amount, risk/reward ratio, and margin required.
4. For advanced features like the Leverage Impact Simulator, you can pay a small fee in ETH.
5. Save your parameters for quick access in future sessions.

## API Documentation

See [API Documentation](docs/api.md) for details on the available API endpoints.

## Business Model

TradeGuard uses a micro-transactions business model, where users pay small amounts for advanced features:

- **Single Calculation**: 0.001 ETH for a one-time use of the Leverage Impact Simulator
- **Daily Pass**: 0.003 ETH for unlimited calculations for 24 hours
- **Weekly Pass**: 0.01 ETH for unlimited calculations for 7 days

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Coinbase OnchainKit](https://github.com/coinbase/onchainkit)
- [Upstash Redis](https://upstash.com/)
- [OpenAI](https://openai.com/)
- [Farcaster](https://farcaster.xyz/)
- [Base](https://base.org/)

