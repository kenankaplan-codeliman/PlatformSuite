using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface ICacheService
    {
        /// <summary>
        /// Get value from cache
        /// </summary>
        Task<T?> GetAsync<T>(string key);

        /// <summary>
        /// Get string value from cache
        /// </summary>
        Task<string?> GetStringAsync(string key);

        /// <summary>
        /// Set value in cache with options
        /// </summary>
        Task SetAsync<T>(string key, T value, DateTime? expiration = null);

        /// <summary>
        /// Set string value in cache
        /// </summary>
        Task SetStringAsync(string key, string value, DateTime? expiration = null);

        /// <summary>
        /// Check if key exists in cache
        /// </summary>
        Task<bool> ExistsAsync(string key);

        /// <summary>
        /// Remove key from cache
        /// </summary>
        Task RemoveAsync(string key);

        /// <summary>
        /// Remove multiple keys from cache
        /// </summary>
        Task RemoveAsync(IEnumerable<string> keys);

        /// <summary>
        /// Get multiple values from cache
        /// </summary>
        Task<Dictionary<string, T>> GetManyAsync<T>(IEnumerable<string> keys);

        /// <summary>
        /// Get all keys matching a pattern (for debugging/admin)
        /// </summary>
        Task<List<string>> GetKeysAsync(string pattern);

        /// <summary>
        /// Clear all cache (use with caution)
        /// </summary>
        Task ClearAllAsync();
    }
}
