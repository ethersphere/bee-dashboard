import Wallet from 'ethereumjs-wallet'
import { BzzToken } from '../models/BzzToken'
import { DaiToken } from '../models/DaiToken'
import { getWalletFromPrivateKeyString } from './identity'
import { Rpc } from './rpc'

export class ResolvedWallet {
  public address: string
  public privateKey: string

  private constructor(public wallet: Wallet, public bzz: BzzToken, public dai: DaiToken) {
    this.address = wallet.getAddressString()
    this.privateKey = wallet.getPrivateKeyString()
  }

  static async make(privateKeyOrWallet: string | Wallet): Promise<ResolvedWallet> {
    const wallet =
      typeof privateKeyOrWallet === 'string' ? getWalletFromPrivateKeyString(privateKeyOrWallet) : privateKeyOrWallet
    const address = wallet.getAddressString()
    const bzz = new BzzToken(await Rpc._eth_getBalanceERC20(address))
    const dai = new DaiToken(await Rpc._eth_getBalance(address))

    return new ResolvedWallet(wallet, bzz, dai)
  }

  public async refresh(): Promise<ResolvedWallet> {
    this.bzz = new BzzToken(await Rpc._eth_getBalanceERC20(this.address))
    this.dai = new DaiToken(await Rpc._eth_getBalance(this.address))

    return this
  }

  public async transfer(
    destination: string,
    jsonRpcProvider = 'https://gno.getblock.io/mainnet/?api_key=d7b92d96-9784-49a8-a800-b3edd1647fc7',
  ): Promise<void> {
    const DUMMY_GAS_PRICE = '300000000000000'

    if (this.bzz.toDecimal.gt(0.1)) {
      await Rpc.sendBzzTransaction(this.privateKey, destination, this.bzz.toString, jsonRpcProvider)
    }

    if (this.dai.toBigNumber.gt(DUMMY_GAS_PRICE)) {
      await Rpc.sendNativeTransaction(
        this.privateKey,
        destination,
        this.dai.toBigNumber.minus(DUMMY_GAS_PRICE).toString(),
        jsonRpcProvider,
      )
    }
  }
}
