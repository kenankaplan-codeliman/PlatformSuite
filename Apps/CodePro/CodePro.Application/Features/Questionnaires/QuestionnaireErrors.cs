using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Questionnaires;

public static class QuestionnaireErrors
{
    public static readonly Error NotFound =
        new("Questionnaire.NotFound", "Anket bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("Questionnaire.DuplicateName", "Aynı isimde başka bir anket kayıtlı.", ErrorType.Conflict);
}
