import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';

import { createTicketSoldEvent } from './fuck-ticketmaster-utils';
import { handleTicketSold } from '../src/fuck-ticketmaster';
import { log } from '@graphprotocol/graph-ts';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Describe entity assertions', () => {
  beforeAll(() => {
    let account = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    );
    // log.info('hello ad {}', [account.toHexString()]);
    let event = createTicketSoldEvent(
      account,
      new BigInt(1),
      'uuid',
      new BigInt(2)
    );
    // log.info('hello event {}', [event.params.owner.toHexString()]);
    // console.log(newApprovalForAllEvent.owner());
    // log.info('ticket {} tokenId: {}, ticketId: {}, quantity:{}', [
    //   event.params.owner.toString(),
    //   event.params.tokenId.toString(),
    //   event.params.ticketId.toString(),
    //   event.params.quantity.toString(),
    // ]);
    handleTicketSold(event);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test('ticket sold event address is stored as a string', () => {
    assert.entityCount('TicketSold', 1);
    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    // assert.fieldEquals(
    //   'TicketSold',
    //   '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
    //   'owner',
    //   '0x0000000000000000000000000000000000000001'
    // );
    // assert.fieldEquals(
    //   'ApprovalForAll',
    //   '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
    //   'operator',
    //   '0x0000000000000000000000000000000000000001'
    // );
    // assert.fieldEquals(
    //   'ApprovalForAll',
    //   '0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1',
    //   'approved',
    //   'boolean Not implemented'
    // );
    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
