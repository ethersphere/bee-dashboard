import { BZZ, DAI, EthAddress } from '@upcoming/bee-js'
import { providers, Wallet } from 'ethers'
import { estimateNativeTransferTransactionCost, Rpc } from './rpc'

export class ResolvedWallet {
  public address: string
  public privateKey: string

  private constructor(
    public wallet: Wallet,
    public bzz: BZZ,
    public dai: DAI,
    public provider: providers.JsonRpcProvider,
  ) {
    this.address = wallet.address
    this.privateKey = wallet.privateKey
  }

  static async make(privateKeyOrWallet: string | Wallet, provider: providers.JsonRpcProvider): Promise<ResolvedWallet> {
    const wallet =
      typeof privateKeyOrWallet === 'string' ? new Wallet(privateKeyOrWallet, provider) : privateKeyOrWallet
    const address = wallet.address
    const bzz = await Rpc._eth_getBalanceERC20(address, provider)
    const dai = await Rpc._eth_getBalance(address, provider)

    return new ResolvedWallet(wallet, bzz, dai, provider)
  }

  public async refresh(): Promise<ResolvedWallet> {
    this.bzz = await Rpc._eth_getBalanceERC20(this.address, this.provider)
    this.dai = await Rpc._eth_getBalance(this.address, this.provider)

    return this
  }

  public async transfer(destination: EthAddress | string, jsonRpcProvider: string): Promise<void> {
    if (this.bzz.gt(BZZ.fromDecimalString('0.05'))) {
      await Rpc.sendBzzTransaction(this.privateKey, destination, this.bzz, jsonRpcProvider)
      await this.refresh()
    }

    const { gasPrice, totalCost } = await estimateNativeTransferTransactionCost(this.privateKey, jsonRpcProvider)

    if (this.dai.gt(totalCost)) {
      await Rpc.sendNativeTransaction(
        this.privateKey,
        destination,
        this.dai.minus(totalCost),
        jsonRpcProvider,
        gasPrice,
      )
      await this.refresh()
    }
  }
}
