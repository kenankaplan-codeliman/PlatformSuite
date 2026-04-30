using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface ICacheService
    {
        /// <summary>
        /// Get value from cache
        /// </summary>
        T? Get<T>(string key);

        /// <summary>
        /// Set value in cache with options
        /// </summary>
        void Set<T>(string key, T value, DateTime? expiration = null);

        /// <summary>
        /// Remove key from cache
        /// </summary>
        void Remove(string key);


    }
}
