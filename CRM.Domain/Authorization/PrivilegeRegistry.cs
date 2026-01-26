using System;
using System.Collections.Generic;
using System.Text;
using System.Reflection;

namespace CRM.Domain.Authorization
{
    public static class PrivilegeRegistry
    {
        public static IReadOnlyCollection<string> All { get; }

        static PrivilegeRegistry()
        {
            All = GetAllConstants(typeof(PrivilegeCodes))
                .Distinct(StringComparer.Ordinal)
                .OrderBy(c => c)
                .ToList()
                .AsReadOnly();
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
