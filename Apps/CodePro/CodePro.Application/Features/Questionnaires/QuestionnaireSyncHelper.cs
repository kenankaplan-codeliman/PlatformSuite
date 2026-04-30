using CodePro.Application.Features.Questionnaires.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Questionnaires;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Questionnaires;

internal static class QuestionnaireSyncHelper
{
    /// <summary>
    /// Verilen Question + Option listesini hedef anketle senkronize eder
    /// (eksikleri ekler, fazlaları siler, eşleşenleri günceller).
    /// </summary>
    public static async Task SyncQuestionsAsync(
        ICodeProDbContext db,
        Guid questionnaireId,
        IReadOnlyList<QuestionnaireQuestionItem> incoming,
        CancellationToken cancellationToken)
    {
        var existing = await db.QuestionnaireQuestion
            .Include(q => q.Options)
            .Where(q => q.QuestionnaireId == questionnaireId)
            .ToListAsync(cancellationToken);

        var incomingByKey = incoming
            .Where(q => q.Id != Guid.Empty)
            .ToDictionary(q => q.Id, q => q);
        var existingByKey = existing.ToDictionary(q => q.Id, q => q);

        // 1) Silinecekler
        var toRemove = existing.Where(e => !incomingByKey.ContainsKey(e.Id)).ToList();
        if (toRemove.Count > 0) db.QuestionnaireQuestion.RemoveRange(toRemove);

        // 2) Güncellenecekler + 3) Eklenecekler
        foreach (var item in incoming)
        {
            if (item.Id != Guid.Empty && existingByKey.TryGetValue(item.Id, out var current))
            {
                current.QuestionText = item.QuestionText;
                current.QuestionType = item.QuestionType;
                current.IsRequired = item.IsRequired;
                current.OrderIndex = item.OrderIndex;

                SyncOptions(db, current, item.Options);
            }
            else
            {
                var question = new QuestionnaireQuestion
                {
                    QuestionnaireId = questionnaireId,
                    QuestionText = item.QuestionText,
                    QuestionType = item.QuestionType,
                    IsRequired = item.IsRequired,
                    OrderIndex = item.OrderIndex,
                };
                foreach (var opt in item.Options)
                {
                    question.Options.Add(new QuestionnaireQuestionOption
                    {
                        OptionText = opt.OptionText,
                        OrderIndex = opt.OrderIndex,
                    });
                }
                db.QuestionnaireQuestion.Add(question);
            }
        }
    }

    private static void SyncOptions(
        ICodeProDbContext db,
        QuestionnaireQuestion question,
        IReadOnlyList<QuestionnaireQuestionOptionItem> incoming)
    {
        var existing = question.Options.ToList();
        var incomingByKey = incoming
            .Where(o => o.Id != Guid.Empty)
            .ToDictionary(o => o.Id, o => o);
        var existingByKey = existing.ToDictionary(o => o.Id, o => o);

        var toRemove = existing.Where(e => !incomingByKey.ContainsKey(e.Id)).ToList();
        foreach (var rem in toRemove) question.Options.Remove(rem);

        foreach (var item in incoming)
        {
            if (item.Id != Guid.Empty && existingByKey.TryGetValue(item.Id, out var current))
            {
                current.OptionText = item.OptionText;
                current.OrderIndex = item.OrderIndex;
            }
            else
            {
                question.Options.Add(new QuestionnaireQuestionOption
                {
                    OptionText = item.OptionText,
                    OrderIndex = item.OrderIndex,
                });
            }
        }
    }
}
