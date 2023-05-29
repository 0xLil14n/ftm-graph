import {
  FuckTicketmaster,
  RoyaltyDisbursed as RoyaltyDisbursedEvent,
  TicketResold as TicketResoldEvent,
  TicketSold as TicketSoldEvent,
  TokenListedForSale as TokenListedForSaleEvent,
} from '../generated/FuckTicketmaster/FuckTicketmaster';
import {
  Listing,
  RoyaltyDisbursed,
  Ticket,
  TicketOption,
  TicketResold,
  TicketSold,
  User,
} from '../generated/schema';
import { log } from '@graphprotocol/graph-ts';

export function handleRoyaltyDisbursed(event: RoyaltyDisbursedEvent): void {
  let entity = new RoyaltyDisbursed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.tokenId = event.params.tokenId;
  entity.profit = event.params.profit;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTicketResold(event: TicketResoldEvent): void {
  let ticket = TicketOption.load(event.params.tokenId.toString());
  if (!ticket) {
    ticket = new TicketOption(event.params.tokenId.toString());
  }
  ticket.owner = event.params.to.toHexString();
  ticket.quantity = event.params.amount;
  let contract = FuckTicketmaster.bind(event.address);

  let entity = new TicketResold(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTicketSold(event: TicketSoldEvent): void {
  log.error('Event {}', [event.params.owner.toHexString()]);
  let user = User.load(event.params.owner.toHexString());
  if (!user) {
    user = new User(event.params.owner.toHexString());
    user.tickets = [];
  }
  let contract = FuckTicketmaster.bind(event.address);
  const id = user.id
    .toString()
    .concat('-')
    .concat(event.params.tokenId.toString())
    .concat('-ga');
  const ticket = new Ticket(id);

  ticket.ticketId = event.params.tokenId;
  ticket.quantity = event.params.quantity;
  ticket.save();
  let tickets = user.tickets;
  tickets.push(ticket.id);
  user.tickets = tickets;
  user.save();
}

export function handleTokenListedForSale(event: TokenListedForSaleEvent): void {
  const id = `${event.params.owner.toHexString().slice(0, 5)}-${
    event.params.tokenId
  }-${event.block.hash.slice(0, 5)}`;
  let listing = new Listing(id);
  listing.priceInWei = event.params.price;
  let user = User.load(event.params.owner.toHexString());
  if (!user) {
    throw new Error('user does not exist');
    return;
  }
  listing.listedBy = user.id;
  listing.supplyLeft = event.params.amount;
  listing.ticketId = event.params.tokenId;
  listing.save();
}
