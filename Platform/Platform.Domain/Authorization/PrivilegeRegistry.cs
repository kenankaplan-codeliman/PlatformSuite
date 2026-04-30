using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Platform.Domain.Authorization
{
    /// <summary>
    /// Sistemde tanımlı tüm privilege code'larının kataloğu. Platform <see cref="PrivilegeCodes"/>
    /// otomatik kayıtlı; uygulamalar (CRM, CodePro, ...) kendi PrivilegeCodes tipini
    /// <see cref="Register(Type)"/> ile ekleyerek seed'e dahil eder. Tipik kullanım:
    /// <c>PrivilegeRegistry.Register(typeof(CrmPrivilegeCodes))</c> — uygulama startup'ında
    /// (Crm.Application.AddCrmApplication içinde) bir kez çağrılır.
    /// </summary>
    public static class PrivilegeRegistry
    {
        private static readonly HashSet<Type> _types = new();
        private static readonly object _lock = new();

        static PrivilegeRegistry()
        {
            Register(typeof(PrivilegeCodes));
        }

        public static void Register(Type type)
        {
            lock (_lock)
            {
                _types.Add(type);
            }
        }

        public static IReadOnlyCollection<string> All
        {
            get
            {
                lock (_lock)
                {
                    return _types
                        .SelectMany(GetAllConstants)
                        .Distinct(StringComparer.Ordinal)
                        .OrderBy(c => c)
                        .ToList()
                        .AsReadOnly();
                }
            }
        }

        private static IEnumerable<string> GetAllConstants(Type type)
        {
            var ownConstants = type
                .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                .Where(f => f.IsLiteral && !f.IsInitOnly && f.FieldType == typeof(string))
                .Select(f => (string)f.GetRawConstantValue()!);

            foreach (var constant in ownConstants)
            {
                yield return constant;
            }

            // Nested type'ları recursive olarak tara
            var nestedTypes = type.GetNestedTypes(BindingFlags.Public | BindingFlags.Static);

            foreach (var nestedType in nestedTypes)
            {
                foreach (var constant in GetAllConstants(nestedType))
                {
                    yield return constant;
                }
            }
        }
    }
}
