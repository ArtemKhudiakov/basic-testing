// Uncomment the code below and write your tests
import { getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(666);
    expect(account.getBalance()).toBe(666);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(666);
    expect(() => account.withdraw(1000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(666);
    expect(() => account.transfer(1000, getBankAccount(666))).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(666);
    expect(() => account.transfer(1000, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(666);
    account.deposit(100);
    expect(account.getBalance()).toBe(766);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(666);
    account.withdraw(100);
    expect(account.getBalance()).toBe(566);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(666);
    const account2 = getBankAccount(100);
    account1.transfer(100, account2);
    expect(account1.getBalance()).toBe(566);
    expect(account2.getBalance()).toBe(200);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(666);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(100);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
    expect(balance).toBe(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(666);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(200);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(200);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(666);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
