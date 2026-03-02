import { BZZ, DAI, EthAddress } from '@ethersphere/bee-js'
import { JsonRpcProvider, Wallet } from 'ethers'

import { estimateNativeTransferTransactionCost, RPC } from './rpc'

export class WalletAddress {
  private constructor(
    public address: string,
    public bzz: BZZ,
    public dai: DAI,
    public provider: JsonRpcProvider,
  ) {}

  static async make(address: string, provider: JsonRpcProvider): Promise<WalletAddress> {
    const bzz = await RPC._eth_getBalanceERC20(address, provider)
    const dai = await RPC._eth_getBalance(address, provider)

    return new WalletAddress(address, bzz, dai, provider)
  }

  public async refresh(): Promise<WalletAddress> {
    this.bzz = await RPC._eth_getBalanceERC20(this.address, this.provider)
    this.dai = await RPC._eth_getBalance(this.address, this.provider)

    return this
  }
}

export class ResolvedWallet {
  public address: string
  public privateKey: string

  private constructor(
    public wallet: Wallet,
    public bzz: BZZ,
    public dai: DAI,
    public provider: JsonRpcProvider,
  ) {
    this.address = wallet.address
    this.privateKey = wallet.privateKey
  }

  static async make(privateKeyOrWallet: string | Wallet, provider: JsonRpcProvider): Promise<ResolvedWallet> {
    const wallet =
      typeof privateKeyOrWallet === 'string' ? new Wallet(privateKeyOrWallet, provider) : privateKeyOrWallet
    const address = wallet.address
    const bzz = await RPC._eth_getBalanceERC20(address, provider)
    const dai = await RPC._eth_getBalance(address, provider)

    return new ResolvedWallet(wallet, bzz, dai, provider)
  }

  public async refresh(): Promise<ResolvedWallet> {
    this.bzz = await RPC._eth_getBalanceERC20(this.address, this.provider)
    this.dai = await RPC._eth_getBalance(this.address, this.provider)

    return this
  }

  public async transfer(destination: EthAddress | string, jsonRpcProviderUrl: string): Promise<void> {
    if (this.bzz.gt(BZZ.fromDecimalString('0.05'))) {
      await RPC.sendBzzTransaction(this.privateKey, destination, this.bzz, jsonRpcProviderUrl)
      await this.refresh()
    }

    const { gasPrice, totalCost } = await estimateNativeTransferTransactionCost(this.privateKey, jsonRpcProviderUrl)

    if (this.dai.gt(totalCost)) {
      await RPC.sendNativeTransaction(
        this.privateKey,
        destination,
        this.dai.minus(totalCost),
        jsonRpcProviderUrl,
        gasPrice,
      )
      await this.refresh()
    }
  }
}
