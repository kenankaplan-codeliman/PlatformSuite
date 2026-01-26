using CRM.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace CRM.Infrastructure.Cache
{
    public class MemoryCacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<MemoryCacheService> _logger;

        public MemoryCacheService(
            IMemoryCache memoryCache,
            ILogger<MemoryCacheService> logger)
        {
            _memoryCache = memoryCache;
            _logger = logger;
        }

        public Task<T?> GetAsync<T>(string key)
        {
            try
            {
                if (_memoryCache.TryGetValue(key, out T? value))
                {
                    return Task.FromResult(value);
                }

                return Task.FromResult<T?>(default);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting key {Key} from memory cache", key);
                return Task.FromResult<T?>(default);
            }
        }

        public async Task<string?> GetStringAsync(string key)
        {
            return await GetAsync<string>(key);
        }

        public Task SetAsync<T>(string key, T value, DateTime? expiration = null)
        {
            try
            {
                var cacheOptions = new MemoryCacheEntryOptions();

                if (expiration.HasValue) {
                    cacheOptions.SetAbsoluteExpiration(expiration.Value);
                }
             
                _memoryCache.Set(key, value, cacheOptions);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting key {Key} in memory cache", key);
                return Task.CompletedTask;
            }
        }

        public async Task SetStringAsync(string key, string value, DateTime? expiration = null)
        {
            await SetAsync(key, value, expiration);
        }

        public Task<bool> ExistsAsync(string key)
        {
            try
            {
                return Task.FromResult(_memoryCache.TryGetValue(key, out _));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking existence of key {Key}", key);
                return Task.FromResult(false);
            }
        }

        public Task RemoveAsync(string key)
        {
            try
            {
                _memoryCache.Remove(key);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing key {Key} from memory cache", key);
                return Task.CompletedTask;
            }
        }

        public Task RemoveAsync(IEnumerable<string> keys)
        {
            try
            {
                foreach (var key in keys)
                {
                    _memoryCache.Remove(key);
                }
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing multiple keys from memory cache");
                return Task.CompletedTask;
            }
        }

        public Task<Dictionary<string, T>> GetManyAsync<T>(IEnumerable<string> keys)
        {
            try
            {
                var result = new Dictionary<string, T>();

                foreach (var key in keys)
                {
                    if (_memoryCache.TryGetValue(key, out T? value) && value != null)
                    {
                        result[key] = value;
                    }
                }

                return Task.FromResult(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting multiple keys from memory cache");
                return Task.FromResult(new Dictionary<string, T>());
            }
        }

        public Task<List<string>> GetKeysAsync(string pattern)
        {
            throw new NotImplementedException();
        }

        public Task ClearAllAsync()
        {
            throw new NotImplementedException();
        }
    }
}

