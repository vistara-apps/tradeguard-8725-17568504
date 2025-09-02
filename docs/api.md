# TradeGuard API Documentation

This document provides comprehensive documentation for the TradeGuard API endpoints.

## Base URL

All API endpoints are relative to the base URL of the application:

```
https://tradeguard-8725-17568504.vercel.app
```

## Authentication

Currently, the API does not require authentication. However, user identification is done through the `userId` parameter, which should be a wallet address.

## Response Format

All API responses follow a standard format:

```json
{
  "success": true|false,
  "data": {...},  // Only present on successful responses
  "error": "Error message",  // Only present on error responses
  "message": "Additional information"  // Optional
}
```

## Endpoints

### Calculation Endpoints

#### Save Calculation

Saves a trade calculation to the database.

- **URL**: `/api/save-calculation`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "userId": "0x...",  // Wallet address
  "accountBalance": 10000,  // Account balance in USD
  "riskPercentage": 1,  // Risk percentage (0-100)
  "stopLoss": 40000,  // Stop loss price
  "entryPrice": 41000,  // Entry price
  "takeProfit": 43000,  // Take profit price
  "leverage": 1,  // Leverage level
  "positionSize": 10,  // Position size in units of the asset
  "riskAmount": 100,  // Risk amount in USD
  "rewardAmount": 200,  // Reward amount in USD
  "riskRewardRatio": 2,  // Risk/reward ratio
  "marginRequired": 41000,  // Margin required in USD
  "asset": "BTC",  // Optional asset symbol
  "calculationTimestamp": 1632150000000  // Optional timestamp
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "userId": "0x...",
    "accountBalance": 10000,
    "riskPercentage": 1,
    "stopLoss": 40000,
    "entryPrice": 41000,
    "takeProfit": 43000,
    "leverage": 1,
    "positionSize": 10,
    "riskAmount": 100,
    "rewardAmount": 200,
    "riskRewardRatio": 2,
    "marginRequired": 41000,
    "asset": "BTC",
    "calculationTimestamp": 1632150000000
  }
}
```

**Error Responses**:

- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

#### Get Calculations

Retrieves a user's calculations from the database.

- **URL**: `/api/get-calculations`
- **Method**: `GET` or `POST`
- **Content-Type**: `application/json` (for POST)

**Query Parameters (GET)**:

- `userId`: Wallet address
- `limit`: Maximum number of calculations to retrieve (default: 10)

**Request Body (POST)**:

```json
{
  "userId": "0x...",  // Wallet address
  "limit": 10  // Optional limit
}
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "userId": "0x...",
      "accountBalance": 10000,
      "riskPercentage": 1,
      "stopLoss": 40000,
      "entryPrice": 41000,
      "takeProfit": 43000,
      "leverage": 1,
      "positionSize": 10,
      "riskAmount": 100,
      "rewardAmount": 200,
      "riskRewardRatio": 2,
      "marginRequired": 41000,
      "asset": "BTC",
      "calculationTimestamp": 1632150000000
    },
    // More calculations...
  ]
}
```

**Error Responses**:

- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

### Parameters Endpoints

#### Save Parameters

Saves a user's parameters for quick access.

- **URL**: `/api/save-parameters`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "userId": "0x...",  // Wallet address
  "name": "My Trading Setup",  // Parameter name
  "accountBalance": 10000,  // Account balance in USD
  "riskPercentage": 1,  // Risk percentage (0-100)
  "asset": "BTC"  // Optional asset symbol
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "param_1632150000000",
    "name": "My Trading Setup",
    "accountBalance": 10000,
    "riskPercentage": 1,
    "asset": "BTC",
    "createdAt": 1632150000000
  }
}
```

**Error Responses**:

- `400 Bad Request`: Missing required fields or invalid values
- `500 Internal Server Error`: Server error

#### Get Parameters

Retrieves a user's saved parameters.

- **URL**: `/api/get-parameters`
- **Method**: `GET` or `POST`
- **Content-Type**: `application/json` (for POST)

**Query Parameters (GET)**:

- `userId`: Wallet address

**Request Body (POST)**:

```json
{
  "userId": "0x..."  // Wallet address
}
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "param_1632150000000",
      "name": "My Trading Setup",
      "accountBalance": 10000,
      "riskPercentage": 1,
      "asset": "BTC",
      "createdAt": 1632150000000
    },
    // More parameters...
  ]
}
```

**Error Responses**:

- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

### Payment Endpoints

#### Process Payment

Processes a payment for advanced features.

- **URL**: `/api/process-payment`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "userId": "0x...",  // Wallet address
  "planId": "SINGLE_CALCULATION",  // Plan ID
  "txHash": "0x..."  // Transaction hash
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "planId": "SINGLE_CALCULATION",
    "features": ["Leverage Impact Simulator"],
    "expiresAt": null  // null for one-time use, timestamp for subscriptions
  }
}
```

**Error Responses**:

- `400 Bad Request`: Missing required fields or invalid transaction
- `500 Internal Server Error`: Server error

### AI Insight Endpoints

#### Get Insight

Generates an AI insight for a trade calculation.

- **URL**: `/api/insight`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "positionSize": 10,  // Position size in units of the asset
  "riskAmount": 100,  // Risk amount in USD
  "rewardAmount": 200,  // Reward amount in USD
  "riskRewardRatio": 2,  // Risk/reward ratio
  "marginRequired": 41000  // Margin required in USD
}
```

**Response**:

```json
{
  "insight": "Your trade has a favorable risk/reward ratio of 2:1, which is generally considered good practice. With a position size of 10 BTC, you're risking $100 to potentially gain $200. The margin required is $41,000, which is 100% of your position value since you're using 1x leverage."
}
```

**Error Responses**:

- `500 Internal Server Error`: Server error

### Farcaster Frame Endpoints

#### Frame

Handles Farcaster frame requests.

- **URL**: `/api/frame`
- **Method**: `GET` or `POST`
- **Content-Type**: `application/json` (for POST)

**GET Response**:

Returns HTML for the initial frame.

**POST Request Body**:

Farcaster frame message format.

**POST Response**:

Returns HTML for the response frame.

#### Frame Image

Generates images for Farcaster frames.

- **URL**: `/api/frame/image`
- **Method**: `GET`

**Query Parameters**:

- `type`: Frame type (`initial`, `result`, or `error`)
- Additional parameters depending on the frame type

**Response**:

Returns a PNG image.

## Error Codes

- `400 Bad Request`: The request was invalid or cannot be served
- `500 Internal Server Error`: An error occurred on the server

## Rate Limits

Currently, there are no rate limits implemented for the API.

## Versioning

The current API version is v1. All endpoints are prefixed with `/api/`.

## Support

For API support, please contact the development team.

