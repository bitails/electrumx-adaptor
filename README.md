# Bitails ElectrumX Adapter

## Overview

This repository contains the Bitails ElectrumX Adapter, a Node.js/NestJS application designed to bridge ElectrumSV clients with the Bitails backend API, emulating ElectrumX server functionality. While commonly used for ElectrumSV, this adapter facilitates interactions between various ElectrumSV clients and Bitails, leveraging the full range of ElectrumX capabilities, including transaction history, balance inquiries, and more.

Implementing the API is straightforward for individual use or development with a single wallet. However, to serve multiple wallets concurrently and ensure optimal performance, it's advisable to use a unique Bitails API key for each user to prevent hitting rate limits on the Bitails backend.

## Features

- Supports the full ElectrumX protocol, commonly used with ElectrumSV clients.
- Seamless integration with the Bitails backend API.
- Enhanced performance and reliability for users accessing Bitails services through ElectrumSV clients.
- Designed for easy setup and deployment, allowing for quick starts with minimal configuration.

## Prerequisites

- Node.js (v14 or later)
- NestJS (v7 or later)
- Access to the Bitails API with a unique API key for large-scale or multi-wallet deployments.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Omegachains/bitails-electrumx-adaptor.git
   cd bitails-electrumx-adaptor
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configuration**

   - Copy the sample configuration file: `cp .env.sample .env`.
   - Edit `.env` to include your Bitails API credentials and other configurations. Ensure each deployment or user has a unique Bitails API key to manage rate limiting effectively.

4. **Start the Adapter**
   ```bash
   npm run start
   ```

## Usage

Configure your ElectrumSV client to connect to the adapter's host and port as specified in your `.env` configuration file. The adapter will automatically manage requests from the client, interfacing with the Bitails backend API and returning results in the format recognized by ElectrumX clients. While it is commonly used with ElectrumSV, the adapter is designed to be client-agnostic, offering broad compatibility.

## Contributing

We welcome contributions to the Bitails ElectrumX Adapter. If you'd like to contribute, please fork the repository and use a feature branch for your developments. Pull requests are greatly appreciated.

1. Fork the Repository
2. Create Your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ElectrumX Protocol Support

This server implements a subset of the ElectrumX RPC protocol. Below is the complete list of methods defined in the ElectrumX documentation, along with their current implementation status in our server.

### Blockchain Methods

- [x] `blockchain.block.header`
- [x] `blockchain.block.headers`
- [x] `blockchain.estimatefee`
- [x] `blockchain.headers.subscribe`
- [x] `blockchain.relayfee`
- [x] `blockchain.scripthash.get_balance`
- [x] `blockchain.scripthash.get_history`
- [x] `blockchain.scripthash.get_mempool`
- [x] `blockchain.scripthash.listunspent`
- [x] `blockchain.scripthash.subscribe`
- [x] `blockchain.scripthash.unsubscribe`
- [x] `blockchain.transaction.broadcast`
- [x] `blockchain.transaction.get`
- [x] `blockchain.transaction.get_merkle`
- [ ] `blockchain.transaction.id_from_pos` - Not implemented.

### Server Methods

- [x] `server.banner`
- [x] `server.donation_address`
- [x] `server.features`
- [x] `server.peers.subscribe`
- [x] `server.ping`
- [x] `server.version`

### Mempool Methods

- [ ] `mempool.get_fee_histogram` - Not implemented.

### Not Yet Implemented

- [ ] Additional methods from the ElectrumX protocol not explicitly listed above are under consideration for future implementation. Our goal is to provide comprehensive support for the protocol to facilitate a wide range of use cases and enhance user experience.

### Note

The list above represents our current implementation status and may change as we continue to develop and update our server. Please check back for the latest updates on supported methods and new features.

## Demo and Production Testing

To facilitate the evaluation and deployment of this project, we provide the following endpoints:

- **TCP Connection**: `esv.bitails.io:50001`
- **TLS Connection**: `esv.bitails.io:50002`

These endpoints serve both as a demonstration of the Bitails ElectrumX Adapter's capabilities and as a test environment for integrating ElectrumSV clients. While they are fully functional and can be used for production purposes, we recommend conducting thorough testing to ensure they meet your specific requirements and adhere to your security standards.

## Support and Feedback

For support requests and feedback on the Bitails ElectrumX Adapter, please [open an issue](https://github.com/Omegachains/bitails-electrumx-adaptor/issues) in this repository.

## License

This project is licensed under the [MIT License](LICENSE.md) - see the LICENSE file for details.

## Acknowledgments

- The [ElectrumX community](https://electrumx.readthedocs.io) for the protocol specification.
- The NestJS team for the excellent framework.
- All contributors and users of the Bitails ElectrumX Adapter.
