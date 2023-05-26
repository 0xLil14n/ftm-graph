import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  ERC20PaymentReleased,
  OwnershipTransferred,
  PayeeAdded,
  PaymentReceived,
  PaymentReleased,
  RoyaltyDisbursed,
  TicketResold,
  TicketSold,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/FuckTicketmaster/FuckTicketmaster"

export function createApprovalForAllEvent(
  account: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createERC20PaymentReleasedEvent(
  token: Address,
  to: Address,
  amount: BigInt
): ERC20PaymentReleased {
  let erc20PaymentReleasedEvent = changetype<ERC20PaymentReleased>(
    newMockEvent()
  )

  erc20PaymentReleasedEvent.parameters = new Array()

  erc20PaymentReleasedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  erc20PaymentReleasedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  erc20PaymentReleasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return erc20PaymentReleasedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPayeeAddedEvent(
  account: Address,
  shares: BigInt
): PayeeAdded {
  let payeeAddedEvent = changetype<PayeeAdded>(newMockEvent())

  payeeAddedEvent.parameters = new Array()

  payeeAddedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  payeeAddedEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return payeeAddedEvent
}

export function createPaymentReceivedEvent(
  from: Address,
  amount: BigInt
): PaymentReceived {
  let paymentReceivedEvent = changetype<PaymentReceived>(newMockEvent())

  paymentReceivedEvent.parameters = new Array()

  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentReceivedEvent
}

export function createPaymentReleasedEvent(
  to: Address,
  amount: BigInt
): PaymentReleased {
  let paymentReleasedEvent = changetype<PaymentReleased>(newMockEvent())

  paymentReleasedEvent.parameters = new Array()

  paymentReleasedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  paymentReleasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentReleasedEvent
}

export function createRoyaltyDisbursedEvent(
  owner: Address,
  tokenId: BigInt,
  profit: BigInt
): RoyaltyDisbursed {
  let royaltyDisbursedEvent = changetype<RoyaltyDisbursed>(newMockEvent())

  royaltyDisbursedEvent.parameters = new Array()

  royaltyDisbursedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  royaltyDisbursedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  royaltyDisbursedEvent.parameters.push(
    new ethereum.EventParam("profit", ethereum.Value.fromUnsignedBigInt(profit))
  )

  return royaltyDisbursedEvent
}

export function createTicketResoldEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): TicketResold {
  let ticketResoldEvent = changetype<TicketResold>(newMockEvent())

  ticketResoldEvent.parameters = new Array()

  ticketResoldEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ticketResoldEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  ticketResoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return ticketResoldEvent
}

export function createTicketSoldEvent(
  owner: Address,
  tokenId: BigInt,
  ticketId: string,
  quantity: BigInt
): TicketSold {
  let ticketSoldEvent = changetype<TicketSold>(newMockEvent())

  ticketSoldEvent.parameters = new Array()

  ticketSoldEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  ticketSoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  ticketSoldEvent.parameters.push(
    new ethereum.EventParam("ticketId", ethereum.Value.fromString(ticketId))
  )
  ticketSoldEvent.parameters.push(
    new ethereum.EventParam(
      "quantity",
      ethereum.Value.fromUnsignedBigInt(quantity)
    )
  )

  return ticketSoldEvent
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )

  return transferBatchEvent
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let transferSingleEvent = changetype<TransferSingle>(newMockEvent())

  transferSingleEvent.parameters = new Array()

  transferSingleEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferSingleEvent
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}
