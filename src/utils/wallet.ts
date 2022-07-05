import { providers, Wallet } from 'ethers'
import { BzzToken } from '../models/BzzToken'
import { DaiToken } from '../models/DaiToken'
import { estimateNativeTransferTransactionCost, Rpc } from './rpc'

export class WalletAddress {
  private constructor(
    public address: string,
    public bzz: BzzToken,
    public dai: DaiToken,
    public provider: providers.JsonRpcProvider,
  ) {}

  static async make(address: string, provider: providers.JsonRpcProvider): Promise<WalletAddress> {
    const bzz = new BzzToken(await Rpc._eth_getBalanceERC20(address, provider))
    const dai = new DaiToken(await Rpc._eth_getBalance(address, provider))

    return new WalletAddress(address, bzz, dai, provider)
  }

  public async refresh(): Promise<WalletAddress> {
    this.bzz = new BzzToken(await Rpc._eth_getBalanceERC20(this.address, this.provider))
    this.dai = new DaiToken(await Rpc._eth_getBalance(this.address, this.provider))

    return this
  }
}

export class ResolvedWallet {
  public address: string
  public privateKey: string

  private constructor(
    public wallet: Wallet,
    public bzz: BzzToken,
    public dai: DaiToken,
    public provider: providers.JsonRpcProvider,
  ) {
    this.address = wallet.address
    this.privateKey = wallet.privateKey
  }

  static async make(privateKeyOrWallet: string | Wallet, provider: providers.JsonRpcProvider): Promise<ResolvedWallet> {
    const wallet =
      typeof privateKeyOrWallet === 'string' ? new Wallet(privateKeyOrWallet, provider) : privateKeyOrWallet
    const address = wallet.address
    const bzz = new BzzToken(await Rpc._eth_getBalanceERC20(address, provider))
    const dai = new DaiToken(await Rpc._eth_getBalance(address, provider))

    return new ResolvedWallet(wallet, bzz, dai, provider)
  }

  public async refresh(): Promise<ResolvedWallet> {
    this.bzz = new BzzToken(await Rpc._eth_getBalanceERC20(this.address, this.provider))
    this.dai = new DaiToken(await Rpc._eth_getBalance(this.address, this.provider))

    return this
  }

  public async transfer(destination: string, jsonRpcProvider: string): Promise<void> {
    if (this.bzz.toDecimal.gt(0.05)) {
      await Rpc.sendBzzTransaction(this.privateKey, destination, this.bzz.toString, jsonRpcProvider)
      await this.refresh()
    }

    const { gasPrice, totalCost } = await estimateNativeTransferTransactionCost(this.privateKey, jsonRpcProvider)

    if (this.dai.toBigNumber.gt(totalCost.toString())) {
      await Rpc.sendNativeTransaction(
        this.privateKey,
        destination,
        this.dai.toBigNumber.minus(totalCost.toString()).toString(),
        jsonRpcProvider,
        gasPrice,
      )
    }
  }
}
