import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRetry } from './useRetry';

describe('useRetry', () => {
  it('should successfully execute function on first attempt', async () => {
    const { result } = renderHook(() => useRetry());
    const mockFn = vi.fn().mockResolvedValue('success');

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current.retry(mockFn);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe('success');
    expect(result.current.retryState.isRetrying).toBe(false);
    expect(result.current.retryState.retryCount).toBe(0);
  });

  it('should retry on failure and succeed on second attempt', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 2 }));
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce('success');

    let returnValue: string | undefined;
    await act(async () => {
      returnValue = await result.current.retry(mockFn);
    });

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    expect(returnValue).toBe('success');
    expect(result.current.retryState.isRetrying).toBe(false);
    expect(result.current.retryState.retryCount).toBe(0);
  });

  it('should fail after max retries', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 2 }));
    const error = new Error('Persistent failure');
    const mockFn = vi.fn().mockRejectedValue(error);

    await act(async () => {
      await expect(result.current.retry(mockFn)).rejects.toThrow('Persistent failure');
    });

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    expect(result.current.retryState.isRetrying).toBe(false);
    expect(result.current.retryState.retryCount).toBe(2);
    expect(result.current.retryState.lastError).toEqual(error);
  });

  it('should call onRetry callback on each retry', async () => {
    const onRetry = vi.fn();
    const { result } = renderHook(() => useRetry({ maxRetries: 2, onRetry }));
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValueOnce('success');

    await act(async () => {
      await result.current.retry(mockFn);
    });

    await waitFor(() => {
      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error));
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error));
  });

  it('should call onSuccess callback on success', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useRetry({ onSuccess }));
    const mockFn = vi.fn().mockResolvedValue('success');

    await act(async () => {
      await result.current.retry(mockFn);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('should call onMaxRetriesReached callback when max retries reached', async () => {
    const onMaxRetriesReached = vi.fn();
    const { result } = renderHook(() => useRetry({ maxRetries: 1, onMaxRetriesReached }));
    const error = new Error('Failure');
    const mockFn = vi.fn().mockRejectedValue(error);

    await act(async () => {
      await expect(result.current.retry(mockFn)).rejects.toThrow();
    });

    await waitFor(() => {
      expect(onMaxRetriesReached).toHaveBeenCalledTimes(1);
    });

    expect(onMaxRetriesReached).toHaveBeenCalledWith(error);
  });

  it('should reset retry state', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 1 }));
    const mockFn = vi.fn().mockRejectedValue(new Error('Failure'));

    await act(async () => {
      await expect(result.current.retry(mockFn)).rejects.toThrow();
    });

    await waitFor(() => {
      expect(result.current.retryState.retryCount).toBe(1);
    });

    act(() => {
      result.current.resetRetry();
    });

    expect(result.current.retryState.isRetrying).toBe(false);
    expect(result.current.retryState.retryCount).toBe(0);
    expect(result.current.retryState.lastError).toBeNull();
  });

  it('should update retry state during retries', async () => {
    const { result } = renderHook(() => useRetry({ maxRetries: 2 }));
    const mockFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce('success');

    const promise = act(async () => {
      await result.current.retry(mockFn);
    });

    // Check state during retry
    await waitFor(() => {
      expect(result.current.retryState.isRetrying).toBe(true);
    });

    await promise;

    // Check state after success
    expect(result.current.retryState.isRetrying).toBe(false);
    expect(result.current.retryState.retryCount).toBe(0);
  });
});
