using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Infrastructure.Data.Converters;

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


/// <summary>
/// Generic Enum to String converter for EF Core
/// Enum değerlerini veritabanında string olarak saklar
/// </summary>
/// <typeparam name="TEnum">Enum tipi</typeparam>
public class EnumToStringConverter<TEnum> : ValueConverter<TEnum, string>
    where TEnum : struct, Enum
{
    public EnumToStringConverter()
        : base(
            enumValue => enumValue.ToString(),
            stringValue => Enum.Parse<TEnum>(stringValue, ignoreCase: true))
    {
    }
}

/// <summary>
/// Nullable Enum to String converter for EF Core
/// </summary>
/// <typeparam name="TEnum">Enum tipi</typeparam>
public class NullableEnumToStringConverter<TEnum> : ValueConverter<TEnum?, string?>
    where TEnum : struct, Enum
{
    public NullableEnumToStringConverter()
        : base(
            enumValue => enumValue.HasValue ? enumValue.Value.ToString() : null,
            stringValue => string.IsNullOrEmpty(stringValue) ? null : Enum.Parse<TEnum>(stringValue, ignoreCase: true))
    {
    }
}