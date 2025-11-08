import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: any) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  let mockedAxiosInstance: { get: jest.Mock };

  beforeEach(() => {
    mockedAxiosInstance = {
      get: jest.fn(),
    };
    mockedAxios.create.mockReturnValue(mockedAxiosInstance as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const relativePath = '/posts';
    mockedAxiosInstance.get.mockResolvedValue({ data: [] });

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts/1';
    mockedAxiosInstance.get.mockResolvedValue({ data: { id: 1 } });

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxiosInstance.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/users';
    const mockData = [{ id: 1, name: 'User' }];
    mockedAxiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockData);
  });
});
