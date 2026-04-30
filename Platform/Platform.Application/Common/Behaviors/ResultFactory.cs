using System.Reflection;
using Platform.Application.Common.Results;

namespace Platform.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior'ları içinde generic TResponse'un Result veya Result&lt;T&gt;
/// olduğunu tespit edip uygun failure instance'ını üretir.
/// </summary>
internal static class ResultFactory
{
    public static TResponse Failure<TResponse>(Error error)
    {
        var type = typeof(TResponse);

        if (type == typeof(Result))
        {
            return (TResponse)(object)Result.Failure(error);
        }

        if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Result<>))
        {
            var valueType = type.GetGenericArguments()[0];
            var method = typeof(Result)
                .GetMethod(nameof(Result.Failure), 1, BindingFlags.Public | BindingFlags.Static, null,
                    new[] { typeof(Error) }, null)
                ?? throw new InvalidOperationException("Result.Failure<T>(Error) generic tanımı bulunamadı.");

            var generic = method.MakeGenericMethod(valueType);
            var result = generic.Invoke(null, new object[] { error })!;
            return (TResponse)result;
        }

        throw new InvalidOperationException(
            $"Pipeline behavior yalnızca Result veya Result<T> döndüren request'leri destekler. TResponse = {type.FullName}");
    }
}
