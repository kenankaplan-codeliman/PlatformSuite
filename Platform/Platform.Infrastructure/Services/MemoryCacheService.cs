using Platform.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Platform.Infrastructure.Services;

public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<MemoryCacheService> _logger;

    public MemoryCacheService(IMemoryCache memoryCache, ILogger<MemoryCacheService> logger)
    {
        _memoryCache = memoryCache;
        _logger = logger;
    }

    public T? Get<T>(string key)
    {
        try
        {
            if (_memoryCache.TryGetValue(key, out T? value))
            {
                return value;
            }

            return default;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting key {Key} from memory cache", key);
            return default;
        }
    }

    public void Set<T>(string key, T value, DateTime? expiration = null)
    {
        try
        {
            var cacheOptions = new MemoryCacheEntryOptions();

            if (expiration.HasValue)
            {
                cacheOptions.SetAbsoluteExpiration(expiration.Value);
            }

            _memoryCache.Set(key, value, cacheOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting key {Key} in memory cache", key);
        }
    }

    public void Remove(string key)
    {
        try
        {
            _memoryCache.Remove(key);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error removing key {Key} from memory cache", key);
        }
    }

}


