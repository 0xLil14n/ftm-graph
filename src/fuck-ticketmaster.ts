import {
  FuckTicketmaster,
  PresaleStateUpdated as PresaleStateUpdatedEvent,
  PresaleCreated as PresaleCreatedEvent,
  RoyaltyDisbursed as RoyaltyDisbursedEvent,
  TicketCreated as TicketCreatedEvent,
  TicketResold as TicketResoldEvent,
  TicketSold as TicketSoldEvent,
  TokenListedForSale as TokenListedForSaleEvent,
} from '../generated/FuckTicketmaster/FuckTicketmaster';
import {
  Event,
  Listing,
  RoyaltyDisbursed,
  Ticket,
  TicketResold,
  TicketSold,
  User,
  Presale,
} from '../generated/schema';
import { BigInt, log } from '@graphprotocol/graph-ts';

export function handleTicketCreated(event: TicketCreatedEvent): void {
  let ticketEvent = new Event(event.params.ticketId.toString());
  let eventOwner = User.load(event.params.owner.toHexString());
  if (!eventOwner) {
    eventOwner = new User(event.params.owner.toHexString());
    eventOwner.tickets = [];
    eventOwner.save();
  }
  ticketEvent.eventOwner = eventOwner.id;
  ticketEvent.date = event.params.date;
  ticketEvent.eventName = event.params.eventName;
  ticketEvent.venueName = event.params.venueName;
  ticketEvent.save();

  let listing = new Listing(
    `${event.params.owner.toHexString()}-${event.params.ticketId}`
  );
  listing.priceInWei = event.params.priceInWei;
  listing.listedBy = eventOwner.id;
  listing.supplyLeft = event.params.ticketSupply;
  listing.ticketId = event.params.ticketId;
  listing.event = ticketEvent.id;
  listing.isResale = false;
  listing.save();
}

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
  log.info('handleTicketResold called', []);
  let oldOwner = User.load(event.params.from.toHexString());
  let newOwner = User.load(event.params.to.toHexString());
  if (!newOwner) {
    log.info('creating newOwner for {}', [event.params.to.toHexString()]);
    newOwner = new User(event.params.to.toHexString());
    newOwner.tickets = [];
  }
  if (!oldOwner || !newOwner) {
    log.error('Illegal args on handleTicketResold {} {}', [
      event.params.from.toHexString(),
      event.params.to.toHexString(),
    ]);
    return;
  }
  const tix = oldOwner.tickets;
  let amt = event.params.amount.toI32();
  const newOwnerTix = newOwner.tickets;
  const oldOwnerTix: string[] = [];

  for (let i = 0; i < tix.length; i++) {
    const id = tix[i];
    const ticket = Ticket.load(id);
    if (!ticket) {
      log.error('ticket not found for id: {}', [id]);
      continue;
    }
    if (ticket.ticketId == event.params.tokenId && amt > 0) {
      newOwnerTix.push(id);
      amt -= 1;
    } else {
      oldOwnerTix.push(id);
    }
  }
  const listingId = `${event.params.from.toHexString()}-${
    event.params.tokenId
  }`;
  const listing = Listing.load(listingId);
  if (!listing) {
    log.error('listing not found for listingId {}, owner {}', [
      listingId,
      event.params.from.toHexString(),
    ]);
    return;
  }
  listing.supplyLeft = new BigInt(listing.supplyLeft.toU32() - amt);
  listing.save();

  oldOwner.tickets = oldOwnerTix;
  oldOwner.save();
  newOwner.tickets = newOwnerTix;
  newOwner.save();
}

export function handleTicketSold(event: TicketSoldEvent): void {
  let user = User.load(event.params.owner.toHexString());
  if (!user) {
    user = new User(event.params.owner.toHexString());
    user.tickets = [];
  }

  const ticketEvent = Event.load(event.params.ticketId.toString());
  if (!ticketEvent) {
    log.error('handleTicketSold error, no ticket event found for ticketId {}', [
      event.params.ticketId.toString(),
    ]);
  } else {
    const listing = Listing.load(
      `${ticketEvent.eventOwner}-${event.params.ticketId}`
    );
    if (!listing) {
      log.error(
        'handleTicketSold error, no listing or ticket event found for ticketId {}',
        [event.params.ticketId.toString()]
      );
    } else {
      listing.supplyLeft = FuckTicketmaster.bind(event.address).totalSupply(
        event.params.ticketId
      );
    }
  }
  let tickets = user.tickets;
  for (let i = 0; i < parseInt(event.params.quantity.toString()); i++) {
    const id = `${event.transaction.hash.toHexString()}-${i}`;
    const ticket = new Ticket(id);
    ticket.ticketId = event.params.ticketId;
    ticket.owner = event.params.owner.toHexString();
    ticket.save();
    tickets.push(ticket.id);
  }

  user.tickets = tickets;
  user.save();
}

export function handleTokenListedForSale(event: TokenListedForSaleEvent): void {
  // id should be unique - only allow 1 sale per event at a time
  const id = `${event.params.owner.toHexString()}-${event.params.tokenId}`;
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
  listing.isResale = true;

  const listingEvent = Event.load(event.params.tokenId.toString());
  if (!listingEvent) {
    log.error('no event found for a resale listing for ticketId {}', [
      event.params.tokenId.toString(),
    ]);
  } else {
    listing.event = listingEvent.id;
  }
  listing.save();
}

export function handlePresaleCreated(event: PresaleCreatedEvent): void {
  const eventId = event.params.eventId;
  const ticketEvent = Event.load(eventId.toString());
  if (!ticketEvent) {
    log.error(
      'HandlePresaleCreated error: No ticket event found for eventId {}',
      [eventId.toString()]
    );
    return;
  }
  const presale = new Presale(eventId.toString());
  presale.event = eventId.toString();
  presale.startTime = event.params.startTime;
  presale.endTime = event.params.endTime;
  presale.state = 0;
  presale.save();
}

export function handlePresaleStateUpdated(
  event: PresaleStateUpdatedEvent
): void {
  const eventId = event.params.eventId.toString();
  const presale = Presale.load(eventId);
  if (!presale) {
    log.error('handlePresaleStateUpdated error finding presale for event {}', [
      eventId,
    ]);
    return;
  }
  presale.state = event.params.presaleStateAfter;
  // log.info("Presale state for event {} updating from {} to {}", [eventId, event.params.presaleStateBefore.toString(), event.params.presaleStateAfter.toString()]);
  presale.save();
}
